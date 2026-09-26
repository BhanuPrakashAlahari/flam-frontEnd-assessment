import dotenv from 'dotenv';
import { validateCulinaryInput } from '../src/lib/culinaryValidation';

dotenv.config();

export interface GenerateRequestBody {
  prompt: string;
  options?: {
    dietaryPreferences?: string[];
    servings?: number;
    cookingTimeMax?: number;
    refinementPrompt?: string;
    previousRecipeTitle?: string;
    simulateFailure?: 'malformed' | 'wrong_shape' | 'empty' | 'slow_timeout' | 'server_error' | null;
  };
}

/**
 * Strips markdown fences and extracts raw JSON object if present
 */
function cleanJson(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  let trimmed = raw.trim();
  if (trimmed.startsWith('```')) {
    trimmed = trimmed.replace(/^```(?:json)?\s*/i, '');
    trimmed = trimmed.replace(/\s*```$/, '');
  }
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    trimmed = trimmed.slice(firstBrace, lastBrace + 1);
  }
  return trimmed.trim();
}

const STRICT_SYSTEM_PROMPT = `You are a world-class professional chef and interactive culinary AI.
Your job is to transform free-form user ingredient inputs into an ultra-practical, delicious, structured recipe.

CRITICAL INTENT VALIDATION:
If the user's input is NOT related to food, cooking, kitchen ingredients, or recipes (e.g. keyboard mash like "asdfghjk", non-food questions, coding queries, or gibberish), you MUST return JSON with:
{
  "error": {
    "type": "INVALID_PROMPT",
    "title": "Non-Cooking Input Detected",
    "message": "Please enter valid cooking ingredients or kitchen items (for example: eggs, cheese, spinach, pasta)."
  }
}

RULES FOR VALID FOOD INPUTS:
1. Return ONLY valid JSON matching the exact schema below. Do NOT include any markdown code fences (\`\`\`json), do NOT include any conversational preamble or postscript.
2. Every ingredient MUST have:
   - "id": a unique string ID (e.g. "ing_1", "ing_2")
   - "name": clean ingredient name
   - "amount": numeric base quantity (must be a positive number)
   - "unit": clear measurement unit (e.g. "g", "tbsp", "cup", "cloves", "pcs", "ml", "pinch")
   - "category": one of ["produce", "dairy", "meat", "pantry", "bakery", "spices", "canned", "other"]
   - "notes": optional preparation note (e.g. "finely diced", "grated")
   - "isPantryStaple": boolean (true if basic salt/oil/pepper, false if main fridge ingredient)
   - "swaps": an array of 1-2 realistic substitutions with original, substitute, ratio, and dietaryBenefit
3. Every cooking step MUST have:
   - "stepNumber": integer starting from 1
   - "instruction": clear, actionable cooking instruction
   - "shortSummary": concise 2-4 word step header (e.g. "Sauté Aromatics", "Whisk Eggs")
   - "timerMinutes": optional number of minutes if this step requires simmering/baking/resting (e.g. 5, 12)
   - "tip": optional chef technique tip
   - "ingredientsUsed": array of ingredient names utilized in this step
4. Include realistic nutrition estimation per serving.
5. Include a list of assumed common pantry staples in "pantryStaplesNeeded" (e.g. ["Olive oil", "Salt", "Black pepper"]).

EXACT JSON SCHEMA TO MATCH:
{
  "id": "recipe_unique_id",
  "title": "String (Appetizing Recipe Title)",
  "tagline": "String (Catchy 1-sentence subtitle)",
  "description": "String (2-3 sentences explaining flavors and why this works with these ingredients)",
  "cuisine": "String (e.g. Mediterranean, Italian-Fusion, Quick Asian Stir-Fry)",
  "difficulty": "Easy" | "Medium" | "Hard",
  "prepTimeMinutes": Number,
  "cookTimeMinutes": Number,
  "totalTimeMinutes": Number,
  "baseServings": Number (default 2),
  "dietaryTags": ["String", "String"],
  "ingredients": [
    {
      "id": "ing_1",
      "name": "String",
      "amount": Number,
      "unit": "String",
      "category": "produce" | "dairy" | "meat" | "pantry" | "bakery" | "spices" | "canned" | "other",
      "notes": "String",
      "isPantryStaple": Boolean,
      "swaps": [
        {
          "original": "String",
          "substitute": "String",
          "ratio": "String",
          "dietaryBenefit": "String"
        }
      ]
    }
  ],
  "pantryStaplesNeeded": ["String"],
  "steps": [
    {
      "stepNumber": Number,
      "shortSummary": "String",
      "instruction": "String",
      "timerMinutes": Number,
      "tip": "String",
      "ingredientsUsed": ["String"]
    }
  ],
  "nutritionPerServing": {
    "calories": Number,
    "proteinGrams": Number,
    "carbsGrams": Number,
    "fatGrams": Number,
    "fiberGrams": Number
  },
  "chefTips": ["String"],
  "swapsSummary": [
    {
      "ingredient": "String",
      "substitute": "String",
      "reason": "String"
    }
  ]
}`;

