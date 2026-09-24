import { RecipeResultSchema } from '../types/result';
import type { RecipeResult, AppError } from '../types/result';

export interface ValidationSuccess {
  success: true;
  data: RecipeResult;
}

export interface ValidationFailure {
  success: false;
  error: AppError;
}

export type ValidationOutcome = ValidationSuccess | ValidationFailure;

/**
 * Extracts JSON from LLM string output in case of markdown codeblock wrapping
 */
export function cleanRawJsonString(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  let trimmed = raw.trim();

  // Strip leading/trailing markdown code fences if present: ```json ... ```
  if (trimmed.startsWith('```')) {
    trimmed = trimmed.replace(/^```(?:json)?\s*/i, '');
    trimmed = trimmed.replace(/\s*```$/, '');
  }

  return trimmed.trim();
}

/**
 * Defensively parses and validates incoming LLM data before it can touch any React UI.
 * Explicitly distinguishes Malformed JSON, Wrong Shape, and Empty responses.
 */
export function validateResult(rawInput: unknown): ValidationOutcome {
  // 1. Check for empty input
  if (rawInput === null || rawInput === undefined || rawInput === '') {
    return {
      success: false,
      error: {
        type: 'EMPTY_RESPONSE',
        title: 'Empty Response Received',
        message: 'The AI model returned an empty payload with no recipe data.',
        details: 'Received null or blank data from the model endpoint.',
        canRetry: true,
      },
    };
  }

  // 2. Parse JSON if string was provided
  let parsed: unknown = rawInput;
  if (typeof rawInput === 'string') {
    const cleaned = cleanRawJsonString(rawInput);
    if (!cleaned) {
      return {
        success: false,
        error: {
          type: 'EMPTY_RESPONSE',
          title: 'Empty Content',
          message: 'The response contained no usable JSON content.',
          rawResponse: rawInput,
          canRetry: true,
        },
      };
    }

    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr: unknown) {
      const errMessage = parseErr instanceof Error ? parseErr.message : 'Invalid JSON format';
      return {
        success: false,
        error: {
          type: 'MALFORMED_JSON',
          title: 'Malformed AI Output',
          message: 'The AI generated invalid JSON that could not be parsed.',
          details: `JSON Parse Error: ${errMessage}`,
          rawResponse: rawInput.slice(0, 500) + (rawInput.length > 500 ? '... [truncated]' : ''),
          canRetry: true,
        },
      };
    }
  }

  // 3. Check if the parsed object is a plain object
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return {
      success: false,
      error: {
        type: 'WRONG_SHAPE',
        title: 'Unexpected Response Structure',
        message: 'The AI returned a valid JSON format, but not the expected Recipe object structure.',
        details: `Expected a JSON object with recipe properties, but received type '${Array.isArray(parsed) ? 'array' : typeof parsed}'.`,
        rawResponse: JSON.stringify(parsed, null, 2).slice(0, 500),
        canRetry: true,
      },
    };
  }

  // 4. Validate schema with Zod
  const zodResult = RecipeResultSchema.safeParse(parsed);

  if (!zodResult.success) {
    const issueList = zodResult.error.issues
      .map((issue) => `• Field '${issue.path.join('.')}': ${issue.message}`)
      .join('\n');

    return {
      success: false,
      error: {
        type: 'WRONG_SHAPE',
        title: 'Schema Validation Failed',
        message: 'The response is missing required recipe fields or contains invalid types.',
        details: issueList,
        rawResponse: JSON.stringify(parsed, null, 2).slice(0, 500),
        canRetry: true,
      },
    };
  }

  // 5. Additional structural checks
  const recipe = zodResult.data as RecipeResult;

  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    return {
      success: false,
      error: {
        type: 'WRONG_SHAPE',
        title: 'No Ingredients Found',
        message: 'The recipe returned with an empty ingredients list.',
        details: 'The recipe must contain at least 1 ingredient with quantity and units.',
        canRetry: true,
      },
    };
  }

  if (!recipe.steps || recipe.steps.length === 0) {
    return {
      success: false,
      error: {
        type: 'WRONG_SHAPE',
        title: 'No Cooking Steps Found',
        message: 'The recipe returned without any cooking instructions or steps.',
        details: 'The recipe must contain at least 1 numbered cooking step.',
        canRetry: true,
      },
    };
  }

  // Normalize step numbers and ingredient IDs if any are missing
  const normalizedRecipe: RecipeResult = {
    ...recipe,
    id: recipe.id || `recipe_${Date.now()}`,
    ingredients: recipe.ingredients.map((ing, idx) => ({
      ...ing,
      id: ing.id || `ing_${idx + 1}_${Date.now()}`,
      category: ing.category || 'pantry',
      amount: Number(ing.amount) > 0 ? Number(ing.amount) : 1,
      swaps: ing.swaps || [],
    })),
    steps: recipe.steps.map((step, idx) => ({
      ...step,
      stepNumber: step.stepNumber || idx + 1,
      ingredientsUsed: step.ingredientsUsed || [],
    })),
    dietaryTags: recipe.dietaryTags || [],
    pantryStaplesNeeded: recipe.pantryStaplesNeeded || [],
    chefTips: recipe.chefTips || [],
    swapsSummary: recipe.swapsSummary || [],
  };

  return {
    success: true,
    data: normalizedRecipe,
  };
}
