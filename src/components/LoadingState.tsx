import React, { useEffect, useState } from 'react';
import { ChefHat, Flame, Sparkles, Utensils } from 'lucide-react';

const CHEF_THOUGHTS = [
  'Inspecting fridge & pantry ingredients...',
  'Balancing flavor profiles, textures, and aromatics...',
  'Formulating precise ingredient measurements & conversions...',
  'Generating smart dietary and pantry substitution swaps...',
  'Structuring numbered step-by-step cooking instructions with timers...',
  'Calculating macro-nutrient breakdown per serving...',
  'Validating JSON schema integrity before rendering...',
];

export const LoadingState: React.FC = () => {
  const [thoughtIndex, setThoughtIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setThoughtIndex((prev) => (prev + 1) % CHEF_THOUGHTS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Animated Chef Spotlight Banner */}
      <div className="glass-panel p-8 text-center relative overflow-hidden border border-amber-500/30">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-orange-500/10 to-amber-500/5 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Animated Icon Container */}
          <div className="relative mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 animate-pulse">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-amber-500 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            </div>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span>Crafting Your Custom Recipe</span>
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
          </h3>

          <p className="text-sm sm:text-base text-amber-300 font-medium min-h-[1.5rem] transition-all">
            {CHEF_THOUGHTS[thoughtIndex]}
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <Utensils className="w-3.5 h-3.5 text-amber-400" />
            <span>AI structured JSON output mode active (schema verified)</span>
          </div>
        </div>
      </div>

      {/* Realistic Skeleton Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Ingredients Skeleton */}
        <div className="lg:col-span-4 glass-panel p-6 space-y-4">
          <div className="h-6 w-32 skeleton-shimmer" />
          <div className="h-4 w-48 skeleton-shimmer" />
          <div className="space-y-3 pt-2">
            <div className="h-10 w-full skeleton-shimmer" />
            <div className="h-10 w-full skeleton-shimmer" />
            <div className="h-10 w-full skeleton-shimmer" />
            <div className="h-10 w-full skeleton-shimmer" />
            <div className="h-10 w-full skeleton-shimmer" />
          </div>
        </div>

        {/* Right column: Steps Skeleton */}
        <div className="lg:col-span-8 glass-panel p-6 space-y-4">
          <div className="flex justify-between">
            <div className="h-7 w-64 skeleton-shimmer" />
            <div className="h-7 w-24 skeleton-shimmer" />
          </div>
          <div className="h-4 w-5/6 skeleton-shimmer" />
          <div className="space-y-4 pt-4">
            <div className="h-20 w-full skeleton-shimmer" />
            <div className="h-20 w-full skeleton-shimmer" />
            <div className="h-20 w-full skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
};
