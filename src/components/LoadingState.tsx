import React, { useEffect, useState } from 'react';
import { ChefHat, Sparkles, Utensils, Flame } from 'lucide-react';

const CHEF_THOUGHTS = [
  'Querying Gemini 3 Flash model...',
  'Analyzing ingredient compatibility and flavor balances...',
  'Formulating precise measurements and conversions...',
  'Generating smart dietary substitutions and allergen swaps...',
  'Structuring numbered step-by-step instructions with timers...',
  'Calculating macro-nutrient breakdown per serving...',
  'Validating strict JSON schema with Zod before rendering...',
];

export const LoadingState: React.FC = () => {
  const [thoughtIndex, setThoughtIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setThoughtIndex((prev) => (prev + 1) % CHEF_THOUGHTS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Animated Banner */}
      <div className="glass-panel p-8 text-center relative overflow-hidden border-blue-200 bg-white shadow-sm">
        <div className="relative z-10 flex flex-col items-center space-y-3">
          {/* Animated Icon Container */}
          <div className="relative mb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/25">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
              <Flame className="w-3 h-3 text-blue-600 animate-bounce" />
            </div>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>Synthesizing Your Custom Recipe</span>
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
          </h3>

          <p className="text-sm sm:text-base text-blue-700 font-semibold min-h-[1.5rem] transition-all">
            {CHEF_THOUGHTS[thoughtIndex]}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Utensils className="w-3.5 h-3.5 text-blue-600" />
            <span>AI JSON structured mode active • Schema verified</span>
          </div>
        </div>
      </div>

      {/* Realistic Skeleton Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass-panel p-6 space-y-4 bg-white border-slate-200">
          <div className="h-5 w-32 skeleton-shimmer" />
          <div className="h-4 w-48 skeleton-shimmer" />
          <div className="space-y-3 pt-2">
            <div className="h-12 w-full skeleton-shimmer" />
            <div className="h-12 w-full skeleton-shimmer" />
            <div className="h-12 w-full skeleton-shimmer" />
          </div>
        </div>

        <div className="lg:col-span-7 glass-panel p-6 space-y-4 bg-white border-slate-200">
          <div className="flex justify-between">
            <div className="h-6 w-60 skeleton-shimmer" />
            <div className="h-6 w-24 skeleton-shimmer" />
          </div>
          <div className="h-4 w-5/6 skeleton-shimmer" />
          <div className="space-y-4 pt-4">
            <div className="h-24 w-full skeleton-shimmer" />
            <div className="h-24 w-full skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
};
