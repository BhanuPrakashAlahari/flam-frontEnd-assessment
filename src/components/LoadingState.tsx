import React from 'react';
import { ChefHat, Sparkles } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto text-white shadow-xs">
          <ChefHat className="w-6 h-6 animate-pulse" />
        </div>

        <h3 className="font-display text-lg font-bold text-slate-900 flex items-center justify-center gap-2">
          <span>Synthesizing Recipe with Gemini AI</span>
          <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
        </h3>

        <p className="text-xs text-slate-500">
          Validating strict JSON schema and calculating scalable measurements...
        </p>
      </div>

      {/* Simple Clean Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="h-4 w-28 skeleton-shimmer" />
          <div className="h-10 w-full skeleton-shimmer" />
          <div className="h-10 w-full skeleton-shimmer" />
          <div className="h-10 w-full skeleton-shimmer" />
        </div>

        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="h-5 w-48 skeleton-shimmer" />
          <div className="h-16 w-full skeleton-shimmer" />
          <div className="h-16 w-full skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
};
