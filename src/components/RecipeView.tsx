import React, { useState } from 'react';
import { 
  Flame, Clock, Users, ChefHat, Check, Bookmark, 
  Printer, Play, Sparkles, ArrowRightLeft, ShieldCheck, 
  Utensils, Plus, Minus, Copy, CheckCheck, Lightbulb, RefreshCw 
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

/**
 * Formats decimal numbers into clean fractions or friendly decimal strings
 */
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

  // Scaled calculations
  const scaleRatio = servings / (recipe.baseServings || 2);

  const handleToggleSwap = (ingredientId: string, swap: IngredientSwap) => {
    setActiveSwaps((prev) => {
      const current = prev[ingredientId];
      if (current && current.substitute === swap.substitute) {
        const next = { ...prev };
        delete next[ingredientId];
        return next;
      }
      return {
        ...prev,
        [ingredientId]: swap,
      };
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
      return `• ${amount} ${ing.unit} ${name}${ing.notes ? ` (${ing.notes})` : ''}`;
    });

    if (recipe.pantryStaplesNeeded?.length) {
      lines.push('\nPantry staples needed:');
      recipe.pantryStaplesNeeded.forEach((s) => lines.push(`• ${s}`));
    }

    navigator.clipboard.writeText(`${recipe.title} (${servings} portions)\n\n` + lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Recipe Header Card */}
      <div className="glass-panel p-6 sm:p-8 border-slate-200 bg-white relative overflow-hidden shadow-sm">
        <div className="space-y-4">
          {/* Tags & Action Icons Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge-tag bg-blue-50 border border-blue-200 text-blue-700">
                🍳 {recipe.cuisine}
              </span>
              <span className={`badge-tag border ${
                recipe.difficulty === 'Easy'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : recipe.difficulty === 'Medium'
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}>
                {recipe.difficulty} Difficulty
              </span>
              {recipe.dietaryTags.map((tag) => (
                <span
                  key={tag}
                  className="badge-tag bg-slate-100 border border-slate-200 text-slate-700 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 no-print">
              <button
                type="button"
                onClick={handleCopyIngredients}
                className="btn-secondary text-xs py-1.5 px-3 rounded-lg"
                title="Copy ingredients to clipboard"
              >
                {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy List'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="btn-secondary text-xs py-1.5 px-3 rounded-lg"
                title="Print recipe card"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print</span>
              </button>

              <button
                type="button"
                onClick={() => onSaveRecipe(recipe)}
                className={`btn-secondary text-xs py-1.5 px-3 rounded-lg transition-colors ${
                  isSaved ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold' : ''
                }`}
                title={isSaved ? 'Recipe Saved' : 'Save to bookmarks'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600 text-blue-600' : ''}`} />
                <span>{isSaved ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {recipe.title}
            </h2>
            <p className="text-blue-700 font-semibold text-base sm:text-lg mt-1">
              {recipe.tagline}
            </p>
            <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
              {recipe.description}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block font-medium">Prep Time</span>
                <span className="text-sm font-bold text-slate-900">{recipe.prepTimeMinutes} mins</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block font-medium">Cook Time</span>
                <span className="text-sm font-bold text-slate-900">{recipe.cookTimeMinutes} mins</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block font-medium">Total Time</span>
                <span className="text-sm font-bold text-slate-900">{recipe.totalTimeMinutes} mins</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block font-medium">Base Servings</span>
                <span className="text-sm font-bold text-slate-900">{recipe.baseServings} portions</span>
              </div>
            </div>
          </div>

          {/* Cooking Mode CTA */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 no-print border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Fullscreen cooking mode with active step countdown timers and sound alerts</span>
            </div>

            <button
              type="button"
              onClick={() => onStartCookingMode(servings)}
              className="btn-primary w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Focus Cooking Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout (Ingredients & Swaps + Steps & Nutrition) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Ingredients with Scaler & Smart Swaps */}
        <div className="lg:col-span-5 space-y-6">
          {/* Servings Scaler Widget */}
          <div className="glass-panel p-5 border-slate-200 bg-white space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Scalable Servings</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Ingredient quantities scale automatically
                </p>
              </div>

              {/* Servings Stepper */}
              <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.max(1, s - 1))}
                  disabled={servings <= 1}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 transition-colors border border-slate-200 shadow-xs"
                  title="Decrease servings"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <span className="w-12 text-center font-bold font-mono text-blue-700 text-sm">
                  {servings} {servings === 1 ? 'p' : 'ppl'}
                </span>

                <button
                  type="button"
                  onClick={() => setServings((s) => Math.min(12, s + 1))}
                  disabled={servings >= 12}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 transition-colors border border-slate-200 shadow-xs"
                  title="Increase servings"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Multiplier Pills */}
            <div className="flex gap-2">
              {[1, 2, 4, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setServings(num)}
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    servings === num
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {num}x
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Ingredients List */}
          <div className="glass-panel p-6 border-slate-200 bg-white space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-blue-600" />
                  <span>Ingredients Checklist</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {recipe.ingredients.length} items • Click swap pills to substitute
                </p>
              </div>

              {checkedIngredients.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCheckedIngredients([])}
                  className="text-xs text-blue-600 hover:text-blue-700 underline font-medium"
                >
                  Reset checklist
                </button>
              )}
            </div>

            <div className="space-y-3">
              {recipe.ingredients.map((ing) => {
                const isChecked = checkedIngredients.includes(ing.id);
                const activeSwap = activeSwaps[ing.id];
                const displayName = activeSwap ? activeSwap.substitute : ing.name;
                const scaledAmount = formatAmount(ing.amount * scaleRatio);

                return (
                  <div
                    key={ing.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isChecked
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : activeSwap
                        ? 'bg-blue-50/50 border-blue-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div 
                        onClick={() => handleToggleIngredient(ing.id)}
                        className="flex items-start gap-3 cursor-pointer flex-1 select-none"
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className={`font-mono font-bold text-sm text-blue-700 ${isChecked ? 'line-through text-slate-400' : ''}`}>
                              {scaledAmount} {ing.unit}
                            </span>
                            <span className={`font-medium text-sm text-slate-900 ${isChecked ? 'line-through text-slate-400' : ''}`}>
                              {displayName}
                            </span>
                          </div>

                          {ing.notes && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {ing.notes}
                            </p>
                          )}

                          {activeSwap && (
                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-md border border-blue-200">
                              <ArrowRightLeft className="w-3 h-3 text-blue-600" />
                              <span>Substituted for {ing.name} ({activeSwap.ratio})</span>
                              {activeSwap.dietaryBenefit && (
                                <span className="text-emerald-700 font-semibold">• {activeSwap.dietaryBenefit}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Swap Pills */}
                    {ing.swaps && ing.swaps.length > 0 && !isChecked && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Swaps:
                        </span>
                        {ing.swaps.map((swap, sIdx) => {
                          const isSwapActive = activeSwap?.substitute === swap.substitute;
                          return (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => handleToggleSwap(ing.id, swap)}
                              className={`text-[11px] py-0.5 px-2 rounded-md border transition-all flex items-center gap-1 ${
                                isSwapActive
                                  ? 'bg-blue-600 text-white font-bold border-blue-600'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700'
                              }`}
                              title={swap.dietaryBenefit || 'Ingredient alternative'}
                            >
                              <ArrowRightLeft className="w-2.5 h-2.5" />
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

            {/* Assumed Pantry Staples */}
            {recipe.pantryStaplesNeeded && recipe.pantryStaplesNeeded.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 mt-4">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Assumed Pantry Staples Needed:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {recipe.pantryStaplesNeeded.map((staple) => (
                    <span
                      key={staple}
                      className="text-xs px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
                    >
                      ✓ {staple}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Nutrition Macro Summary */}
          {recipe.nutritionPerServing && (
            <div className="glass-panel p-5 border-slate-200 bg-white space-y-3 shadow-xs">
              <h3 className="font-display text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Nutrition per portion</span>
                <span className="text-blue-700 font-mono text-base font-bold">
                  {recipe.nutritionPerServing.calories} kcal
                </span>
              </h3>

              <div className="grid grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block font-medium">Protein</span>
                  <span className="text-xs font-bold text-emerald-600 font-mono">
                    {recipe.nutritionPerServing.proteinGrams}g
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block font-medium">Carbs</span>
                  <span className="text-xs font-bold text-blue-600 font-mono">
                    {recipe.nutritionPerServing.carbsGrams}g
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block font-medium">Fat</span>
                  <span className="text-xs font-bold text-amber-600 font-mono">
                    {recipe.nutritionPerServing.fatGrams}g
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block font-medium">Fiber</span>
                  <span className="text-xs font-bold text-purple-600 font-mono">
                    {recipe.nutritionPerServing.fiberGrams || 0}g
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Checkable Steps & Chef Tips */}
        <div className="lg:col-span-7 space-y-6">
          {/* Steps Header with Progress Bar */}
          <div className="glass-panel p-6 border-slate-200 bg-white space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-blue-600" />
                  <span>Interactive Cooking Steps</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Check off steps as you cook along in real-time
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  {checkedSteps.length} / {recipe.steps.length} Steps Done ({progressPercent}%)
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Step List */}
            <div className="space-y-4 pt-2">
              {recipe.steps.map((step) => {
                const isStepDone = checkedSteps.includes(step.stepNumber);

                return (
                  <div
                    key={step.stepNumber}
                    className={`p-4 sm:p-5 rounded-xl border transition-all ${
                      isStepDone
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200 hover:border-blue-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Step Checkbox */}
                      <button
                        type="button"
                        onClick={() => onToggleStep(step.stepNumber)}
                        className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                          isStepDone
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'bg-white border-slate-300 text-slate-600 hover:border-blue-500'
                        }`}
                        title={isStepDone ? 'Mark uncompleted' : 'Mark completed'}
                      >
                        {isStepDone ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <span className="font-mono text-xs font-bold text-slate-500">
                            {step.stepNumber}
                          </span>
                        )}
                      </button>

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          {step.shortSummary && (
                            <span className="font-display font-semibold text-sm text-blue-800">
                              {step.shortSummary}
                            </span>
                          )}

                          {step.timerMinutes && step.timerMinutes > 0 && (
                            <span className="badge-tag bg-blue-50 border border-blue-200 text-blue-700 text-xs py-0.5 flex items-center gap-1 font-semibold">
                              <Clock className="w-3 h-3 text-blue-600" />
                              <span>{step.timerMinutes} mins timer</span>
                            </span>
                          )}
                        </div>

                        <p className={`text-sm sm:text-base text-slate-800 leading-relaxed ${
                          isStepDone ? 'line-through text-slate-400' : ''
                        }`}>
                          {step.instruction}
                        </p>

                        {/* Ingredients used in step */}
                        {step.ingredientsUsed && step.ingredientsUsed.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] text-slate-400 font-semibold uppercase">Uses:</span>
                            {step.ingredientsUsed.map((ing) => (
                              <span
                                key={ing}
                                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-medium"
                              >
                                {ing}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Chef Tip */}
                        {step.tip && !isStepDone && (
                          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2 mt-2">
                            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-amber-800">Chef's Pro-Tip: </span>
                              {step.tip}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chef Tips Card */}
          {recipe.chefTips && recipe.chefTips.length > 0 && (
            <div className="glass-panel p-6 border-slate-200 bg-white space-y-3 shadow-xs">
              <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Chef's Culinary Secrets</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {recipe.chefTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recipe Refinement Bar */}
          <div className="glass-panel p-6 border-slate-200 bg-white space-y-3 shadow-xs no-print">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-600" />
                  <span>Refine or Tweak this Recipe</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Ask Gemini 3 Flash to adjust heat, cooking method, or dietary constraints
                </p>
              </div>
            </div>

            <form onSubmit={handleRefineSubmit} className="flex gap-2">
              <input
                type="text"
                value={refinementInput}
                onChange={(e) => setRefinementInput(e.target.value)}
                placeholder='e.g. "Make it spicy", "Convert to Air Fryer", "Add fresh herbs"...'
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                disabled={isRefining}
              />
              <button
                type="submit"
                disabled={isRefining || !refinementInput.trim()}
                className="btn-primary text-xs sm:text-sm py-2 px-4 rounded-xl font-semibold shrink-0"
              >
                {isRefining ? 'Refining...' : 'Refine Recipe'}
              </button>
            </form>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['🌶️ Make it Spicy', '⏱️ Quick 15-min Version', '🥗 Make it Vegan', '♨️ Air Fryer Friendly'].map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => onRefine(sug.replace(/^[\p{Emoji}\s]+/u, ''))}
                  disabled={isRefining}
                  className="text-xs py-1 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-700 hover:border-blue-300 transition-all font-medium"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
