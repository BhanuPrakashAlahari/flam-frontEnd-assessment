import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Utensils } from 'lucide-react';

interface LandingPageProps {
  onQuickStart: (prompt: string) => void;
}

const SAMPLE_COMBOS = [
  { label: 'Classic Breakfast', items: '3 eggs, cheddar cheese, baby spinach, butter' },
  { label: 'Italian Quick Pantry', items: 'Spaghetti, garlic, olive oil, parmesan, red pepper flakes' },
  { label: 'High-Protein Bowl', items: 'Chicken breast, black beans, tomatoes, cilantro, rice' },
  { label: 'Vegetarian Stir-Fry', items: 'Tofu, mushrooms, soy sauce, broccoli, sesame oil' },
];

const MARQUEE_PLACEHOLDERS = [
  'Create a simple recipe with 3 eggs, cheddar cheese, baby spinach...',
  'Create a quick dinner with pasta, garlic, olive oil, parmesan...',
  'Create a high-protein meal with chicken breast, rice, tomatoes...',
  'Create a vegetarian skillet with tofu, mushrooms, soy sauce, broccoli...',
  'Create a 15-minute recipe with whatever is in your fridge...',
];

export const LandingPage: React.FC<LandingPageProps> = ({ onQuickStart }) => {
  const navigate = useNavigate();
  const [quickInput, setQuickInput] = useState('');

  // Dynamic marquee / typewriter placeholder animation
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (quickInput) return; // paused when user types

    const currentFullText = MARQUEE_PLACEHOLDERS[placeholderIndex];
    const typingSpeed = isDeleting ? 30 : 60;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentFullText.length) {
          setDisplayedPlaceholder(currentFullText.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (charIndex > 0) {
          setDisplayedPlaceholder(currentFullText.slice(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        } else {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % MARQUEE_PLACEHOLDERS.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, placeholderIndex, quickInput]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const promptToSend = quickInput.trim();
    if (!promptToSend) {
      navigate('/studio');
      return;
    }
    onQuickStart(promptToSend);
    navigate('/studio');
  };

  const handleSelectCombo = (comboItems: string) => {
    onQuickStart(comboItems);
    navigate('/studio');
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4">


        {/* Hero Title */}
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-3xl mx-auto">
          Turn your random fridge ingredients into <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">interactive recipes</span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Type whatever ingredients you have in your kitchen. Get dynamic serving scaling, smart allergen swaps, and hands-free step countdown timers — <strong>zero chatbot text walls</strong>.
        </p>

        {/* Interactive Search & Prompt Launcher with Animated Marquee Placeholder */}
        <form onSubmit={handleStart} className="max-w-2xl mx-auto pt-2">
          <div className="bg-white p-2.5 rounded-2xl border border-slate-300 shadow-md flex flex-col sm:flex-row items-center gap-2 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
            <div className="flex items-center gap-2.5 w-full px-3 py-1.5">
              <Utensils className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder={displayedPlaceholder || 'Create a simple recipe with 3 eggs, cheddar cheese, baby spinach...'}
                className="flex-1 text-sm sm:text-base text-slate-900 placeholder:text-slate-700 placeholder:font-normal focus:outline-none bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full sm:w-auto text-sm py-3 px-6 rounded-xl font-semibold shrink-0"
            >
              <span>Create Recipe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Popular Ingredient Combos */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Or try one of these curated pantry combos:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {SAMPLE_COMBOS.map((combo) => (
              <button
                key={combo.label}
                type="button"
                onClick={() => handleSelectCombo(combo.items)}
                className="group px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50/70 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 text-xs font-medium transition-all shadow-2xs flex items-center gap-1.5"
              >
                <span className="font-semibold text-slate-900 group-hover:text-blue-700">{combo.label}:</span>
                <span className="text-slate-500 text-[11px] truncate max-w-[180px]">{combo.items}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
