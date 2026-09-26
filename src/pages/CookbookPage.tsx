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
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Bookmark className="w-6 h-6 text-blue-600 fill-blue-600" />
            <span>My Saved Cookbook</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {savedRecipes.length} {savedRecipes.length === 1 ? 'recipe' : 'recipes'} stored locally in your browser
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/studio')}
          className="btn-primary text-xs sm:text-sm py-2.5 px-5 rounded-2xl flex items-center gap-2 font-bold self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Studio Recipe</span>
        </button>
      </div>

      {/* Search Bar */}
      {savedRecipes.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved recipes by title, cuisine, or ingredient..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-2xs"
          />
        </div>
      )}

      {/* Recipe Cards Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="bg-white p-12 sm:p-16 text-center rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600 shadow-2xs">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900">
            {savedRecipes.length === 0 ? 'Your Cookbook is Empty' : 'No Recipes Found'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {savedRecipes.length === 0
              ? 'Generate an interactive recipe in the Studio and click "Save" to build your personalized kitchen collection.'
              : 'Try searching for different keywords or clear your query.'}
          </p>
          {savedRecipes.length === 0 && (
            <button
              type="button"
              onClick={() => navigate('/studio')}
              className="btn-primary text-xs sm:text-sm py-2.5 px-6 rounded-2xl font-bold inline-flex items-center gap-2"
            >
              <span>Go to Recipe Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white border border-slate-200 hover:border-blue-300 transition-all rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="badge-tag bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold">
                    {recipe.cuisine}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1 font-semibold text-xs">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{recipe.totalTimeMinutes}m</span>
                  </span>
                </div>

                <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {recipe.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {recipe.description}
                </p>

                <div className="pt-1 text-[11px] text-slate-400 font-medium">
                  {recipe.ingredients.length} ingredients • {recipe.steps.length} steps
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onDeleteRecipe(recipe.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Remove from cookbook"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleCookNow(recipe)}
                  className="btn-primary text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 font-bold"
                >
                  <span>Cook Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
