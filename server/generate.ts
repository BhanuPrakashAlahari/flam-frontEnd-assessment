import dotenv from 'dotenv';
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

const STRICT_SYSTEM_PROMPT = `You are a world-class professional chef and interactive culinary AI.
Your job is to transform free-form user ingredient inputs (what's in their fridge/pantry) into an ultra-practical, delicious, structured recipe.

RULES:
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
  const isRefinement = !!options?.refinementPrompt;

  let title = 'Golden Kitchen Skillet Hash';
  let tagline = 'Crispy, savory comfort food made from your fridge staples';
  let cuisine = 'Modern Comfort';
  let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy';
  let prepTime = 10;
  let cookTime = 15;
  let dietaryTags = ['Quick & Easy', 'High Protein', 'Gluten-Free Friendly'];

  // Smart ingredients extraction based on prompt
  const hasEggs = promptLower.includes('egg');
  const hasCheese = promptLower.includes('cheese') || promptLower.includes('cheddar') || promptLower.includes('parmesan') || promptLower.includes('mozzarella');
  const hasSpinach = promptLower.includes('spinach') || promptLower.includes('kale') || promptLower.includes('green');
  const hasPasta = promptLower.includes('pasta') || promptLower.includes('spaghetti') || promptLower.includes('noodle');
  const hasRice = promptLower.includes('rice');
  const hasChicken = promptLower.includes('chicken') || promptLower.includes('breast') || promptLower.includes('thigh');
  const hasTomato = promptLower.includes('tomato') || promptLower.includes('marinara');
  const hasTofu = promptLower.includes('tofu');
  const hasMushrooms = promptLower.includes('mushroom');

  if (hasPasta || (hasTomato && !hasRice)) {
    title = hasCheese ? 'Creamy Tuscan Pan Pasta' : 'Rustic Garlic & Herb Tomato Pasta';
    tagline = 'Silky, flavorful pasta elevated with pan-seared fresh aromatics';
    cuisine = 'Italian Modern';
    prepTime = 8;
    cookTime = 14;
    dietaryTags = ['Vegetarian Friendly', 'Comfort Food', 'Under 25 Mins'];
  } else if (hasRice || promptLower.includes('soy')) {
    title = 'Sizzling Garlic-Egg Fried Rice Bowl';
    tagline = 'Wok-tossed aromatic rice with golden eggs and crisp vegetables';
    cuisine = 'East Asian Fusion';
    prepTime = 10;
    cookTime = 12;
    dietaryTags = ['High Protein', 'Fast Prep', 'Customizable'];
  } else if (hasEggs) {
    title = 'Farmhouse Herb & Melted Cheddar Frittata';
    tagline = 'Fluffy, golden baked eggs folded with tender vegetables and melted cheese';
    cuisine = 'French-American Bistro';
    prepTime = 7;
    cookTime = 12;
    dietaryTags = ['Keto Friendly', 'High Protein', 'Gluten-Free', 'Vegetarian'];
  } else if (hasChicken) {
    title = 'Seared Skillet Chicken with Pan Glaze';
    tagline = 'Juicy, caramelized golden chicken with herb pan sauce and sautéed greens';
    cuisine = 'Modern Continental';
    prepTime = 10;
    cookTime = 18;
    dietaryTags = ['High Protein', 'Low Carb', 'Hearty'];
  }

  if (options?.refinementPrompt) {
    title = `${title} (${options.refinementPrompt.slice(0, 30)})`;
  }

  const recipe = {
    id: `mock_recipe_${Date.now()}`,
    title,
    tagline,
    description: `Crafted especially from your listed ingredients (${userPrompt.slice(0, 80)}...). This dish balances rich savory flavors, great texture contrast, and quick weeknight efficiency.`,
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
        name: hasEggs ? 'Fresh Eggs' : hasChicken ? 'Chicken Breast' : 'Penne or Spaghetti Pasta',
        amount: hasEggs ? 4 : hasChicken ? 350 : 200,
        unit: hasEggs ? 'pcs' : hasChicken ? 'g' : 'g',
        category: hasEggs ? 'dairy' : hasChicken ? 'meat' : 'pantry',
        notes: hasEggs ? 'whisked with a pinch of salt' : hasChicken ? 'sliced into bite-sized strips' : 'boiled al dente',
        isPantryStaple: false,
        swaps: [
          {
            original: hasEggs ? 'Eggs' : hasChicken ? 'Chicken Breast' : 'Pasta',
            substitute: hasEggs ? 'Silken Tofu or Chickpea Batter' : hasChicken ? 'Crispy Firm Tofu' : 'Zucchini Noodles (Zoodles)',
            ratio: '1:1',
            dietaryBenefit: 'Plant-based & vegan alternative',
          },
        ],
      },
      {
        id: 'ing_2',
        name: hasCheese ? 'Sharp Cheddar Cheese' : 'Grated Parmesan or Nutritional Yeast',
        amount: 80,
        unit: 'g',
        category: 'dairy',
        notes: 'coarsely grated for optimal melting',
        isPantryStaple: false,
        swaps: [
          {
            original: 'Cheddar Cheese',
            substitute: 'Nutritional Yeast + Cashew Cream',
            ratio: '2 tbsp per 50g cheese',
            dietaryBenefit: '100% Dairy-Free & Vegan',
          },
          {
            original: 'Cheddar Cheese',
            substitute: 'Feta or Goat Cheese',
            ratio: '1:1',
            dietaryBenefit: 'Tangier Mediterranean flavor profile',
          },
        ],
      },
      {
        id: 'ing_3',
        name: hasSpinach ? 'Fresh Baby Spinach' : 'Bell Pepper or Greens',
        amount: 120,
        unit: 'g',
        category: 'produce',
        notes: 'washed and roughly chopped',
        isPantryStaple: false,
        swaps: [
          {
            original: 'Baby Spinach',
            substitute: 'Lacinato Kale or Swiss Chard',
            ratio: '1:1',
            dietaryBenefit: 'Higher fiber and heartier texture',
          },
        ],
      },
      {
        id: 'ing_4',
        name: 'Fresh Garlic Cloves',
        amount: 3,
        unit: 'cloves',
        category: 'produce',
        notes: 'thinly sliced or minced',
        isPantryStaple: false,
        swaps: [
          {
            original: 'Fresh Garlic',
            substitute: 'Garlic Powder',
            ratio: '1/2 tsp per clove',
            dietaryBenefit: 'Pantry backup if out of fresh garlic',
          },
        ],
      },
      {
        id: 'ing_5',
        name: 'Extra Virgin Olive Oil or Butter',
        amount: 2,
        unit: 'tbsp',
        category: 'pantry',
        notes: 'for sautéing',
        isPantryStaple: true,
        swaps: [
          {
            original: 'Butter',
            substitute: 'Avocado Oil or Grapeseed Oil',
            ratio: '1:1',
            dietaryBenefit: 'Higher smoke point and dairy-free',
          },
        ],
      },
    ],
    pantryStaplesNeeded: ['Olive oil / Cooking oil', 'Kosher Salt', 'Freshly ground Black Pepper', 'Red pepper chili flakes (optional)'],
    steps: [
      {
        stepNumber: 1,
        shortSummary: 'Prep & Aromatics',
        instruction: 'Heat olive oil or butter in a wide non-stick skillet over medium heat. Add thinly sliced garlic and cook for 1 to 2 minutes until fragrant and lightly golden. Do not let it burn.',
        timerMinutes: 2,
        tip: 'Keep the heat on medium-low so the garlic infuses the oil gently without turning bitter.',
        ingredientsUsed: ['Extra Virgin Olive Oil or Butter', 'Fresh Garlic Cloves'],
      },
      {
        stepNumber: 2,
        shortSummary: 'Sauté Greens & Base',
        instruction: 'Toss in the baby spinach (or vegetables) and season with a pinch of kosher salt and cracked black pepper. Sauté for 2-3 minutes until wilted and vibrant green.',
        timerMinutes: 3,
        tip: 'Spinach wilts down dramatically; fold it continuously to evenly coat with the garlic oil.',
        ingredientsUsed: ['Fresh Baby Spinach'],
      },
      {
        stepNumber: 3,
        shortSummary: 'Combine & Cook',
        instruction: hasEggs 
          ? 'Pour the whisked eggs evenly over the greens in the skillet. Lower heat to medium-low. Use a spatula to gently pull the cooked edges toward the center, letting raw egg flow underneath for 4-5 minutes.'
          : 'Fold in the prepared base ingredients and toss vigorously for 3-4 minutes to absorb the pan drippings and flavors.',
        timerMinutes: hasEggs ? 5 : 4,
        tip: 'Low and slow heat produces the creamiest, most tender texture.',
        ingredientsUsed: [hasEggs ? 'Fresh Eggs' : 'Main Base'],
      },
      {
        stepNumber: 4,
        shortSummary: 'Melt Cheese & Finish',
        instruction: 'Sprinkle the grated cheddar cheese evenly across the top. Cover the pan with a lid or foil for 2 minutes until the cheese is gloriously bubbly and melted. Remove from heat.',
        timerMinutes: 2,
        tip: 'Covering the pan traps residual steam, melting the cheese without overcooking the bottom.',
        ingredientsUsed: ['Sharp Cheddar Cheese'],
      },
      {
        stepNumber: 5,
        shortSummary: 'Garnish & Plate',
        instruction: 'Slide the finished dish onto a warm serving plate. Garnish with cracked black pepper and a drizzle of olive oil. Serve immediately while hot!',
        tip: 'Pairs wonderfully with toasted sourdough or a crisp side salad.',
        ingredientsUsed: [],
      },
    ],
    nutritionPerServing: {
      calories: 385,
      proteinGrams: 24,
      carbsGrams: 14,
      fatGrams: 26,
      fiberGrams: 4,
    },
    chefTips: [
      'Always preheat your skillet before adding oil for a naturally non-stick surface.',
      'Grate your cheese fresh from a block whenever possible; pre-shredded cheese contains anti-caking agents that hinder melting.',
      'Taste and adjust seasoning with a squeeze of fresh lemon juice right at the end to brighten all flavors.',
    ],
    swapsSummary: [
      {
        ingredient: 'Cheddar Cheese',
        substitute: 'Nutritional Yeast or Cashew Mozzarella',
        reason: 'Makes the entire dish 100% dairy-free without sacrificing savory richness.',
      },
      {
        ingredient: 'Fresh Garlic',
        substitute: 'Shallots or Garlic Powder',
        reason: 'Provides aromatic sweetness if fresh cloves are unavailable.',
      },
    ],
    generatedAt: new Date().toISOString(),
  };

  return recipe;
}

/**
 * Handles LLM Generation via Gemini API or intelligent mock fallback
 */
export async function handleGenerateRecipe(reqBody: GenerateRequestBody): Promise<{ status: number; body: any }> {
  const { prompt, options } = reqBody;

  // 1. Explicit failure simulation endpoints (for test evaluation)
  if (options?.simulateFailure) {
    const sim = options.simulateFailure;
    if (sim === 'malformed') {
      // Returns broken non-parseable JSON
      return {
        status: 200,
        body: '{"title": "Unclosed Broken Recipe", "ingredients": [{"name": "eggs", "amount": 2, "broken": }',
      };
    }
    if (sim === 'wrong_shape') {
      // Returns valid JSON but completely wrong shape (missing steps, ingredients, etc.)
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
      // Returns empty payload
      return {
        status: 200,
        body: '',
      };
    }
    if (sim === 'slow_timeout') {
      // Simulates slow server timeout > 26 seconds
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

  // 2. Real Gemini API call if GEMINI_API_KEY is configured
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== '' && apiKey !== 'YOUR_GEMINI_API_KEY') {
    try {
      const userMessage = `User fridge & pantry ingredients: "${prompt}"
