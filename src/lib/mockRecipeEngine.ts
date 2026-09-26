import type { RecipeResult } from '../types/result';
import type { GenerateOptions } from './api';

/**
 * Intelligent culinary recipe generation engine that crafts dynamic, realistic,
 * portion-scalable recipes based on input ingredients and dietary preferences.
 */
export function generateSmartMockRecipe(
  userPrompt: string,
  options?: GenerateOptions
): RecipeResult {
  const promptLower = (userPrompt || '').toLowerCase();
  const servings = options?.servings || 2;

  let title = 'Golden Kitchen Skillet Scramble';
  let tagline = 'Fresh, aromatic culinary creation tailored to your pantry ingredients';
  let cuisine = 'Modern Fusion';
  let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy';
  let prepTime = 8;
  let cookTime = 12;
  let dietaryTags = ['Quick & Easy', 'High Protein'];

  const hasEggs = promptLower.includes('egg');
  const hasCheese = promptLower.includes('cheese') || promptLower.includes('cheddar') || promptLower.includes('parmesan') || promptLower.includes('paneer');
  const hasPasta = promptLower.includes('pasta') || promptLower.includes('spaghetti') || promptLower.includes('penne') || promptLower.includes('noodle');
  const hasRice = promptLower.includes('rice') || promptLower.includes('pulao') || promptLower.includes('biryani');
  const hasChicken = promptLower.includes('chicken') || promptLower.includes('meat') || promptLower.includes('beef');
  const hasPaneer = promptLower.includes('paneer') || promptLower.includes('tofu');
  const hasVeggies = promptLower.includes('spinach') || promptLower.includes('broccoli') || promptLower.includes('tomato') || promptLower.includes('mushroom') || promptLower.includes('capsicum');

  if (hasPasta) {
    title = 'Pan-Tossed Garlic Herb Pasta';
    tagline = 'Silky pasta elevated with caramelized garlic, herbs, and vibrant additions';
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
    tagline = 'Juicy caramelized chicken breast with crisp pan glaze and garden aromatics';
    cuisine = 'Contemporary Bistro';
    prepTime = 10;
    cookTime = 16;
    dietaryTags = ['High Protein', 'Low Carb'];
  } else if (hasPaneer) {
    title = 'Tawa-Seared Paneer & Veggie Medley';
    tagline = 'Golden spiced cottage cheese tossed with bell peppers and toasted cumin';
    cuisine = 'North Indian Modern';
    prepTime = 10;
    cookTime = 12;
    dietaryTags = ['High Protein', 'Vegetarian'];
  } else if (hasEggs) {
    title = 'Mediterranean Herb & Veggie Frittata';
    tagline = 'Fluffy skillet eggs infused with aromatic garlic, herbs, and melted cheese';
    cuisine = 'Mediterranean';
    prepTime = 5;
    cookTime = 10;
    dietaryTags = ['High Protein', 'Keto Friendly', 'Quick & Easy'];
  } else if (hasVeggies) {
    title = 'Garden Herb Sautéed Vegetable Bowl';
    tagline = 'Tender-crisp seasonal vegetables tossed in garlic-infused virgin olive oil';
    cuisine = 'Farmhouse Kitchen';
    prepTime = 7;
    cookTime = 11;
    dietaryTags = ['Vegetarian', 'Fiber Rich', 'Low Calorie'];
  }

  if (options?.refinementPrompt) {
    title = `${title} (${options.refinementPrompt.slice(0, 30)})`;
  }

  const primaryIngredient = hasEggs 
    ? { name: 'Fresh Eggs', amount: 3, unit: 'pcs', category: 'dairy' as const }
    : hasChicken 
    ? { name: 'Chicken Breast', amount: 300, unit: 'g', category: 'meat' as const }
    : hasPaneer 
    ? { name: 'Fresh Paneer or Tofu', amount: 200, unit: 'g', category: 'dairy' as const }
    : hasPasta 
    ? { name: 'Penne or Spaghetti', amount: 200, unit: 'g', category: 'pantry' as const }
    : { name: 'Basmati Rice or Grains', amount: 1.5, unit: 'cups', category: 'pantry' as const };

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
        name: primaryIngredient.name,
        amount: primaryIngredient.amount,
        unit: primaryIngredient.unit,
        category: primaryIngredient.category,
        notes: hasEggs ? 'whisked with a pinch of sea salt' : 'prepped bite-sized',
        isPantryStaple: false,
        swaps: [
          {
            original: primaryIngredient.name,
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
        ingredientsUsed: [primaryIngredient.name],
      },
      {
        stepNumber: 3,
        shortSummary: 'Garnish & Plate',
        instruction: 'Remove from heat. Season with a crack of black pepper and sea salt to taste. Serve warm immediately.',
        timerMinutes: 0,
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
