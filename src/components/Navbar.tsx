import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ChefHat, Bookmark, Sparkles, CheckCircle2, AlertTriangle, 
  Refrigerator, Bug, Info, Menu, X 
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

  const navLinks = [
    { path: '/', label: 'Studio', icon: <ChefHat className="w-4 h-4" /> },
    { path: '/saved', label: 'Cookbook', icon: <Bookmark className="w-4 h-4" />, count: savedCount },
    { path: '/pantry', label: 'Pantry Stock', icon: <Refrigerator className="w-4 h-4" /> },
    { path: '/diagnostics', label: 'Diagnostics', icon: <Bug className="w-4 h-4" /> },
    { path: '/about', label: 'Architecture', icon: <Info className="w-4 h-4" /> },
  ];

  const handleBrandClick = () => {
    onNewRecipe();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div 
          onClick={handleBrandClick}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                CulinaryCraft
              </span>
              <span className="badge-tag bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] py-0.5 font-bold">
                AI Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal hidden sm:block">
              Interactive Fridge-to-Recipe Engine
            </p>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 border border-slate-800 p-1 rounded-xl">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-sm shadow-orange-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
                {link.count !== undefined && link.count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
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
                ? serverStatus.hasApiKey
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
            title={serverStatus.provider}
          >
            {serverStatus.online ? (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            )}
            <span className="truncate max-w-[150px]">
              {serverStatus.provider}
            </span>
          </div>

          {/* New Recipe CTA */}
          <button
            onClick={handleBrandClick}
            className="btn-primary text-xs sm:text-sm py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">New Recipe</span>
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-2 animate-in fade-in">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                {link.count !== undefined && link.count > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-950 text-amber-400">
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