${options?.dietaryPreferences?.length ? `Dietary preferences: ${options.dietaryPreferences.join(', ')}` : ''}
${options?.servings ? `Target Servings: ${options.servings}` : 'Target Servings: 2'}
${options?.cookingTimeMax ? `Max cooking time: ${options.cookingTimeMax} minutes` : ''}
${options?.refinementPrompt ? `Follow-up refinement instructions: "${options.refinementPrompt}". Tweak the recipe accordingly.` : ''}`;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API Error:', geminiResponse.status, errorText);
        // Fallback to smart mock if quota or key issue, with note
        const mock = generateSmartMockRecipe(prompt, options);
        mock.title = `${mock.title} (Fallback Mock Mode)`;
        return {
          status: 200,
          body: mock,
        };
      }

      const geminiData: any = await geminiResponse.json();
      const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        return {
          status: 200,
          body: generateSmartMockRecipe(prompt, options),
        };
      }

      // Gemini in responseMimeType "application/json" returns direct JSON string
      const parsedJson = JSON.parse(rawText);
      return {
        status: 200,
        body: parsedJson,
      };
    } catch (llmErr) {
      console.error('Error invoking Gemini LLM:', llmErr);
      // Fallback gracefully to smart mock
      const mock = generateSmartMockRecipe(prompt, options);
      return {
        status: 200,
        body: mock,
      };
    }
  }

  // 3. Smart Mock Mode (Realistic delay and intelligent dynamic synthesis)
  await new Promise((resolve) => setTimeout(resolve, 900)); // Natural 900ms latency simulation
  const mockRecipe = generateSmartMockRecipe(prompt, options);

  return {
    status: 200,
    body: mockRecipe,
  };
}
