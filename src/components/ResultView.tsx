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
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={onRetry}
        onUseFallback={onUseFallback}
      />
    );
  }

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

  return (
    <div className="bg-white p-8 sm:p-12 text-center rounded-2xl border border-slate-200 shadow-xs">
      <div className="max-w-sm mx-auto space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
          <Utensils className="w-6 h-6" />
        </div>
        <h3 className="font-display text-base font-bold text-slate-900">
          No Recipe Generated Yet
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Type your available ingredients above and click "Generate Recipe" to get an interactive cooking guide.
        </p>
      </div>
    </div>
  );
};
