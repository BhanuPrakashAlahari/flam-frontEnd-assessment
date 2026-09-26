import React, { useState } from 'react';
import { 
  Clock, ChefHat, Check, Bookmark, 
  Printer, Play, ArrowRightLeft, 
  Utensils, Plus, Minus, Copy, CheckCheck, Lightbulb,
  Sparkles, Flame
} from 'lucide-react';
import type { RecipeResult, IngredientSwap } from '../types/result';

interface RecipeViewProps {
  recipe: RecipeResult;
  onStartCookingMode: (servings: number) => void;
  onSaveRecipe: (recipe: RecipeResult) => void;
  isSaved: boolean;
  onRefine: (refinementText: string) => void;
  isRefining: boolean;
  checkedSteps: number[];
  onToggleStep: (stepNumber: number) => void;
}

function formatAmount(amount: number): string {
  if (amount <= 0) return '';
  const rounded = Math.round(amount * 100) / 100;
  const whole = Math.floor(rounded);
  const frac = rounded - whole;

  let fracStr = '';
  if (Math.abs(frac - 0.25) < 0.05) fracStr = '1/4';
  else if (Math.abs(frac - 0.33) < 0.05) fracStr = '1/3';
  else if (Math.abs(frac - 0.5) < 0.05) fracStr = '1/2';
  else if (Math.abs(frac - 0.66) < 0.05) fracStr = '2/3';
  else if (Math.abs(frac - 0.75) < 0.05) fracStr = '3/4';

  if (whole === 0 && fracStr) return fracStr;
  if (whole > 0 && fracStr) return `${whole} ${fracStr}`;
  if (rounded % 1 === 0) return whole.toString();
  return rounded.toFixed(1).replace(/\.0$/, '');
}

const QUICK_REFINEMENTS = [
  'Make it spicy',
  'Air fryer version',
  'Under 15 minutes',
  'Extra crispy',
  'Low sodium'
];

