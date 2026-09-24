import React, { useEffect, useState } from 'react';
import { ChefHat, Bookmark, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  onNewRecipe: () => void;
  onOpenSaved: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewRecipe,
  onOpenSaved,
  savedCount,
}) => {
  const [serverStatus, setServerStatus] = useState<{
    online: boolean;
    provider: string;
    hasApiKey: boolean;
  }>({
    online: false,
    provider: 'Checking...',
    hasApiKey: false,
  });

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          setServerStatus({
            online: true,
            provider: data.provider || 'AI Gateway',
            hasApiKey: !!data.hasApiKey,
          });
        } else {
          setServerStatus({
            online: false,
            provider: 'Server Offline',
            hasApiKey: false,
          });
        }
      } catch {
        setServerStatus({
          online: false,
          provider: 'Server Offline (Check port 3001)',
          hasApiKey: false,
        });
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={onNewRecipe}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                CulinaryCraft
              </span>
              <span className="badge-tag bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs py-0.5">
                AI Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal hidden sm:block">
              Fridge-to-Recipe Structured Engine
            </p>
          </div>
        </div>

        {/* Status Indicator & Actions */}
        <div className="flex items-center gap-3">
          {/* Server / AI Status Pill */}
          <div 
            className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              serverStatus.online
                ? serverStatus.hasApiKey
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
            title={serverStatus.provider}
          >
            {serverStatus.online ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            <span className="truncate max-w-[180px]">
              {serverStatus.provider}
            </span>
          </div>

          {/* Saved Recipes Button */}
          <button
            onClick={onOpenSaved}
            className="btn-secondary text-sm py-1.5 px-3 rounded-lg flex items-center gap-2"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Saved Recipes</span>
            {savedCount > 0 && (
              <span className="bg-amber-500 text-slate-950 text-xs font-bold px-1.5 py-0.2 rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          {/* New Recipe Button */}
          <button
            onClick={onNewRecipe}
            className="btn-primary text-sm py-1.5 px-3.5 rounded-lg flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">New Recipe</span>
          </button>
        </div>
      </div>
    </header>
  );
};
