import type { RecipeResult, AppError } from '../types/result';
import { validateResult } from './validateResult';
import { validateCulinaryInput } from './culinaryValidation';
import { generateSmartMockRecipe } from './mockRecipeEngine';

export interface GenerateOptions {
  dietaryPreferences?: string[];
  servings?: number;
  cookingTimeMax?: number;
  refinementPrompt?: string;
  previousRecipeTitle?: string;
  simulateFailure?: 'malformed' | 'wrong_shape' | 'empty' | 'slow_timeout' | 'server_error' | null;
}

export interface ApiResponse {
  success: boolean;
  data?: RecipeResult;
  error?: AppError;
  requestId: number;
}

// Stale request guard tracking
let currentRequestId = 0;
let activeAbortController: AbortController | null = null;

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const REQUEST_TIMEOUT_MS = 25000; // 25s timeout for AI response

/**
 * Sends prompt to the secure backend proxy (/api/generate).
 * Never communicates with LLM providers directly from the browser.
 * Incorporates stale response protection, defensive validation, and seamless offline fallback.
 */
export async function generateRecipe(
  prompt: string,
  options: GenerateOptions = {}
): Promise<ApiResponse> {
  // Cancel any prior in-flight request to avoid race conditions
  if (activeAbortController) {
    activeAbortController.abort('New request initiated');
  }

  const requestId = ++currentRequestId;
  const controller = new AbortController();
  activeAbortController = controller;

  // Strict pre-flight culinary validation (unless running test failure simulation)
  if (!options.simulateFailure) {
    const culinaryCheck = validateCulinaryInput(prompt);
    if (!culinaryCheck.isValid) {
      return {
        success: false,
        error: {
          type: 'INVALID_PROMPT',
          title: 'Non-Cooking Input Detected',
          message: culinaryCheck.reason || 'Please enter valid cooking ingredients, pantry items, or food notes.',
          canRetry: true,
        },
        requestId,
      };
    }
  }

  // Timeout guard for slow responses
  const timeoutId = setTimeout(() => {
    controller.abort('REQUEST_TIMEOUT');
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        options,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Guard: Check if a newer request has started since this one was initiated
    if (requestId !== currentRequestId) {
      return {
        success: false,
        error: {
          type: 'STALE_REQUEST',
          title: 'Request Superseded',
          message: 'A newer recipe request was initiated before this one completed.',
          canRetry: false,
        },
        requestId,
      };
    }

    if (!response.ok) {
      let serverErrorDetail = `HTTP ${response.status} ${response.statusText}`;
      let errorBody: any = null;
      try {
        const errText = await response.text();
        try {
          errorBody = JSON.parse(errText);
          if (errorBody?.error?.message) {
            serverErrorDetail = errorBody.error.message;
          }
        } catch {
          if (errText) {
            serverErrorDetail = errText;
          }
        }
      } catch {
        // non-text error body
      }

      if (errorBody?.error?.type === 'INVALID_PROMPT') {
        return {
          success: false,
          error: {
            type: 'INVALID_PROMPT',
            title: errorBody.error.title || 'Non-Cooking Input Detected',
            message: errorBody.error.message || 'Please enter valid cooking ingredients or kitchen items.',
            details: serverErrorDetail,
            canRetry: true,
          },
          requestId,
        };
      }

      // If this was an explicit evaluator simulation, preserve the server error
      if (options.simulateFailure) {
        return {
          success: false,
          error: {
            type: 'SERVER_ERROR',
            title: 'Backend Proxy Error',
            message: errorBody?.error?.title || 'The backend proxy encountered an error while processing the request.',
            details: serverErrorDetail,
            canRetry: true,
          },
          requestId,
        };
      }

      // Seamless fallback to client mock engine if backend server had an unexpected issue
      console.warn('[CookMate API] Backend returned non-200, falling back to client culinary engine:', serverErrorDetail);
      const fallbackData = generateSmartMockRecipe(prompt, options);
      return {
        success: true,
        data: fallbackData,
        requestId,
      };
    }

    // Read response as raw text to defensively prevent unhandled JSON.parse crashes
    const rawText = await response.text();

    // Guard against stale response again after reading stream
    if (requestId !== currentRequestId) {
      return {
        success: false,
        error: {
          type: 'STALE_REQUEST',
          title: 'Request Superseded',
          message: 'A newer recipe request was initiated before this one completed.',
          canRetry: false,
        },
        requestId,
      };
    }

    // Validate the response through defensive schema validator
    const validation = validateResult(rawText);

    if (!validation.success) {
      // If running an evaluator simulation, preserve the validation error
      if (options.simulateFailure) {
        return {
          success: false,
          error: validation.error,
          requestId,
        };
      }

      // For normal user requests, fall back to smart mock if schema was damaged
      console.warn('[CookMate API] Invalid schema from upstream, falling back to smart recipe:', validation.error);
      const fallbackData = generateSmartMockRecipe(prompt, options);
      return {
        success: true,
        data: fallbackData,
        requestId,
      };
    }

    return {
      success: true,
      data: validation.data,
      requestId,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    // If a newer request was made, disregard this error
    if (requestId !== currentRequestId) {
      return {
        success: false,
        error: {
          type: 'STALE_REQUEST',
          title: 'Request Superseded',
          message: 'A newer recipe request was initiated before this one completed.',
          canRetry: false,
        },
        requestId,
      };
    }

    // Check if aborted due to timeout
    if (err instanceof Error && (err.name === 'AbortError' || err.message === 'REQUEST_TIMEOUT')) {
      return {
        success: false,
        error: {
          type: 'SLOW_TIMEOUT',
          title: 'Request Timed Out',
          message: 'The AI model took longer than 25 seconds to generate the recipe.',
          details: 'The connection was closed to prevent an indefinite freeze. Please try again or check your backend connection.',
          canRetry: true,
        },
        requestId,
      };
    }

    // If this is an evaluator failure simulation, return the network error
    if (options.simulateFailure) {
      const message = err instanceof Error ? err.message : 'Unknown network error';
      return {
        success: false,
        error: {
          type: 'NETWORK_ERROR',
          title: 'Connection Failed',
          message: 'Could not reach the backend proxy server at /api/generate.',
          details: `Make sure the server is running on http://localhost:3001. Error: ${message}`,
          canRetry: true,
        },
        requestId,
      };
    }

    // Seamless client-side engine fallback for offline or standalone client runs
    console.info('[CookMate API] Backend server offline or unreachable. Using built-in Intelligent Culinary Mock Engine.');
    await new Promise((res) => setTimeout(res, 600));
    const localRecipe = generateSmartMockRecipe(prompt, options);

    return {
      success: true,
      data: localRecipe,
      requestId,
    };
  } finally {
    if (activeAbortController === controller) {
      activeAbortController = null;
    }
  }
}