export const RecipeView: React.FC<RecipeViewProps> = ({
  recipe,
  onStartCookingMode,
  onSaveRecipe,
  isSaved,
  onRefine,
  isRefining,
  checkedSteps,
  onToggleStep,
}) => {
  const [servings, setServings] = useState<number>(recipe.baseServings || 2);
  const [activeSwaps, setActiveSwaps] = useState<Record<string, IngredientSwap>>({});
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [refinementInput, setRefinementInput] = useState('');
  const [copied, setCopied] = useState(false);

  const scaleRatio = servings / (recipe.baseServings || 2);

  const handleToggleSwap = (ingredientId: string, swap: IngredientSwap) => {
    setActiveSwaps((prev) => {
      const current = prev[ingredientId];
      if (current && current.substitute === swap.substitute) {
        const next = { ...prev };
        delete next[ingredientId];
        return next;
      }
      return { ...prev, [ingredientId]: swap };
    });
  };

  const handleToggleIngredient = (id: string) => {
    setCheckedIngredients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCopyIngredients = () => {
    const lines = recipe.ingredients.map((ing) => {
      const swap = activeSwaps[ing.id];
      const name = swap ? `${swap.substitute} (replacing ${ing.name})` : ing.name;
      const amount = formatAmount(ing.amount * scaleRatio);
      return `- ${amount} ${ing.unit} ${name}`;
    });

    navigator.clipboard.writeText(`${recipe.title} (${servings} portions)\n\n` + lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinementInput.trim() || isRefining) return;
    onRefine(refinementInput.trim());
    setRefinementInput('');
  };

  const progressPercent = Math.round(
    (checkedSteps.length / (recipe.steps.length || 1)) * 100
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Hero Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge-tag bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              {recipe.cuisine}
            </span>
            <span className="badge-tag bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              {recipe.difficulty}
            </span>
            <span className="badge-tag bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{recipe.totalTimeMinutes} mins</span>
            </span>
            {recipe.nutritionPerServing && (
              <span className="badge-tag bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-emerald-600" />
                <span>{recipe.nutritionPerServing.calories} kcal / serving</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              type="button"
              onClick={handleCopyIngredients}
              className="btn-secondary text-xs py-2 px-3.5 rounded-xl font-semibold"
              title="Copy ingredients to clipboard"
            >
              {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="btn-secondary text-xs py-2 px-3.5 rounded-xl font-semibold"
              title="Print clean recipe card"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={() => onSaveRecipe(recipe)}
              className={`btn-secondary text-xs py-2 px-3.5 rounded-xl font-semibold transition-all ${
                isSaved ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-2xs' : ''
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600 text-blue-600' : 'text-slate-600'}`} />
              <span>{isSaved ? 'Saved in Cookbook' : 'Save'}</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {recipe.title}
          </h1>
          {recipe.tagline && (
            <p className="text-blue-600 font-semibold text-sm sm:text-base mt-1">
              {recipe.tagline}
            </p>
          )}
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Action Bar with Quick CTA */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 no-print">
          <div className="text-xs sm:text-sm text-slate-500 font-medium">
            <span className="font-bold text-slate-800">{recipe.steps.length}</span> cooking steps • <span className="font-bold text-slate-800">{recipe.ingredients.length}</span> ingredients
          </div>

          <button
            type="button"
            onClick={() => onStartCookingMode(servings)}
            className="btn-primary text-xs sm:text-sm py-2.5 px-5 rounded-2xl font-bold flex items-center gap-2 shadow-md"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Fullscreen Cooking Mode</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Ingredients */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Utensils className="w-4 h-4 text-blue-600" />
                <span>Ingredients</span>
              </h3>

              {/* Servings Stepper */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.max(1, s - 1))}
                  disabled={servings <= 1}
                  className="w-6 h-6 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center text-slate-700 border border-slate-200 shadow-2xs"
                  title="Decrease portions"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-9 text-center font-bold text-blue-700 text-xs sm:text-sm">
                  {servings}p
                </span>
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.min(12, s + 1))}
                  disabled={servings >= 12}
                  className="w-6 h-6 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center text-slate-700 border border-slate-200 shadow-2xs"
                  title="Increase portions"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Ingredients List */}
            <div className="space-y-2">
              {recipe.ingredients.map((ing) => {
                const isChecked = checkedIngredients.includes(ing.id);
                const activeSwap = activeSwaps[ing.id];
                const displayName = activeSwap ? activeSwap.substitute : ing.name;
                const scaledAmount = formatAmount(ing.amount * scaleRatio);

                return (
                  <div
                    key={ing.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      isChecked
                        ? 'bg-slate-50/70 border-slate-200 opacity-60'
                        : activeSwap
                        ? 'bg-blue-50/60 border-blue-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div 
                      onClick={() => handleToggleIngredient(ing.id)}
                      className="flex items-center gap-3 cursor-pointer select-none text-xs sm:text-sm"
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="flex-1 flex items-baseline justify-between gap-2">
                        <span className={`font-semibold ${isChecked ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {displayName}
                        </span>
                        <span className={`font-mono font-bold text-blue-700 text-xs sm:text-sm shrink-0 ${isChecked ? 'line-through text-slate-400' : ''}`}>
                          {scaledAmount} {ing.unit}
                        </span>
                      </div>
                    </div>

                    {/* Quick Swap Pills */}
                    {ing.swaps && ing.swaps.length > 0 && !isChecked && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Swap:</span>
                        {ing.swaps.map((swap, sIdx) => {
                          const isSwapActive = activeSwap?.substitute === swap.substitute;
                          return (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => handleToggleSwap(ing.id, swap)}
                              className={`text-[11px] py-0.5 px-2.5 rounded-lg border transition-all font-semibold ${
                                isSwapActive
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-blue-700 hover:border-blue-200'
                              }`}
                            >
                              <ArrowRightLeft className="w-2.5 h-2.5 inline mr-1" />
                              <span>{swap.substitute}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Cooking Steps & Refinement */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-blue-600" />
                <span>Cooking Steps</span>
              </h3>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                {checkedSteps.length}/{recipe.steps.length} Completed ({progressPercent}%)
              </span>
            </div>

            {/* Steps List */}
            <div className="space-y-3.5">
              {recipe.steps.map((step) => {
                const isStepDone = checkedSteps.includes(step.stepNumber);

                return (
                  <div
                    key={step.stepNumber}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      isStepDone
                        ? 'bg-slate-50/70 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <button
                        type="button"
                        onClick={() => onToggleStep(step.stepNumber)}
                        className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                          isStepDone
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                            : 'bg-slate-50 border-slate-300 text-slate-600 hover:border-blue-500'
                        }`}
                      >
                        {isStepDone ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <span className="text-xs font-bold">{step.stepNumber}</span>
                        )}
                      </button>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          {step.shortSummary && (
                            <span className="font-bold text-xs sm:text-sm text-blue-950">
                              {step.shortSummary}
                            </span>
                          )}
                          {step.timerMinutes && step.timerMinutes > 0 && (
                            <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-lg border border-blue-200 flex items-center gap-1.5 shrink-0">
                              <Clock className="w-3.5 h-3.5 text-blue-600" />
                              <span>{step.timerMinutes}m timer</span>
                            </span>
                          )}
                        </div>

                        <p className={`text-xs sm:text-sm text-slate-800 leading-relaxed ${
                          isStepDone ? 'line-through text-slate-400' : ''
                        }`}>
                          {step.instruction}
                        </p>

                        {step.tip && !isStepDone && (
                          <div className="text-xs text-amber-900 bg-amber-50/80 p-3 rounded-xl border border-amber-200 flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span><strong>Chef's Technique:</strong> {step.tip}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clean Recipe Refinement Loop */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3 no-print">
            <div className="flex items-center gap-2 text-slate-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Refine This Recipe</span>
            </div>

            <form onSubmit={handleRefineSubmit} className="flex gap-2">
              <input
                type="text"
                value={refinementInput}
                onChange={(e) => setRefinementInput(e.target.value)}
                placeholder='Ask AI to adjust (e.g. "Make it spicy", "Air fryer version", "Under 15 minutes")...'
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all"
                disabled={isRefining}
              />
              <button
                type="submit"
                disabled={isRefining || !refinementInput.trim()}
                className="btn-primary text-xs sm:text-sm py-2 px-5 rounded-2xl font-bold shrink-0"
              >
                {isRefining ? 'Refining...' : 'Refine'}
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400">Suggestions:</span>
              {QUICK_REFINEMENTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => onRefine(q)}
                  disabled={isRefining}
                  className="text-[11px] py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-all font-medium disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
