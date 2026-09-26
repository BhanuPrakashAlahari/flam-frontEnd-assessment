import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatedNavFramer } from '@/components/ui/navigation-menu';
import { LandingPage } from './pages/LandingPage';
import { StudioPage } from './pages/StudioPage';
import { CookbookPage } from './pages/CookbookPage';
import { PantryPage } from './pages/PantryPage';
import DemoPage from '@/components/ui/demo';
import { CookingModeModal } from './components/CookingModeModal';
import type { RecipeResult, AppError } from './types/result';
import { generateRecipe } from './lib/api';
import type { GenerateOptions } from './lib/api';

const SAVED_RECIPES_STORAGE_KEY = 'cookmate_saved_recipes_v1';

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

  // Stale request / prompt memory
  const [lastPrompt, setLastPrompt] = useState<string>('');
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

    const response = await generateRecipe(lastPrompt || recipe.title, {
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
    if (lastPrompt) {
      handleGenerate(lastPrompt, lastOptions);
    } else {
      handleGenerate('3 eggs, cheddar cheese, baby spinach, garlic', {});
    }
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

  // Stale Request Race Condition Test
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
    <Router>
      <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        {/* Full-width Animated Framer Motion Navigation */}
        <AnimatedNavFramer
          onNewRecipe={() => {
            setRecipe(null);
            setError(null);
            setCheckedSteps([]);
          }}
          savedCount={savedRecipes.length}
        />

        {/* Main Content Area with Top Padding for Floating Navbar */}
        <main className="flex-1 container mx-auto px-4 pt-24 sm:pt-28 pb-10 max-w-6xl">
          <Routes>
            {/* 1. Landing Page (Home) */}
            <Route
              path="/"
              element={
                <LandingPage
                  onQuickStart={(quickPrompt) => {
                    handleGenerate(quickPrompt, {});
                  }}
                />
              }
            />

            {/* 2. Main Studio / Generator Route */}
            <Route
              path="/studio"
              element={
                <StudioPage
                  recipe={recipe}
                  isLoading={isLoading}
                  isRefining={isRefining}
                  error={error}
                  lastPrompt={lastPrompt}
                  checkedSteps={checkedSteps}
                  isCurrentRecipeSaved={isCurrentRecipeSaved}
                  onGenerate={handleGenerate}
                  onRefine={handleRefine}
                  onRetry={handleRetry}
                  onUseFallback={handleUseFallback}
                  onStartCookingMode={handleStartCookingMode}
                  onSaveRecipe={handleSaveRecipe}
                  onToggleStep={handleToggleStep}
                  onSimulate={handleSimulate}
                  onTestStaleRaceCondition={handleTestStaleRaceCondition}
                />
              }
            />

            {/* 3. Cookbook / Saved Bookmarks Route */}
            <Route
              path="/cookbook"
              element={
                <CookbookPage
                  savedRecipes={savedRecipes}
                  onSelectRecipe={(selected) => {
                    setRecipe(selected);
                    setError(null);
                    setCheckedSteps([]);
                  }}
                  onDeleteRecipe={handleDeleteSavedRecipe}
                />
              }
            />
            {/* Route alias for backwards compatibility */}
            <Route path="/saved" element={<Navigate to="/cookbook" replace />} />

            {/* 4. Virtual Pantry Stock Route */}
            <Route
              path="/pantry"
              element={
                <PantryPage
                  onGenerateFromPantry={(ingredients) => {
                    handleGenerate(ingredients, {});
                  }}
                />
              }
            />

            {/* 5. Standalone Framer Motion Demo Route */}
            <Route path="/demo" element={<DemoPage />} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
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

        {/* Clean Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 no-print mt-12">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-medium text-slate-700">
              CookMate • AI Fridge-to-Recipe Studio
            </p>
            <p className="text-slate-500 font-medium">
              Made with love by Bhanu Prakash
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
