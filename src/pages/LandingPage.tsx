import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, RefreshCw, Clock, Layers } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto py-10 sm:py-16 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Google Gemini 3 Flash • Interactive Mode</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-2xl mx-auto">
          Turn your fridge ingredients into <span className="text-blue-600">interactive recipes</span>
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto">
          Enter what you have at home. Get portion scaling, smart ingredient swaps, and step timers — no chatbot text walls.
        </p>

        {/* Clean Input Box */}
        <form onSubmit={handleStart} className="max-w-xl mx-auto pt-2">
          <div className="bg-white p-2 rounded-2xl border border-slate-300 shadow-sm flex flex-col sm:flex-row items-center gap-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="e.g. 3 eggs, spinach, garlic, cheese..."
              className="flex-1 w-full px-3 py-2 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              className="btn-primary w-full sm:w-auto text-sm py-2.5 px-5 rounded-xl font-semibold shrink-0"
            >
              <span>Create Recipe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-500">
          <span>Try:</span>
          {['Eggs, spinach & cheese', 'Pasta, garlic & olive oil', 'Rice, eggs & soy sauce'].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                onQuickStart(sample);
                navigate('/studio');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-all"
            >
              {sample}
            </button>
          ))}
        </div>
      </section>

      {/* 3 Simple Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-slate-900 text-sm">Scalable Portions</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Adjust serving sizes on the fly with automatic ingredient math and clean fraction calculations.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <RefreshCw className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-slate-900 text-sm">Smart Ingredient Swaps</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Toggle allergen and dietary substitutions inline without recalculating recipes manually.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-slate-900 text-sm">Step Countdown Timers</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Check off steps and run built-in timers with audio notifications in focus cooking mode.
          </p>
        </div>
      </section>
    </div>
  );
};
