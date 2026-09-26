import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Recipe Header Skeleton Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-24 skeleton-shimmer rounded-full" />
            <div className="h-6 w-20 skeleton-shimmer rounded-full" />
            <div className="h-6 w-28 skeleton-shimmer rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-16 skeleton-shimmer rounded-xl" />
            <div className="h-8 w-16 skeleton-shimmer rounded-xl" />
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <div className="h-9 w-3/4 skeleton-shimmer rounded-xl" />
          <div className="h-5 w-1/2 skeleton-shimmer rounded-lg" />
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="h-4 w-full skeleton-shimmer rounded" />
          <div className="h-4 w-4/5 skeleton-shimmer rounded" />
        </div>
      </div>

      {/* 2-Column Matching Recipe Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Ingredients Checklist Skeleton */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/90 space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div className="h-5 w-28 skeleton-shimmer rounded-lg" />
            <div className="h-8 w-24 skeleton-shimmer rounded-xl" />
          </div>
          <div className="space-y-3">
            <div className="h-14 w-full skeleton-shimmer rounded-2xl" />
            <div className="h-14 w-full skeleton-shimmer rounded-2xl" />
            <div className="h-14 w-full skeleton-shimmer rounded-2xl" />
            <div className="h-14 w-full skeleton-shimmer rounded-2xl" />
          </div>
        </div>

        {/* Right: Cooking Steps Skeleton */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div className="h-5 w-36 skeleton-shimmer rounded-lg" />
            <div className="h-6 w-32 skeleton-shimmer rounded-full" />
          </div>
          <div className="space-y-3.5">
            <div className="h-28 w-full skeleton-shimmer rounded-2xl" />
            <div className="h-28 w-full skeleton-shimmer rounded-2xl" />
            <div className="h-28 w-full skeleton-shimmer rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
