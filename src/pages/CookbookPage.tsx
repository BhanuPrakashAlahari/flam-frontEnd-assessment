import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Search, Clock, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import type { RecipeResult } from '../types/result';

interface CookbookPageProps {
  savedRecipes: RecipeResult[];
  onSelectRecipe: (recipe: RecipeResult) => void;
  onDeleteRecipe: (id: string) => void;
}

export const CookbookPage: React.FC<CookbookPageProps> = ({
  savedRecipes,
  onSelectRecipe,
  onDeleteRecipe,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = savedRecipes.filter((r) => {
    return (
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ingredients.some((ing) => ing.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleCookNow = (recipe: RecipeResult) => {
    onSelectRecipe(recipe);
    navigate('/studio');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            My Saved Cookbook
          </h1>
          <p className="text-xs text-slate-500">
            {savedRecipes.length} {savedRecipes.length === 1 ? 'recipe' : 'recipes'} saved in local storage
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/studio')}
          className="btn-primary text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Recipe</span>
        </button>
      </div>

      {/* Search */}
      {savedRecipes.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved recipes..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-2xs"
          />
        </div>
      )}

      {/* Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="font-display text-base font-bold text-slate-900">
            {savedRecipes.length === 0 ? 'No Recipes Bookmarked Yet' : 'No Recipes Found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {savedRecipes.length === 0
              ? 'Generate a recipe in the studio and click "Save" to keep it in your personal cookbook.'
              : 'Try searching for different ingredients or recipe titles.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white border border-slate-200 hover:border-blue-300 transition-all rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="badge-tag bg-blue-50 border border-blue-200 text-blue-700 text-[11px] py-0.5">
                    {recipe.cuisine}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {recipe.totalTimeMinutes}m
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-slate-900 line-clamp-1">
                  {recipe.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {recipe.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onDeleteRecipe(recipe.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                  title="Delete recipe"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleCookNow(recipe)}
                  className="btn-primary text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 font-medium"
                >
                  <span>Cook</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
