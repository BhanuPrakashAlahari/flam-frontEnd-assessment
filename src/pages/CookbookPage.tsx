import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bookmark, Search, Clock, Trash2, 
  ArrowRight, Sparkles, Filter 
} from 'lucide-react';
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
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredRecipes = savedRecipes.filter((r) => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.dietaryTags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.ingredients.some((ing) => ing.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDifficulty = 
      selectedDifficulty === 'all' || r.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesDifficulty;
  });

  const handleCookNow = (recipe: RecipeResult) => {
    onSelectRecipe(recipe);
    navigate('/studio');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 border border-slate-200 bg-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Bookmark className="w-5 h-5" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                My Recipe Cookbook
              </h1>
            </div>
            <p className="text-sm text-slate-600">
              Your personal collection of AI-synthesized kitchen recipes stored in local memory.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/studio')}
              className="btn-primary text-xs sm:text-sm py-2 px-4 rounded-xl flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Synthesize New Recipe</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 border border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes, ingredients, tags..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block" />
          {['all', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setSelectedDifficulty(diff)}
              className={`text-xs py-1.5 px-3 rounded-lg font-medium border transition-all whitespace-nowrap ${
                selectedDifficulty === diff
                  ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {diff === 'all' ? 'All Difficulties' : diff}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="glass-panel p-12 text-center border border-slate-200 bg-white space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900">
            {savedRecipes.length === 0 ? 'No Recipes Bookmarked Yet' : 'No Recipes Found'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            {savedRecipes.length === 0
              ? 'Generate a recipe from your ingredients in the Studio and click "Bookmark Recipe" to add it to your library.'
              : 'Try clearing your search query or adjusting your difficulty filters.'}
          </p>
          {savedRecipes.length === 0 && (
            <button
              type="button"
              onClick={() => navigate('/studio')}
              className="btn-primary text-xs sm:text-sm py-2 px-4 rounded-xl inline-flex items-center gap-2 mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Your First Recipe</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="glass-panel border border-slate-200 bg-white hover:border-blue-400 transition-all rounded-2xl overflow-hidden flex flex-col group shadow-xs hover:shadow-md"
            >
              {/* Card Header Top */}
              <div className="p-5 pb-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="badge-tag bg-blue-50 border border-blue-200 text-blue-700 text-xs py-0.5">
                    🍳 {recipe.cuisine}
                  </span>
                  <span className={`badge-tag border text-xs py-0.5 ${
                    recipe.difficulty === 'Easy'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : recipe.difficulty === 'Medium'
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}>
                    {recipe.difficulty}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-blue-700 transition-colors leading-snug line-clamp-1">
                  {recipe.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {recipe.description}
                </p>
              </div>

              {/* Stats Row */}
              <div className="px-5 py-3 border-y border-slate-100 bg-slate-50/70 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Time</span>
                  <span className="font-bold text-slate-800 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 text-blue-600" />
                    {recipe.totalTimeMinutes}m
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Servings</span>
                  <span className="font-bold text-slate-800">
                    {recipe.baseServings} portions
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Calories</span>
                  <span className="font-bold text-emerald-700 font-mono">
                    {recipe.nutritionPerServing?.calories || '—'} kcal
                  </span>
                </div>
              </div>

              {/* Ingredients preview & Tags */}
              <div className="p-5 pt-3 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Main Ingredients ({recipe.ingredients.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.slice(0, 4).map((ing) => (
                      <span
                        key={ing.id}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700"
                      >
                        {ing.name}
                      </span>
                    ))}
                    {recipe.ingredients.length > 4 && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">
                        +{recipe.ingredients.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onDeleteRecipe(recipe.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                    title="Delete recipe from cookbook"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCookNow(recipe)}
                    className="btn-primary text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 font-semibold"
                  >
                    <span>Cook & Scale</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
