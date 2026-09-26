import React, { useState } from 'react';
import { Sparkles, X, Users } from 'lucide-react';
import type { GenerateOptions } from '../lib/api';

interface PromptInputProps {
  onGenerate: (prompt: string, options: GenerateOptions) => void;
  isLoading: boolean;
  initialPrompt?: string;
}

const POPULAR_INGREDIENTS = [
  'Eggs',
  'Cheese',
  'Spinach',
  'Garlic',
  'Rice',
  'Pasta',
  'Chicken',
  'Tomatoes',
  'Butter',
  'Olive Oil',
];

export const PromptInput: React.FC<PromptInputProps> = ({
  onGenerate,
  isLoading,
  initialPrompt = '',
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [servings, setServings] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    onGenerate(prompt.trim(), {
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

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            What ingredients do you have?
          </h2>
          <p className="text-xs text-slate-500">
            List whatever is in your fridge or pantry to synthesize an interactive recipe.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            id="fridge-ingredients-input"
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. 3 eggs, cheddar cheese, baby spinach, garlic..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 text-sm resize-none transition-all"
            disabled={isLoading}
          />

          {prompt && (
            <button
              type="button"
              onClick={() => setPrompt('')}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-md"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Staple Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Quick Add:
          </span>
          {POPULAR_INGREDIENTS.map((ing) => (
            <button
              key={ing}
              type="button"
              onClick={() => handleAddIngredient(ing)}
              className="text-xs py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-all font-medium"
            >
              + {ing}
            </button>
          ))}
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Servings stepper */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Target Portions:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {[1, 2, 4, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setServings(num)}
                  className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                    servings === num
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {num}x
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="btn-primary w-full sm:w-auto px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Synthesizing...' : 'Generate Recipe'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
