"use client";

import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  ChefHat, Bookmark, 
  Refrigerator, Menu, X, ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationMenuProps {
  onNewRecipe?: () => void;
  savedCount?: number;
}

export function AnimatedNavFramer({ onNewRecipe, savedCount = 0 }: NavigationMenuProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { path: '/studio', label: 'Studio', icon: <ChefHat className="w-4 h-4" /> },
    { path: '/cookbook', label: 'Cookbook', icon: <Bookmark className="w-4 h-4" />, count: savedCount },
    { path: '/pantry', label: 'Pantry', icon: <Refrigerator className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed top-3 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        className={cn(
          "pointer-events-auto grid grid-cols-3 items-center w-full max-w-6xl h-14 px-4 sm:px-6",
          "rounded-2xl border border-slate-200/90 bg-white/80 backdrop-blur-md shadow-xs transition-all"
        )}
      >
        {/* Left: Brand Logo & Title (Navigates to Home) */}
        <div className="flex items-center justify-start">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <ChefHat className="w-5 h-5" />
            </div>
            <span className="font-display font-extrabold text-slate-900 text-base tracking-tight group-hover:text-blue-600 transition-colors">
              CookMate
            </span>
          </Link>
        </div>
        
        {/* Center: Clean Centered Route Links */}
        <div className="hidden md:flex items-center justify-center gap-1.5 sm:gap-2">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                    isActive ? "bg-white text-blue-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: Get Started Button with Chevron Right */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              if (onNewRecipe) onNewRecipe();
              navigate('/studio');
              setMobileMenuOpen(false);
            }}
            className="btn-primary text-xs py-1.5 px-3.5 rounded-xl font-semibold flex items-center gap-1.5 shrink-0"
          >
            <span>Get Started</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto absolute top-18 inset-x-4 max-w-6xl mx-auto rounded-2xl border border-slate-200 bg-white p-3 space-y-1 shadow-md md:hidden animate-in fade-in duration-150">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "p-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-colors",
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-bold",
                    isActive ? "bg-white text-blue-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
