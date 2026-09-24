import React from 'react';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';
import type { RecipeResult } from '../types/result';

interface SavedRecipesModalProps {
  savedRecipes: RecipeResult[];
  onSelectRecipe: (recipe: RecipeResult) => void;
  onDeleteRecipe: (id: string) => void;
  onClose: () => void;
}

export const SavedRecipesModal: React.FC<SavedRecipesModalProps> = ({
  savedRecipes,
  onSelectRecipe,
  onDeleteRecipe,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="glass-panel w-full max-w-2xl max-h-[85vh] flex flex-col border border-slate-800 bg-slate-900/95 shadow-2xl overflow-hidden rounded-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Saved Recipe Bookmarks
              </h3>
              <p className="text-xs text-slate-400">
                {savedRecipes.length} {savedRecipes.length === 1 ? 'recipe' : 'recipes'} stored locally
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recipe List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {savedRecipes.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="text-slate-300 font-medium text-sm">
                No saved recipes yet
              </p>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                Generate a recipe from your fridge ingredients and click "Bookmark Recipe" to save it for later.
              </p>
            </div>
          ) : (
            savedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="badge-tag bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs py-0.5">
                      {recipe.cuisine}
                    </span>
                    <span className="text-xs text-slate-500">
                      {recipe.difficulty} • {recipe.totalTimeMinutes} mins
                    </span>
                  </div>

                  <h4 className="font-display font-semibold text-base text-white group-hover:text-amber-300 transition-colors">
                    {recipe.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {recipe.tagline}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectRecipe(recipe);
                      onClose();
                    }}
                    className="btn-primary text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5"
                  >
                    <span>Cook Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteRecipe(recipe.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-colors"
                    title="Delete saved recipe"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
