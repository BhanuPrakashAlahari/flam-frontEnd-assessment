import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Refrigerator, Bookmark, 
  Clock, ShieldCheck, Play, Utensils, Layers 
} from 'lucide-react';

interface LandingPageProps {
  onQuickStart: (prompt: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onQuickStart }) => {
  const navigate = useNavigate();
  const [quickInput, setQuickInput] = useState('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) {
      navigate('/studio');
      return;
    }
    onQuickStart(quickInput.trim());
    navigate('/studio');
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-300 pb-12">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-6 sm:pt-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Powered by Google Gemini 3 Flash • Strict JSON Mode</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Turn What's in Your Fridge into <span className="text-blue-600">Interactive Recipes</span>
        </h1>

        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          No chatbot text walls. Type your raw ingredients and get an interactive culinary tool with scalable servings, dietary swaps, and step-by-step cooking timers.
        </p>

        {/* Hero Quick Input Box */}
        <form onSubmit={handleStart} className="max-w-xl mx-auto pt-2">
          <div className="glass-panel p-2 flex flex-col sm:flex-row items-center gap-2 border-blue-200 shadow-md">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="e.g. 3 eggs, cheddar cheese, baby spinach, garlic..."
              className="flex-1 w-full px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              className="btn-primary w-full sm:w-auto text-sm py-2.5 px-5 rounded-xl font-semibold shrink-0 shadow-sm"
            >
              <span>Synthesize Recipe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Route Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/studio')}
            className="btn-secondary text-xs sm:text-sm py-2 px-4 rounded-xl flex items-center gap-2 font-medium"
          >
            <Utensils className="w-4 h-4 text-blue-600" />
            <span>Open Recipe Studio</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/pantry')}
            className="btn-secondary text-xs sm:text-sm py-2 px-4 rounded-xl flex items-center gap-2 font-medium"
          >
            <Refrigerator className="w-4 h-4 text-emerald-600" />
            <span>Virtual Pantry Stock</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/saved')}
            className="btn-secondary text-xs sm:text-sm py-2 px-4 rounded-xl flex items-center gap-2 font-medium"
          >
            <Bookmark className="w-4 h-4 text-amber-600" />
            <span>My Cookbook</span>
          </button>
        </div>
      </section>

      {/* How It Works - 3 Step Cards */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">How It Works</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            From Raw Ingredients to Kitchen Execution
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="glass-panel p-6 border-slate-200 bg-white space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold font-mono text-sm">
              01
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">List Your Ingredients</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Enter any free-form text or pantry items. Specify your dietary goals (vegan, keto, dairy-free) and target servings.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-6 border-slate-200 bg-white space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold font-mono text-sm">
              02
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">Structured AI Synthesis</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Gemini 3 Flash returns structured JSON conforming to strict schemas, defensively validated with Zod before rendering.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-6 border-slate-200 bg-white space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 font-bold font-mono text-sm">
              03
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">Interactive Cooking</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Scale portion math, toggle smart ingredient swaps, check off steps, and launch fullscreen focus mode with active timers.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="glass-panel p-8 sm:p-10 border-slate-200 bg-white space-y-8 shadow-sm">
        <div className="max-w-2xl">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Interactive Architecture</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Built for Real-World Kitchen Needs
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every feature is engineered to provide reliability, stateful control, and defense against AI unpredictability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="font-display font-bold text-sm text-slate-900">Scalable Servings</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dynamic fraction calculation (`½ tbsp`, `1 ¾ cups`) that scales ingredients to any portion size.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-display font-bold text-sm text-slate-900">Smart Ingredient Swaps</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Toggle allergen and dietary substitutions inline with automatic ratio adjustments.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="font-display font-bold text-sm text-slate-900">Step Timers & Audio</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Integrated countdown timers with synthetic Web Audio chimes for hands-free kitchen awareness.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-display font-bold text-sm text-slate-900">Defensive Validation</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Malformed JSON, schema mismatches, and race conditions are caught safely before hitting the UI.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center space-y-4 shadow-md">
        <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
          Ready to cook something delicious?
        </h3>
        <p className="text-blue-100 text-sm max-w-lg mx-auto">
          Start with whatever is in your fridge right now. No recipes to buy, zero food waste.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate('/studio')}
            className="py-3 px-6 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-blue-700" />
            <span>Launch Recipe Studio</span>
          </button>
        </div>
      </section>
    </div>
  );
};
