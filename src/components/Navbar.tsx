import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ChefHat, Bookmark, Sparkles, CheckCircle2, AlertTriangle, 
  Refrigerator, Bug, Info, Menu, X, Home 
} from 'lucide-react';

interface NavbarProps {
  onNewRecipe: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewRecipe,
  savedCount,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
            provider: data.provider || 'Gemini 3 Flash',
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
          provider: 'Server Offline (:3001)',
          hasApiKey: false,
        });
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { path: '/studio', label: 'Recipe Studio', icon: <ChefHat className="w-4 h-4" /> },
    { path: '/cookbook', label: 'Cookbook', icon: <Bookmark className="w-4 h-4" />, count: savedCount },
    { path: '/pantry', label: 'Pantry Stock', icon: <Refrigerator className="w-4 h-4" /> },
    { path: '/diagnostics', label: 'Diagnostics', icon: <Bug className="w-4 h-4" /> },
    { path: '/about', label: 'Architecture', icon: <Info className="w-4 h-4" /> },
  ];

  const handleBrandClick = () => {
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleNewRecipeClick = () => {
    onNewRecipe();
    navigate('/studio');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div 
          onClick={handleBrandClick}
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-sm shadow-blue-500/20">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-lg tracking-tight text-slate-900">
                CulinaryCraft
              </span>
              <span className="badge-tag bg-blue-50 border border-blue-200 text-blue-700 text-[10px] py-0 font-bold">
                AI Studio
              </span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
                {link.count !== undefined && link.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                    {link.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Server Status & Action CTA */}
        <div className="flex items-center gap-2.5">
          {/* Server / AI Status Pill */}
          <div 
            className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              serverStatus.online
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
            title={serverStatus.provider}
          >
            {serverStatus.online ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            )}
            <span className="truncate max-w-[170px] font-medium">
              {serverStatus.provider}
            </span>
          </div>

          {/* New Recipe Action */}
          <button
            onClick={handleNewRecipeClick}
            className="btn-primary text-xs sm:text-sm py-1.5 px-3.5 rounded-xl flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">New Recipe</span>
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-2 animate-in fade-in shadow-lg">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                {link.count !== undefined && link.count > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                    {link.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
