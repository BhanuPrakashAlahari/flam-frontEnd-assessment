import React from 'react';
import type { RecipeResult, AppError } from '../types/result';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { RecipeView } from './RecipeView';
import { Utensils } from 'lucide-react';

interface ResultViewProps {
  recipe: RecipeResult | null;
  isLoading: boolean;
  error: AppError | null;
  onRetry: () => void;
  onUseFallback?: () => void;
  onStartCookingMode: (servings: number) => void;
  onSaveRecipe: (recipe: RecipeResult) => void;
  isSaved: boolean;
  onRefine: (refinementText: string) => void;
  isRefining: boolean;
  checkedSteps: number[];
  onToggleStep: (stepNumber: number) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  recipe,
  isLoading,
  error,
  onRetry,
  onUseFallback,
  onStartCookingMode,
  onSaveRecipe,
  isSaved,
  onRefine,
  isRefining,
  checkedSteps,
  onToggleStep,
}) => {
  // 1. Loading State
  if (isLoading) {
    return <LoadingState />;
  }

  // 2. Error State
  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={onRetry}
        onUseFallback={onUseFallback}
      />
    );
  }

  // 3. Render Recipe View
  if (recipe) {
    return (
      <RecipeView
        recipe={recipe}
        onStartCookingMode={onStartCookingMode}
        onSaveRecipe={onSaveRecipe}
        isSaved={isSaved}
        onRefine={onRefine}
        isRefining={isRefining}
        checkedSteps={checkedSteps}
        onToggleStep={onToggleStep}
      />
    );
  }

  // 4. Initial Empty State
  return (
    <div className="glass-panel p-8 sm:p-12 text-center border border-slate-800 bg-slate-900/40 relative overflow-hidden">
      <div className="max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mx-auto text-amber-400">
          <Utensils className="w-8 h-8" />
        </div>

        <h3 className="font-display text-xl font-bold text-white">
          No Recipe Generated Yet
        </h3>

        <p className="text-sm text-slate-400 leading-relaxed">
          Type the ingredients you currently have in your fridge into the input box above, and click 
          <span className="text-amber-300 font-semibold"> "Generate Interactive Recipe"</span>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs text-slate-400 text-left">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-amber-400 font-bold block mb-1">⚖️ Scalable</span>
            Scale ingredient quantities to any portion size automatically.
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-1">🔄 Smart Swaps</span>
            Switch ingredients with diet-friendly alternatives in real time.
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-1">⏱️ Focus Mode</span>
            Step-by-step cooking timers with audio notifications.
          </div>
        </div>
      </div>
    </div>
  );
};
