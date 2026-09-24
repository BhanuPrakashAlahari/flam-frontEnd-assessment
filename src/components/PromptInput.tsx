import React, { useState } from 'react';
import { Sparkles, Plus, Dice5, Clock, Users, X, Flame, Shield, Filter } from 'lucide-react';
import type { GenerateOptions } from '../lib/api';

interface PromptInputProps {
  onGenerate: (prompt: string, options: GenerateOptions) => void;
  isLoading: boolean;
  initialPrompt?: string;
}

const POPULAR_INGREDIENTS = [
  '🥚 3 Eggs',
  '🧀 Cheddar Cheese',
  '🥬 Fresh Spinach',
  '🍚 Leftover Rice',
  '🍗 Chicken Breast',
  '🍝 Penne Pasta',
  '🧄 Garlic',
  '🍅 Ripe Tomatoes',
  '🧅 Red Onion',
  '🍄 Mushrooms',
  '🧈 Butter',
  '🥑 Avocado',
  '🌿 Fresh Basil',
  '🌱 Firm Tofu',
];

const SURPRISE_COMBOS = [
  '3 eggs, sharp cheddar cheese, baby spinach, 2 cloves of garlic, and a slice of sourdough bread',
  'Leftover white rice, 2 eggs, frozen peas, soy sauce, garlic, and sesame oil',
  'Penne pasta, cherry tomatoes, olive oil, garlic, fresh basil, and grated parmesan',
  'Chicken breast, broccoli florets, soy sauce, garlic, honey, and red pepper flakes',
  'Canned black beans, bell pepper, red onion, cheddar cheese, and a tortilla',
];

const DIETARY_OPTIONS = [
  'High Protein',
  'Vegetarian',
  'Gluten-Free',
  'Dairy-Free',
  'Quick (<20 mins)',
  'Low Carb',
];

export const PromptInput: React.FC<PromptInputProps> = ({
  onGenerate,
  isLoading,
  initialPrompt = '',
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [servings, setServings] = useState(2);
  const [cookingTimeMax, setCookingTimeMax] = useState<number>(30);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    onGenerate(prompt.trim(), {
      servings,
      cookingTimeMax,
      dietaryPreferences: selectedDiets,
    });
  };

  const handleAddIngredient = (ingredient: string) => {
    const cleanName = ingredient.replace(/^[\p{Emoji}\s]+/u, '').trim();
    if (prompt.trim() === '') {
      setPrompt(cleanName);
    } else if (!prompt.toLowerCase().includes(cleanName.toLowerCase())) {
      setPrompt(`${prompt.trim()}, ${cleanName}`);
    }
  };

  const handleSurpriseMe = () => {
    const randomCombo = SURPRISE_COMBOS[Math.floor(Math.random() * SURPRISE_COMBOS.length)];
    setPrompt(randomCombo);
  };

  const toggleDiet = (diet: string) => {
    setSelectedDiets((prev) =>
      prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]
    );
  };

  return (
    <div className="glass-panel p-6 sm:p-8 relative overflow-hidden border border-slate-800">
      {/* Background glow accent */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>What's in your kitchen?</span>
              <Flame className="w-6 h-6 text-amber-500" />
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              List any ingredients in your fridge, freezer, or pantry — our AI will synthesize an interactive recipe.
            </p>
          </div>

          {/* Surprise Me Quick Combo */}
          <button
            type="button"
            onClick={handleSurpriseMe}
            className="btn-secondary text-xs py-1.5 px-3 rounded-lg border-amber-500/30 text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition-colors flex items-center gap-1.5"
          >
            <Dice5 className="w-4 h-4 text-amber-400" />
            <span>Surprise Me Combo</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main Free-Form Input Box */}
          <div className="relative">
            <textarea
              id="fridge-ingredients-input"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 3 eggs, half a block of cheddar cheese, some fresh spinach, garlic, and leftover rice..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 text-sm sm:text-base resize-none transition-all"
              disabled={isLoading}
            />

            {prompt && (
              <button
                type="button"
                onClick={() => setPrompt('')}
                className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 p-1 rounded-md transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick-add popular ingredients pills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                Quick-Add Fridge Staples:
              </span>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
              >
                <Filter className="w-3.5 h-3.5 text-amber-400" />
                <span>{showFilters ? 'Hide Preferences' : 'Preferences & Servings'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {POPULAR_INGREDIENTS.map((ing) => (
                <button
                  key={ing}
                  type="button"
                  onClick={() => handleAddIngredient(ing)}
                  className="text-xs py-1 px-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 hover:border-amber-500/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all select-none"
                >
                  {ing}
                </button>
              ))}
            </div>
          </div>

          {/* Expandable Preferences (Servings, Max Time, Dietary Toggles) */}
          {showFilters && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 animate-in fade-in transition-all">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Servings */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    Target Servings:
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 4, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setServings(num)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          servings === num
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {num} {num === 1 ? 'person' : 'people'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Time */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Max Cooking Time: <span className="text-amber-400 font-bold ml-1">{cookingTimeMax} mins</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={cookingTimeMax}
                    onChange={(e) => setCookingTimeMax(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Dietary Tags */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-2 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  Dietary Preferences:
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((diet) => {
                    const isSelected = selectedDiets.includes(diet);
                    return (
                      <button
                        key={diet}
                        type="button"
                        onClick={() => toggleDiet(diet)}
                        className={`text-xs py-1 px-3 rounded-full border transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-semibold'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {isSelected ? `✓ ${diet}` : `+ ${diet}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>Free-form input converted to strict structured JSON</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="btn-primary w-full sm:w-auto px-6 py-3 text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{isLoading ? 'Synthesizing Recipe...' : 'Generate Interactive Recipe'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
