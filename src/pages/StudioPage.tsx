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
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Free-form Input Area */}
      <PromptInput
        onGenerate={onGenerate}
        isLoading={isLoading}
        initialPrompt={lastPrompt}
      />

      {/* Structured Result / Loading / Error View */}
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
