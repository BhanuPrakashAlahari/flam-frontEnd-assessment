import { z } from 'zod';

export interface IngredientSwap {
  original: string;
  substitute: string;
  ratio: string;
  dietaryBenefit?: string | null;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: 'produce' | 'dairy' | 'meat' | 'pantry' | 'bakery' | 'spices' | 'canned' | 'other';
  notes?: string | null;
  isPantryStaple?: boolean | null;
  swaps?: IngredientSwap[];
}

export interface CookingStep {
  stepNumber: number;
  instruction: string;
  shortSummary?: string | null;
  timerMinutes?: number | null;
  tip?: string | null;
  ingredientsUsed?: string[];
}

export interface NutritionInfo {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams?: number | null;
}

export interface RecipeResult {
  id: string;
  title: string;
  tagline: string;
  description: string;
  cuisine: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  baseServings: number;
  dietaryTags: string[];
  ingredients: Ingredient[];
  pantryStaplesNeeded: string[];
  steps: CookingStep[];
  nutritionPerServing?: NutritionInfo | null;
  chefTips?: string[];
  swapsSummary?: {
    ingredient: string;
    substitute: string;
    reason: string;
  }[];
  generatedAt?: string;
}

// Zod Schema for defensive runtime validation (robust against null/undefined fields from LLMs)
export const IngredientSwapSchema = z.object({
  original: z.string().min(1, 'Original ingredient name required'),
  substitute: z.string().min(1, 'Substitute ingredient name required'),
  ratio: z.string().nullable().optional().default('1:1'),
  dietaryBenefit: z.string().nullable().optional(),
});

export const IngredientSchema = z.object({
  id: z.string().nullable().optional().default(() => Math.random().toString(36).substring(2, 9)),
  name: z.string().min(1, 'Ingredient name cannot be empty'),
  amount: z.number().positive('Amount must be greater than 0').catch(1),
  unit: z.string().nullable().optional().default('item'),
  category: z.enum(['produce', 'dairy', 'meat', 'pantry', 'bakery', 'spices', 'canned', 'other']).catch('pantry'),
  notes: z.string().nullable().optional(),
  isPantryStaple: z.boolean().nullable().optional().default(false),
  swaps: z.array(IngredientSwapSchema).nullable().optional().default([]),
});

export const CookingStepSchema = z.object({
  stepNumber: z.number().int().positive('Step number must be positive'),
  instruction: z.string().min(3, 'Instruction must be at least 3 characters'),
  shortSummary: z.string().nullable().optional(),
  timerMinutes: z.number().min(0).nullable().optional(),
  tip: z.string().nullable().optional(),
  ingredientsUsed: z.array(z.string()).nullable().optional().default([]),
});

export const NutritionSchema = z.object({
  calories: z.number().nonnegative().nullable().optional().catch(0),
  proteinGrams: z.number().nonnegative().nullable().optional().catch(0),
  carbsGrams: z.number().nonnegative().nullable().optional().catch(0),
  fatGrams: z.number().nonnegative().nullable().optional().catch(0),
  fiberGrams: z.number().nonnegative().nullable().optional(),
});

export const RecipeResultSchema = z.object({
  id: z.string().nullable().optional().default(() => `recipe_${Date.now()}`),
  title: z.string().min(2, 'Recipe title is too short'),
  tagline: z.string().nullable().optional().default('A delicious custom creation from your kitchen'),
  description: z.string().min(5, 'Description is too short'),
  cuisine: z.string().nullable().optional().default('Fusion / Comfort Food'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).catch('Easy'),
  prepTimeMinutes: z.number().nonnegative().catch(10),
  cookTimeMinutes: z.number().nonnegative().catch(15),
  totalTimeMinutes: z.number().nonnegative().catch(25),
  baseServings: z.number().int().min(1).catch(2),
  dietaryTags: z.array(z.string()).nullable().optional().default([]),
  ingredients: z.array(IngredientSchema).min(1, 'At least one ingredient is required'),
  pantryStaplesNeeded: z.array(z.string()).nullable().optional().default([]),
  steps: z.array(CookingStepSchema).min(1, 'At least one step is required'),
  nutritionPerServing: NutritionSchema.nullable().optional(),
  chefTips: z.array(z.string()).nullable().optional().default([]),
  swapsSummary: z.array(z.object({
    ingredient: z.string(),
    substitute: z.string(),
    reason: z.string(),
  })).nullable().optional().default([]),
  generatedAt: z.string().nullable().optional().default(() => new Date().toISOString()),
});

export type RawRecipeResponse = z.infer<typeof RecipeResultSchema>;

export type GenerationErrorType = 
  | 'MALFORMED_JSON'
  | 'WRONG_SHAPE'
  | 'EMPTY_RESPONSE'
  | 'SLOW_TIMEOUT'
  | 'SERVER_ERROR'
  | 'STALE_REQUEST'
  | 'NETWORK_ERROR'
  | 'INVALID_PROMPT';


export interface AppError {
  type: GenerationErrorType;
  title: string;
  message: string;
  details?: string;
  rawResponse?: string;
  canRetry: boolean;
}
