import React, { useState } from 'react';
import { Sparkles, X, Users, Utensils, Tag, Plus } from 'lucide-react';
import type { GenerateOptions } from '../lib/api';

interface PromptInputProps {
  onGenerate: (prompt: string, options: GenerateOptions) => void;
  isLoading: boolean;
  initialPrompt?: string;
}

const POPULAR_INGREDIENTS = [
  'Eggs',
  'Cheddar Cheese',
  'Baby Spinach',
  'Garlic',
  'Rice',
  'Pasta',
  'Chicken Breast',
  'Tomatoes',
  'Butter',
  'Olive Oil',
  'Mushrooms',
  'Onion'
];

const DIETARY_TAGS = [
  'High Protein',
  'Quick (<15m)',
  'Vegetarian',
  'Dairy-Free',
  'Low Carb'
];

export const PromptInput: React.FC<PromptInputProps> = ({
  onGenerate,
  isLoading,
  initialPrompt = '',
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [servings, setServings] = useState(2);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    let finalPrompt = prompt.trim();
    if (selectedDietary.length > 0) {
      finalPrompt += ` [Preferences: ${selectedDietary.join(', ')}]`;
    }

    onGenerate(finalPrompt, {
      servings,
    });
  };

  const handleAddIngredient = (ingredient: string) => {
    if (prompt.trim() === '') {
      setPrompt(ingredient);
    } else if (!prompt.toLowerCase().includes(ingredient.toLowerCase())) {
      setPrompt(`${prompt.trim()}, ${ingredient}`);
    }
  };

  const toggleDietaryTag = (tag: string) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-blue-600" />
            <span>Fridge & Pantry Studio</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter your raw kitchen ingredients to synthesize a structured, interactive recipe.
          </p>
        </div>

        {/* Portions Stepper */}
        <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl self-start sm:self-auto">
          <Users className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-semibold text-slate-700">Portions:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 4, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setServings(num)}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                  servings === num
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {num}x
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Textarea */}
        <div className="relative">
          <textarea
            id="fridge-ingredients-input"
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. 3 eggs, cheddar cheese, baby spinach, garlic, leftover rice..."
            className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 text-sm sm:text-base resize-none transition-all shadow-2xs"
            disabled={isLoading}
          />

          {prompt && (
            <button
              type="button"
              onClick={() => setPrompt('')}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-700 bg-white/80 hover:bg-slate-100 p-1 rounded-lg transition-colors border border-slate-200"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Add Staple Pills */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Quick Add:
            </span>
            {POPULAR_INGREDIENTS.map((ing) => (
              <button
                key={ing}
                type="button"
                onClick={() => handleAddIngredient(ing)}
                className="text-xs py-1 px-2.5 rounded-xl bg-slate-100/80 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 transition-all font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-slate-400" />
                <span>{ing}</span>
              </button>
            ))}
          </div>

          {/* Dietary Filters */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>Filters:</span>
            </span>
            {DIETARY_TAGS.map((tag) => {
              const isSelected = selectedDietary.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleDietaryTag(tag)}
                  className={`text-xs py-1 px-2.5 rounded-xl border transition-all font-semibold ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-100">
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="btn-primary w-full sm:w-auto px-6 py-3 text-sm font-bold rounded-2xl flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Synthesizing with Gemini AI...' : 'Generate Interactive Recipe'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
