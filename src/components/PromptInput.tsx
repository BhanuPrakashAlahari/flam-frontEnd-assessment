import React, { useState } from 'react';
import { Sparkles, Plus, Clock, Users, X, Flame, Shield, Filter, Dice5 } from 'lucide-react';
import type { GenerateOptions } from '../lib/api';

interface PromptInputProps {
  onGenerate: (prompt: string, options: GenerateOptions) => void;
  isLoading: boolean;
  initialPrompt?: string;
}

const POPULAR_INGREDIENTS = [
  '🥚 Eggs',
  '🧀 Cheese',
  '🥬 Spinach',
  '🍚 Rice',
  '🍗 Chicken',
  '🍝 Pasta',
  '🧄 Garlic',
  '🍅 Tomatoes',
  '🧅 Onion',
  '🍄 Mushrooms',
  '🧈 Butter',
  '🥑 Avocado',
  '🌿 Fresh Basil',
  '🌱 Tofu',
];

const SURPRISE_COMBOS = [
  '3 eggs, cheddar cheese, baby spinach, garlic',
  'Penne pasta, cherry tomatoes, olive oil, garlic, fresh basil, parmesan',
  'Leftover rice, 2 eggs, soy sauce, garlic, green onions',
  'Chicken breast, broccoli florets, garlic, olive oil, lemon',
  'Black beans, bell pepper, red onion, cheddar, avocado',
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
    <div className="glass-panel p-6 sm:p-8 bg-white border border-slate-200 shadow-xs space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>What's in your kitchen today?</span>
            <Flame className="w-5 h-5 text-blue-600" />
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            List whatever you have in your fridge or pantry — our Gemini AI model will synthesize an interactive recipe.
          </p>
        </div>

        {/* Surprise Me Combo */}
        <button
          type="button"
          onClick={handleSurpriseMe}
          className="btn-secondary text-xs py-1.5 px-3 rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors flex items-center gap-1.5 font-medium"
        >
          <Dice5 className="w-4 h-4 text-blue-600" />
          <span>Surprise Me Idea</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Free-form Input Area */}
        <div className="relative">
          <textarea
            id="fridge-ingredients-input"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your ingredients here... (e.g. 3 eggs, half a block of cheddar, some spinach, and leftover rice)"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 text-sm sm:text-base resize-none transition-all shadow-xs"
            disabled={isLoading}
          />

          {prompt && (
            <button
              type="button"
              onClick={() => setPrompt('')}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Add Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              Quick-Add Kitchen Staples:
            </span>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{showFilters ? 'Hide Preferences' : 'Preferences & Portions'}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {POPULAR_INGREDIENTS.map((ing) => (
              <button
                key={ing}
                type="button"
                onClick={() => handleAddIngredient(ing)}
                className="text-xs py-1 px-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-700 hover:text-blue-700 transition-all select-none font-medium"
              >
                {ing}
              </button>
            ))}
          </div>
        </div>

        {/* Expandable Preferences (Servings, Time, Diets) */}
        {showFilters && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in transition-all">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Servings */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
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
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {num} {num === 1 ? 'portion' : 'portions'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Cooking Time */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Max Cooking Time: <span className="text-blue-700 font-bold ml-1">{cookingTimeMax} mins</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={cookingTimeMax}
                  onChange={(e) => setCookingTimeMax(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Dietary Tags */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
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
                      className={`text-xs py-1 px-3 rounded-full border transition-all font-medium ${
                        isSelected
                          ? 'bg-blue-100 border-blue-300 text-blue-800 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
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
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Structured JSON output schema validation active</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="btn-primary w-full sm:w-auto px-6 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>{isLoading ? 'Synthesizing Recipe...' : 'Synthesize Recipe with AI'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
