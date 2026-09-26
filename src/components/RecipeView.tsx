import React, { useState } from 'react';
import { 
  Clock, ChefHat, Check, Bookmark, 
  Printer, Play, ArrowRightLeft, 
  Utensils, Plus, Minus, Copy, CheckCheck, Lightbulb 
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
  if (Math.abs(frac - 0.25) < 0.05) fracStr = '¼';
  else if (Math.abs(frac - 0.33) < 0.05) fracStr = '⅓';
  else if (Math.abs(frac - 0.5) < 0.05) fracStr = '½';
  else if (Math.abs(frac - 0.66) < 0.05) fracStr = '⅔';
  else if (Math.abs(frac - 0.75) < 0.05) fracStr = '¾';

  if (whole === 0 && fracStr) return fracStr;
  if (whole > 0 && fracStr) return `${whole} ${fracStr}`;
  if (rounded % 1 === 0) return whole.toString();
  return rounded.toFixed(1).replace(/\.0$/, '');
}

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
      return `• ${amount} ${ing.unit} ${name}`;
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge-tag bg-blue-50 border border-blue-200 text-blue-700 text-xs">
              {recipe.cuisine}
            </span>
            <span className="badge-tag bg-slate-100 border border-slate-200 text-slate-700 text-xs">
              {recipe.difficulty}
            </span>
            <span className="badge-tag bg-slate-100 border border-slate-200 text-slate-700 text-xs">
              ⏱️ {recipe.totalTimeMinutes} mins
            </span>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              type="button"
              onClick={handleCopyIngredients}
              className="btn-secondary text-xs py-1.5 px-3 rounded-lg"
              title="Copy ingredients"
            >
              {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="btn-secondary text-xs py-1.5 px-3 rounded-lg"
              title="Print recipe"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={() => onSaveRecipe(recipe)}
              className={`btn-secondary text-xs py-1.5 px-3 rounded-lg ${
                isSaved ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold' : ''
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600 text-blue-600' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {recipe.title}
          </h1>
          <p className="text-slate-600 text-sm mt-1 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 no-print">
          <div className="text-xs text-slate-500">
            {recipe.steps.length} steps • {recipe.ingredients.length} ingredients
          </div>

          <button
            type="button"
            onClick={() => onStartCookingMode(servings)}
            className="btn-primary text-xs sm:text-sm py-2 px-4 rounded-xl font-bold flex items-center gap-2 shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Start Cooking Mode</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Ingredients */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Utensils className="w-4 h-4 text-blue-600" />
                <span>Ingredients</span>
              </h3>

              {/* Servings Stepper */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.max(1, s - 1))}
                  disabled={servings <= 1}
                  className="w-6 h-6 rounded bg-white hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center text-slate-700 border border-slate-200"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-bold text-blue-700 text-xs">
                  {servings}p
                </span>
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.min(12, s + 1))}
                  disabled={servings >= 12}
                  className="w-6 h-6 rounded bg-white hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center text-slate-700 border border-slate-200"
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
                    className={`p-2.5 rounded-xl border transition-all ${
                      isChecked
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : activeSwap
                        ? 'bg-blue-50/50 border-blue-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div 
                      onClick={() => handleToggleIngredient(ing.id)}
                      className="flex items-center gap-2.5 cursor-pointer select-none text-xs sm:text-sm"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="flex-1 flex items-baseline justify-between gap-2">
                        <span className={`font-medium ${isChecked ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {displayName}
                        </span>
                        <span className={`font-mono font-bold text-blue-700 text-xs shrink-0 ${isChecked ? 'line-through text-slate-400' : ''}`}>
                          {scaledAmount} {ing.unit}
                        </span>
                      </div>
                    </div>

                    {/* Quick Swap Pills */}
                    {ing.swaps && ing.swaps.length > 0 && !isChecked && (
                      <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex flex-wrap items-center gap-1">
                        <span className="text-[10px] text-slate-400">Swap:</span>
                        {ing.swaps.map((swap, sIdx) => {
                          const isSwapActive = activeSwap?.substitute === swap.substitute;
                          return (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => handleToggleSwap(ing.id, swap)}
                              className={`text-[10px] py-0.5 px-2 rounded-md border transition-all ${
                                isSwapActive
                                  ? 'bg-blue-600 text-white font-bold border-blue-600'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-blue-700'
                              }`}
                            >
                              <ArrowRightLeft className="w-2.5 h-2.5 inline mr-1" />
                              {swap.substitute}
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

        {/* Right Column: Cooking Steps */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-blue-600" />
                <span>Cooking Steps</span>
              </h3>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {checkedSteps.length}/{recipe.steps.length} Done ({progressPercent}%)
              </span>
            </div>

            {/* Steps List */}
            <div className="space-y-3">
              {recipe.steps.map((step) => {
                const isStepDone = checkedSteps.includes(step.stepNumber);

                return (
                  <div
                    key={step.stepNumber}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                      isStepDone
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => onToggleStep(step.stepNumber)}
                        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isStepDone
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'bg-white border-slate-300 text-slate-500 hover:border-blue-500'
                        }`}
                      >
                        {isStepDone ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <span className="text-[11px] font-bold">{step.stepNumber}</span>
                        )}
                      </button>

                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          {step.shortSummary && (
                            <span className="font-semibold text-xs text-blue-900">
                              {step.shortSummary}
                            </span>
                          )}
                          {step.timerMinutes && step.timerMinutes > 0 && (
                            <span className="text-[11px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-md border border-blue-200 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-blue-600" />
                              {step.timerMinutes}m
                            </span>
                          )}
                        </div>

                        <p className={`text-xs sm:text-sm text-slate-800 leading-relaxed ${
                          isStepDone ? 'line-through text-slate-400' : ''
                        }`}>
                          {step.instruction}
                        </p>

                        {step.tip && !isStepDone && (
                          <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-start gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span><strong>Tip:</strong> {step.tip}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clean Recipe Refinement Form */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs no-print">
            <form onSubmit={handleRefineSubmit} className="flex gap-2">
              <input
                type="text"
                value={refinementInput}
                onChange={(e) => setRefinementInput(e.target.value)}
                placeholder='Adjust recipe (e.g. "Make it spicy", "Quick 15-min version")...'
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                disabled={isRefining}
              />
              <button
                type="submit"
                disabled={isRefining || !refinementInput.trim()}
                className="btn-primary text-xs py-2 px-3 rounded-xl font-semibold shrink-0"
              >
                {isRefining ? 'Refining...' : 'Refine'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
