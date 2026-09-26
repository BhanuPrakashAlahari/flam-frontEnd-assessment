import React, { useRef, useEffect } from 'react';
import type { RecipeResult, AppError } from '../types/result';
import type { GenerateOptions } from '../lib/api';
import { PromptInput } from '../components/PromptInput';
import { ResultView } from '../components/ResultView';
import { FailureSimulator } from '../components/FailureSimulator';

interface StudioPageProps {
  recipe: RecipeResult | null;
  isLoading: boolean;
  isRefining: boolean;
  error: AppError | null;
  lastPrompt: string;
  checkedSteps: number[];
  isCurrentRecipeSaved: boolean;
  onGenerate: (prompt: string, options?: GenerateOptions) => void;
  onRefine: (refinementText: string) => void;
  onRetry: () => void;
  onUseFallback: () => void;
  onStartCookingMode: (servings: number) => void;
  onSaveRecipe: (recipe: RecipeResult) => void;
  onToggleStep: (stepNumber: number) => void;
  onSimulate: (simulateType: GenerateOptions['simulateFailure']) => void;
  onTestStaleRaceCondition: () => void;
}

export const StudioPage: React.FC<StudioPageProps> = ({
  recipe,
  isLoading,
  isRefining,
  error,
  lastPrompt,
  checkedSteps,
  isCurrentRecipeSaved,
  onGenerate,
  onRefine,
  onRetry,
  onUseFallback,
  onStartCookingMode,
  onSaveRecipe,
  onToggleStep,
  onSimulate,
  onTestStaleRaceCondition,
}) => {
  const resultSectionRef = useRef<HTMLDivElement>(null);

  // Automatically smooth-scroll to the recipe result area when generation begins or updates
  useEffect(() => {
    if (isLoading || recipe || error) {
      const timer = setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, recipe, error]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Free-form Input Area */}
      <PromptInput
        onGenerate={onGenerate}
        isLoading={isLoading}
        initialPrompt={lastPrompt}
      />

      {/* Structured Result / Loading / Error View */}
      <div ref={resultSectionRef} className="scroll-mt-24">
        <ResultView
          recipe={recipe}
          isLoading={isLoading}
          error={error}
          onRetry={onRetry}
          onUseFallback={onUseFallback}
          onStartCookingMode={onStartCookingMode}
          onSaveRecipe={onSaveRecipe}
          isSaved={isCurrentRecipeSaved}
          onRefine={onRefine}
          isRefining={isRefining}
          checkedSteps={checkedSteps}
          onToggleStep={onToggleStep}
        />
      </div>

      {/* Discrete Evaluator Failure Bar at bottom */}
      <div className="pt-4">
        <FailureSimulator
          onSimulate={onSimulate}
          onTestStaleRaceCondition={onTestStaleRaceCondition}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