/**
 * Generates an intelligent, realistic recipe from user ingredients when running offline or testing
 */
function generateSmartMockRecipe(userPrompt: string, options?: GenerateRequestBody['options']) {
  const promptLower = userPrompt.toLowerCase();
  const servings = options?.servings || 2;

  let title = 'Golden Kitchen Skillet Scramble';
  let tagline = 'Fresh, aromatic culinary creation tailored to your fridge ingredients';
  let cuisine = 'Modern Fusion';
  let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy';
  let prepTime = 8;
  let cookTime = 12;
  let dietaryTags = ['Quick & Easy', 'High Protein'];

  const hasEggs = promptLower.includes('egg');
  const hasCheese = promptLower.includes('cheese') || promptLower.includes('cheddar') || promptLower.includes('parmesan');
  const hasPasta = promptLower.includes('pasta') || promptLower.includes('spaghetti') || promptLower.includes('noodle');
  const hasRice = promptLower.includes('rice');
  const hasChicken = promptLower.includes('chicken');

  if (hasPasta) {
    title = 'Pan-Tossed Garlic Herb Pasta';
    tagline = 'Silky pasta elevated with caramelized garlic, herbs, and vibrant pantry additions';
    cuisine = 'Italian Modern';
    prepTime = 6;
    cookTime = 14;
    dietaryTags = ['Quick & Comforting', 'Vegetarian Friendly'];
  } else if (hasRice) {
    title = 'Aromatic Wok-Tossed Fried Rice';
    tagline = 'Golden wok-seared rice with fresh aromatics, garlic, and savory pan reduction';
    cuisine = 'East Asian Fusion';
    prepTime = 8;
    cookTime = 10;
    dietaryTags = ['High Protein', 'Fast Weeknight Meal'];
  } else if (hasChicken) {
    title = 'Seared Skillet Herb Chicken';
    tagline = 'Juicy caramelized chicken breast with crisp pan glaze and garden vegetables';
    cuisine = 'Contemporary Bistro';
    prepTime = 10;
    cookTime = 16;
    dietaryTags = ['High Protein', 'Low Carb'];
  }

  if (options?.refinementPrompt) {
    title = `${title} (${options.refinementPrompt.slice(0, 30)})`;
  }

  return {
    id: `recipe_${Date.now()}`,
    title,
    tagline,
    description: `Crafted from your ingredients: "${userPrompt.slice(0, 75)}...". Designed for optimal texture contrast, balanced seasoning, and zero kitchen waste.`,
    cuisine,
    difficulty,
    prepTimeMinutes: prepTime,
    cookTimeMinutes: cookTime,
    totalTimeMinutes: prepTime + cookTime,
    baseServings: servings,
    dietaryTags: Array.from(new Set([...dietaryTags, ...(options?.dietaryPreferences || [])])),
    ingredients: [
      {
        id: 'ing_1',
        name: hasEggs ? 'Fresh Eggs' : hasChicken ? 'Chicken Breast' : 'Penne Pasta',
        amount: hasEggs ? 3 : hasChicken ? 300 : 200,
        unit: hasEggs ? 'pcs' : 'g',
        category: hasEggs ? 'dairy' : hasChicken ? 'meat' : 'pantry',
        notes: hasEggs ? 'whisked with a pinch of sea salt' : 'prepped bite-sized',
        isPantryStaple: false,
        swaps: [
          {
            original: hasEggs ? 'Eggs' : hasChicken ? 'Chicken Breast' : 'Pasta',
            substitute: hasEggs ? 'Silken Tofu or Chickpea Batter' : hasChicken ? 'Crispy Firm Tofu' : 'Zucchini Noodles',
            ratio: '1:1',
            dietaryBenefit: 'Plant-Based & Vegan Alternative',
          },
        ],
      },
      {
        id: 'ing_2',
        name: hasCheese ? 'Cheddar or Parmesan' : 'Fresh Baby Spinach',
        amount: hasCheese ? 60 : 100,
        unit: 'g',
        category: hasCheese ? 'dairy' : 'produce',
        notes: hasCheese ? 'freshly shredded' : 'washed and dried',
        isPantryStaple: false,
        swaps: [
          {
            original: 'Cheese',
            substitute: 'Nutritional Yeast',
            ratio: '2 tbsp',
            dietaryBenefit: '100% Dairy-Free & Vegan',
          },
        ],
      },
      {
        id: 'ing_3',
        name: 'Fresh Garlic Cloves',
        amount: 2,
        unit: 'cloves',
        category: 'produce',
        notes: 'thinly sliced',
        isPantryStaple: false,
        swaps: [
          {
            original: 'Garlic',
            substitute: 'Garlic Powder',
            ratio: '1/2 tsp',
            dietaryBenefit: 'Pantry Alternative',
          },
        ],
      },
      {
        id: 'ing_4',
        name: 'Extra Virgin Olive Oil or Butter',
        amount: 1.5,
        unit: 'tbsp',
        category: 'pantry',
        notes: 'for sautéing',
        isPantryStaple: true,
        swaps: [
          {
            original: 'Butter',
            substitute: 'Avocado Oil',
            ratio: '1:1',
            dietaryBenefit: 'High Smoke Point & Dairy-Free',
          },
        ],
      },
    ],
    pantryStaplesNeeded: ['Olive oil / Cooking oil', 'Kosher Salt', 'Freshly ground Black Pepper'],
    steps: [
      {
        stepNumber: 1,
        shortSummary: 'Aromatics & Sauté',
        instruction: 'Heat olive oil in a wide skillet over medium heat. Sauté the sliced garlic for 1 to 2 minutes until fragrant and lightly golden. Do not let it brown too quickly.',
        timerMinutes: 2,
        tip: 'Gently infuse the oil on medium-low heat to extract sweetness without bitterness.',
        ingredientsUsed: ['Extra Virgin Olive Oil or Butter', 'Fresh Garlic Cloves'],
      },
      {
        stepNumber: 2,
        shortSummary: 'Cook Core Ingredients',
        instruction: 'Add the main ingredients into the pan. Sauté over medium-high heat, turning frequently for 4 to 6 minutes until cooked tender and evenly seared.',
        timerMinutes: 5,
        tip: 'Keep the pan hot so excess moisture evaporates rather than steams the ingredients.',
        ingredientsUsed: [],
      },
      {
        stepNumber: 3,
        shortSummary: 'Garnish & Plate',
        instruction: 'Remove from heat. Season with a crack of black pepper and sea salt to taste. Serve warm immediately.',
        tip: 'A drop of fresh lemon juice or herbs will brighten the rich pan flavors.',
        ingredientsUsed: [],
      },
    ],
    nutritionPerServing: {
      calories: 340,
      proteinGrams: 22,
      carbsGrams: 16,
      fatGrams: 20,
      fiberGrams: 3,
    },
    chefTips: [
      'Always pre-heat your skillet before adding oil for a naturally non-stick surface.',
      'Season at multiple stages rather than just at the very end.',
    ],
    swapsSummary: [],
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Handles LLM Generation via Gemini Flash API or intelligent mock fallback
 */
export async function handleGenerateRecipe(reqBody: GenerateRequestBody): Promise<{ status: number; body: any }> {
  try {
    const { prompt, options } = reqBody;

    // 1. Explicit failure simulation endpoints (for test evaluation)
    if (options?.simulateFailure) {
      const sim = options.simulateFailure;
      if (sim === 'malformed') {
        return {
          status: 200,
          body: '{"title": "Unclosed Broken Recipe", "ingredients": [{"name": "eggs", "amount": 2, "broken": }',
        };
      }
      if (sim === 'wrong_shape') {
        return {
          status: 200,
          body: {
            status: 'ok',
            message: 'Here is a friendly recipe for you!',
            someRandomArray: [1, 2, 3],
          },
        };
      }
      if (sim === 'empty') {
        return {
          status: 200,
          body: '',
        };
      }
      if (sim === 'slow_timeout') {
        await new Promise((resolve) => setTimeout(resolve, 26000));
        return {
          status: 200,
          body: generateSmartMockRecipe(prompt, options),
        };
      }
      if (sim === 'server_error') {
        return {
          status: 500,
          body: {
            error: {
              title: 'Simulated LLM Gateway 500 Error',
              message: 'Upstream AI model gateway temporarily unavailable (503 Service Unavailable).',
            },
          },
        };
      }
    }

    // 2. Strict Intent Validation: Check whether the user entered cooking/ingredient info
    const culinaryCheck = validateCulinaryInput(prompt);
    if (!culinaryCheck.isValid) {
      return {
        status: 400,
        body: {
          error: {
            type: 'INVALID_PROMPT',
            title: 'Non-Cooking Input Detected',
            message: culinaryCheck.reason || 'Please enter cooking ingredients, pantry items, or food notes (for example: eggs, garlic, spinach, pasta, chicken).',
          },
        },
      };
    }

    // 3. Real Gemini Flash API call if GEMINI_API_KEY is configured
    const apiKey = process.env.GEMINI_API_KEY?.trim().replace(/^['"]|['"]$/g, '');

    if (apiKey && apiKey !== '' && apiKey !== 'YOUR_GEMINI_API_KEY') {
      let modelCandidates: string[] = [];

      // Dynamically discover available models for this specific API key
      try {
        const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (listRes.ok) {
          const listData: any = await listRes.json();
          if (Array.isArray(listData.models)) {
            const available = listData.models
              .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
              .map((m: any) => m.name.replace(/^models\//, ''));

            // Prioritize flash models
            available.sort((a: string, b: string) => {
              if (a.includes('flash') && !b.includes('flash')) return -1;
              if (!a.includes('flash') && b.includes('flash')) return 1;
              return 0;
            });

            if (available.length > 0) {
              modelCandidates = available;
              console.log(`[CookMate AI] Discovered ${available.length} active models for API key. Primary: ${available[0]}`);
            }
          }
        }
      } catch (err) {
        console.warn('[CookMate AI] Could not auto-discover models:', err);
      }

      // Fallback model list if listing is unavailable
      if (modelCandidates.length === 0) {
        modelCandidates = [
          'gemini-2.5-flash',
          'gemini-2.5-pro',
          'gemini-2.0-flash-001',
          'gemini-2.0-flash-exp',
          'gemini-1.5-flash-latest',
          'gemini-1.5-pro-latest',
        ];
      }

      // Explicitly remove retired/deprecated model names that return 404
      const DEPRECATED_NAMES = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-pro'];
      modelCandidates = modelCandidates.filter((m) => !DEPRECATED_NAMES.includes(m));
      if (modelCandidates.length === 0) {
        modelCandidates = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash-001', 'gemini-1.5-flash-latest'];
      }

      for (const modelName of modelCandidates) {
        try {
          const userMessage = `User fridge & pantry ingredients: "${prompt}"
${options?.dietaryPreferences?.length ? `Dietary preferences: ${options.dietaryPreferences.join(', ')}` : ''}
${options?.servings ? `Target Servings: ${options.servings}` : 'Target Servings: 2'}
${options?.cookingTimeMax ? `Max cooking time: ${options.cookingTimeMax} minutes` : ''}
${options?.refinementPrompt ? `Follow-up refinement instructions: "${options.refinementPrompt}". Tweak the recipe accordingly.` : ''}`;

          // Try v1beta first, then fallback to v1
          const apiVersions = ['v1beta', 'v1'];
          for (const apiVersion of apiVersions) {
            const endpoint = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${apiKey}`;

            const geminiResponse = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [{ text: `${STRICT_SYSTEM_PROMPT}\n\nUSER REQUEST:\n${userMessage}` }],
                  },
                ],
                generationConfig: {
                  responseMimeType: 'application/json',
                  temperature: 0.3,
                },
              }),
            });

            if (geminiResponse.ok) {
              const geminiData: any = await geminiResponse.json();
              const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

              if (rawText) {
                const cleaned = cleanJson(rawText);
                const parsedJson = JSON.parse(cleaned);
                if (parsedJson?.error?.title) {
                  return {
                    status: 400,
                    body: parsedJson,
                  };
                }
                console.log(`[CookMate AI] Recipe generated using model: ${modelName} (${apiVersion})`);
                return {
                  status: 200,
                  body: parsedJson,
                };
              }
            } else {
              const errText = await geminiResponse.text();
              // Only log if it's not a 404 to keep server logs clean
              if (geminiResponse.status !== 404) {
                console.warn(`Gemini model ${modelName} (${apiVersion}) status ${geminiResponse.status}: ${errText.slice(0, 100)}`);
              }
            }
          }
        } catch (llmErr) {
          console.warn(`Attempt with ${modelName} failed:`, llmErr);
        }
      }

      // Fallback if live API temporary issue
      console.info('[CookMate AI] Falling back to smart culinary recipe engine.');
      const mock = generateSmartMockRecipe(prompt, options);
      return {
        status: 200,
        body: mock,
      };
    }

    // 4. Fallback Smart Mock Engine if no API key
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockRecipe = generateSmartMockRecipe(prompt, options);

    return {
      status: 200,
      body: mockRecipe,
    };
  } catch (error: any) {
    console.error('Error in handleGenerateRecipe:', error);
    // Graceful fallback to smart mock instead of crashing
    const mock = generateSmartMockRecipe(reqBody.prompt || 'eggs, spinach, garlic', reqBody.options);
    return {
      status: 200,
      body: mock,
    };
  }
}
