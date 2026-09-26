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
    navigate('/');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 border border-slate-800 bg-slate-900/90 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Bookmark className="w-5 h-5" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                My Recipe Cookbook
              </h1>
            </div>
            <p className="text-sm text-slate-400">
              Your personal collection of AI-synthesized kitchen recipes stored locally.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-primary text-xs sm:text-sm py-2 px-4 rounded-xl flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Synthesize New Recipe</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes, ingredients, tags..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 hidden sm:block" />
          {['all', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setSelectedDifficulty(diff)}
              className={`text-xs py-1.5 px-3 rounded-lg font-medium border transition-all whitespace-nowrap ${
                selectedDifficulty === diff
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {diff === 'all' ? 'All Difficulties' : diff}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="glass-panel p-12 text-center border border-slate-800 bg-slate-900/40 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-500">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="font-display text-lg font-bold text-white">
            {savedRecipes.length === 0 ? 'No Recipes Bookmarked Yet' : 'No Recipes Found'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            {savedRecipes.length === 0
              ? 'Generate a recipe from your fridge ingredients on the Studio page and click "Bookmark Recipe" to add it here.'
              : 'Try clearing your search query or adjusting difficulty filters.'}
          </p>
          {savedRecipes.length === 0 && (
            <button
              type="button"
              onClick={() => navigate('/')}
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
              className="glass-panel border border-slate-800/80 bg-slate-900/80 hover:border-amber-500/40 transition-all rounded-2xl overflow-hidden flex flex-col group shadow-lg"
            >
              {/* Card Header Top */}
              <div className="p-5 pb-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="badge-tag bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs py-0.5">
                    🍳 {recipe.cuisine}
                  </span>
                  <span className={`badge-tag border text-xs py-0.5 ${
                    recipe.difficulty === 'Easy'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : recipe.difficulty === 'Medium'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>
                    {recipe.difficulty}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-1">
                  {recipe.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {recipe.description}
                </p>
              </div>

              {/* Stats Row */}
              <div className="px-5 py-3 border-y border-slate-800/60 bg-slate-950/40 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Total Time</span>
                  <span className="font-bold text-slate-200 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {recipe.totalTimeMinutes}m
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Servings</span>
                  <span className="font-bold text-slate-200">
                    {recipe.baseServings} portions
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Calories</span>
                  <span className="font-bold text-emerald-400">
                    {recipe.nutritionPerServing?.calories || '—'} kcal
                  </span>
                </div>
              </div>

              {/* Ingredients preview & Tags */}
              <div className="p-5 pt-3 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Main Ingredients ({recipe.ingredients.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.slice(0, 4).map((ing) => (
                      <span
                        key={ing.id}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/70 border border-slate-700/60 text-slate-300"
                      >
                        {ing.name}
                      </span>
                    ))}
                    {recipe.ingredients.length > 4 && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-800/40 text-slate-500">
                        +{recipe.ingredients.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => onDeleteRecipe(recipe.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-colors"
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
