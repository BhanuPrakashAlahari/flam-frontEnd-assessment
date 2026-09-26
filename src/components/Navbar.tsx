import React from 'react';
import { ChefHat, Bookmark, ChevronRight, Refrigerator } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onNewRecipe: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onNewRecipe, savedCount }) => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-4 max-w-6xl h-16 grid grid-cols-3 items-center">
        {/* Brand (Navigates to Home) */}
        <div className="flex items-center justify-start">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 flex items-center justify-center text-white">
              <ChefHat className="w-5 h-5" />
            </div>
            <span className="font-display font-extrabold text-slate-900 text-lg tracking-tight group-hover:text-blue-600 transition-colors">
              CookMate
            </span>
          </Link>
        </div>

        {/* Center Nav Links */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <Link
            to="/studio"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${location.pathname === '/studio'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            Studio
          </Link>

          <Link
            to="/cookbook"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${location.pathname === '/cookbook'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Cookbook</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                {savedCount}
              </span>
            )}
          </Link>

          <Link
            to="/pantry"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${location.pathname === '/pantry'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            <Refrigerator className="w-3.5 h-3.5" />
            <span>Pantry</span>
          </Link>
        </div>

        {/* Right Get Started */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onNewRecipe}
            className="btn-primary text-xs py-1.5 px-3.5 rounded-xl font-semibold flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
