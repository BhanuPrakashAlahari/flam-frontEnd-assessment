import { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { PromptInput } from './components/PromptInput';
import { ResultView } from './components/ResultView';
import { CookingModeModal } from './components/CookingModeModal';
import { SavedRecipesModal } from './components/SavedRecipesModal';
import { FailureSimulator } from './components/FailureSimulator';
import type { RecipeResult, AppError } from './types/result';
import { generateRecipe } from './lib/api';
import type { GenerateOptions } from './lib/api';

const SAVED_RECIPES_STORAGE_KEY = 'culinary_craft_saved_recipes_v1';

export function App() {
  const [recipe, setRecipe] = useState<RecipeResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [error, setError] = useState<AppError | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  
  // Cooking focus mode modal
  const [isCookingModeOpen, setIsCookingModeOpen] = useState<boolean>(false);
  const [cookingServings, setCookingServings] = useState<number>(2);

  // Saved recipes
  const [savedRecipes, setSavedRecipes] = useState<RecipeResult[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);

  // Stale request / prompt memory
  const [lastPrompt, setLastPrompt] = useState<string>('3 eggs, cheddar cheese, baby spinach, garlic');
  const [lastOptions, setLastOptions] = useState<GenerateOptions>({});
  const staleRequestIdRef = useRef<number>(0);

  // Load saved recipes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_RECIPES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedRecipes(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Save recipes to localStorage
  const persistSavedRecipes = (updated: RecipeResult[]) => {
    setSavedRecipes(updated);
    try {
      localStorage.setItem(SAVED_RECIPES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleGenerate = async (
    promptText: string,
    options: GenerateOptions = {}
  ) => {
    setIsLoading(true);
    setError(null);
    setCheckedSteps([]);
    setLastPrompt(promptText);
    setLastOptions(options);

    const thisReqId = ++staleRequestIdRef.current;

    const response = await generateRecipe(promptText, options);

    // Stale response guard: discard if newer request has been triggered
    if (thisReqId !== staleRequestIdRef.current) {
      console.log(`[Stale Guard] Discarded response from request #${thisReqId} (current is #${staleRequestIdRef.current})`);
      return;
    }

    setIsLoading(false);

    if (response.success && response.data) {
      setRecipe(response.data);
      setError(null);
    } else if (response.error) {
      setError(response.error);
    }
  };

  const handleRefine = async (refinementText: string) => {
    if (!recipe) return;
    setIsRefining(true);

    const thisReqId = ++staleRequestIdRef.current;

    const response = await generateRecipe(lastPrompt, {
      ...lastOptions,
      refinementPrompt: refinementText,
      previousRecipeTitle: recipe.title,
    });

    if (thisReqId !== staleRequestIdRef.current) {
      return;
    }

    setIsRefining(false);

    if (response.success && response.data) {
      setRecipe(response.data);
      setCheckedSteps([]);
    } else if (response.error) {
      setError(response.error);
    }
  };

  const handleRetry = () => {
    handleGenerate(lastPrompt, lastOptions);
  };

  const handleUseFallback = () => {
    handleGenerate('3 eggs, cheddar cheese, baby spinach, garlic', {});
  };

  const handleToggleStep = (stepNumber: number) => {
    setCheckedSteps((prev) =>
      prev.includes(stepNumber)
        ? prev.filter((s) => s !== stepNumber)
        : [...prev, stepNumber]
    );
  };

  const handleSaveRecipe = (recipeToSave: RecipeResult) => {
    const isAlreadySaved = savedRecipes.some((r) => r.id === recipeToSave.id);
    let next: RecipeResult[];
    if (isAlreadySaved) {
      next = savedRecipes.filter((r) => r.id !== recipeToSave.id);
    } else {
      next = [recipeToSave, ...savedRecipes];
    }
    persistSavedRecipes(next);
  };

  const handleDeleteSavedRecipe = (id: string) => {
    const next = savedRecipes.filter((r) => r.id !== id);
    persistSavedRecipes(next);
  };

  const handleStartCookingMode = (servings: number) => {
    setCookingServings(servings);
    setIsCookingModeOpen(true);
  };

  // Failure Simulation Triggers for Evaluator
  const handleSimulate = (simulateType: GenerateOptions['simulateFailure']) => {
    handleGenerate(lastPrompt || '3 eggs, spinach, garlic', {
      simulateFailure: simulateType,
    });
  };

  // Stale Request Race Condition Test:
  const handleTestStaleRaceCondition = async () => {
    setError(null);
    setIsLoading(true);

    // 1. Slow request (Request A)
    handleGenerate('Slow Request A: Pasta with truffle cream', {
      simulateFailure: 'slow_timeout',
    });

    // 2. Fast request (Request B) dispatched 200ms later
    setTimeout(() => {
      handleGenerate('Fast Request B: Quick 5-minute Egg Scramble', {});
    }, 200);
  };

  const isCurrentRecipeSaved = recipe
    ? savedRecipes.some((r) => r.id === recipe.id)
    : false;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <Navbar
        onNewRecipe={() => {
          setRecipe(null);
          setError(null);
          setCheckedSteps([]);
        }}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        savedCount={savedRecipes.length}
      />

      {/* Evaluator Failure Mode Simulator Bar */}
      <FailureSimulator
        onSimulate={handleSimulate}
        onTestStaleRaceCondition={handleTestStaleRaceCondition}
        isLoading={isLoading}
      />

      {/* Main Container */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl space-y-8">
        {/* Free-form Input Area */}
        <PromptInput
          onGenerate={handleGenerate}
          isLoading={isLoading}
          initialPrompt={lastPrompt}
        />

        {/* Structured Result / Loading / Error View */}
        <ResultView
          recipe={recipe}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
          onUseFallback={handleUseFallback}
          onStartCookingMode={handleStartCookingMode}
          onSaveRecipe={handleSaveRecipe}
          isSaved={isCurrentRecipeSaved}
          onRefine={handleRefine}
          isRefining={isRefining}
          checkedSteps={checkedSteps}
          onToggleStep={handleToggleStep}
        />
      </main>

      {/* Fullscreen Cooking Mode Modal */}
      {isCookingModeOpen && recipe && (
        <CookingModeModal
          recipe={recipe}
          onClose={() => setIsCookingModeOpen(false)}
          checkedSteps={checkedSteps}
          onToggleStep={handleToggleStep}
          scaledServings={cookingServings}
        />
      )}

      {/* Saved Recipes Modal */}
      {isSavedModalOpen && (
        <SavedRecipesModal
          savedRecipes={savedRecipes}
          onSelectRecipe={(selected) => {
            setRecipe(selected);
            setError(null);
            setCheckedSteps([]);
          }}
          onDeleteRecipe={handleDeleteSavedRecipe}
          onClose={() => setIsSavedModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 text-center text-xs text-slate-500 no-print">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            CulinaryCraft • Flam Frontend Internship Assignment • AI Fridge-to-Recipe Interactive Tool
          </p>
          <p className="text-slate-400">
            Protected Backend Proxy • Strict Zod JSON Schema • Defensive Parsing
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
