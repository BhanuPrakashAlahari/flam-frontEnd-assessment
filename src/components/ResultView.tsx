import React from 'react';
import type { RecipeResult, AppError } from '../types/result';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { RecipeView } from './RecipeView';
import { Utensils, Sparkles, Clock, ArrowRightLeft } from 'lucide-react';

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

  // 4. Initial Empty State (Clean White & Blue UI)
  return (
    <div className="glass-panel p-8 sm:p-12 text-center border border-slate-200 bg-white relative overflow-hidden shadow-sm">
      <div className="max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600 shadow-xs">
          <Utensils className="w-8 h-8" />
        </div>

        <h3 className="font-display text-xl font-bold text-slate-900">
          Ready to Synthesize Your Recipe
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed">
          Type the ingredients in your fridge or pantry above, then click 
          <span className="text-blue-700 font-semibold"> "Synthesize Recipe with AI"</span>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs text-slate-600 text-left">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-blue-700 font-bold block mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Scalable
            </span>
            Automatic portion math and fractional measurements.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-emerald-700 font-bold block mb-1 flex items-center gap-1">
              <ArrowRightLeft className="w-3.5 h-3.5" /> Smart Swaps
            </span>
            Real-time dietary substitutions with ratios.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-purple-700 font-bold block mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Focus Mode
            </span>
            Step-by-step cooking timers with audio notifications.
          </div>
        </div>
      </div>
    </div>
  );
};
