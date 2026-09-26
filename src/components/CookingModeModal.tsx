import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, 
  CheckCircle2, Clock, ChefHat, Lightbulb, Utensils
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { RecipeResult } from '../types/result';

interface CookingModeModalProps {
  recipe: RecipeResult;
  onClose: () => void;
  checkedSteps: number[];
  onToggleStep: (stepNumber: number) => void;
  scaledServings: number;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({
  recipe,
  onClose,
  checkedSteps,
  onToggleStep,
  scaledServings,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = recipe.steps[currentStepIndex] || recipe.steps[0];
  
  // Timer state for active step
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<number | null>(null);

  // Initialize timer whenever step changes
  useEffect(() => {
    if (currentStep.timerMinutes && currentStep.timerMinutes > 0) {
      setTimeLeft(currentStep.timerMinutes * 60);
      setIsTimerRunning(false);
    } else {
      setTimeLeft(0);
      setIsTimerRunning(false);
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, [currentStepIndex, currentStep.timerMinutes]);

  // Keyboard navigation support (ArrowLeft / ArrowRight / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, checkedSteps]);

  // Timer countdown loop
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning, timeLeft]);

  // Play synthetic Web Audio chime when timer completes
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // audio context fallback
    }
  };

  const handleNext = () => {
    if (!checkedSteps.includes(currentStep.stepNumber)) {
      onToggleStep(currentStep.stepNumber);
    }

    if (currentStepIndex < recipe.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Completed all steps! Trigger celebratory confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLastStep = currentStepIndex === recipe.steps.length - 1;
  const isStepChecked = checkedSteps.includes(currentStep.stepNumber);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex flex-col overflow-y-auto animate-in fade-in duration-200">
      {/* Top HUD Bar */}
      <div className="border-b border-slate-800 bg-slate-900/90 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base sm:text-lg font-extrabold text-white leading-tight">
                Focus Kitchen HUD
              </h2>
              <span className="text-[11px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-400/30">
                {scaledServings} {scaledServings === 1 ? 'portion' : 'portions'}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-sm sm:max-w-md">
              {recipe.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
            <span>Use</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">Left</kbd>
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">Right</kbd>
            <span>keys</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
            title="Exit Focus Mode (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 container max-w-3xl mx-auto px-4 py-6 sm:py-10 flex flex-col justify-center">
        {/* Progress Bar & Step Counter */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="uppercase tracking-wider text-blue-400 font-extrabold">
              Step {currentStep.stepNumber} of {recipe.steps.length}
            </span>
            <span>
              {Math.round(((currentStepIndex + 1) / recipe.steps.length) * 100)}% Complete
            </span>
          </div>

          {/* Stepped progress bar */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStepIndex + 1) / recipe.steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Big High-Contrast Cooking Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xl space-y-6 relative overflow-hidden">
          {currentStep.shortSummary && (
            <span className="badge-tag bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-bold">
              {currentStep.shortSummary}
            </span>
          )}

          {/* Large Step Instruction */}
          <p className="font-display text-xl sm:text-3xl text-slate-900 font-semibold leading-relaxed sm:leading-normal tracking-tight">
            {currentStep.instruction}
          </p>

          {/* Ingredients Needed in this Step */}
          {currentStep.ingredientsUsed && currentStep.ingredientsUsed.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Utensils className="w-3.5 h-3.5 text-blue-600" />
                <span>Ingredients for this step:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentStep.ingredientsUsed.map((ing) => (
                  <span
                    key={ing}
                    className="text-xs sm:text-sm px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold shadow-2xs"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Chef Technique Tip */}
          {currentStep.tip && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                <span className="font-bold text-amber-800">Pro Culinary Tip: </span>
                {currentStep.tip}
              </div>
            </div>
          )}

          {/* Step Active Countdown Timer */}
          {currentStep.timerMinutes && currentStep.timerMinutes > 0 && (
            <div className="p-6 rounded-3xl bg-blue-50/70 border border-blue-200/90 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-all ${
                  isTimerRunning ? 'bg-blue-600 text-white animate-pulse' : 'bg-white text-blue-600 border border-blue-200'
                }`}>
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                    Active Step Timer ({currentStep.timerMinutes} mins)
                  </div>
                  <div className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-wider">
                    {formatTimer(timeLeft)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-md ${
                    isTimerRunning
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause Timer</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>{timeLeft === 0 ? 'Restart' : 'Start Timer'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimeLeft(currentStep.timerMinutes! * 60);
                  }}
                  className="p-3 rounded-2xl text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step Navigation Controls */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="btn-secondary py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 bg-slate-900 text-white border-slate-800 hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleStep(currentStep.stepNumber)}
            className={`py-2.5 px-4 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 ${
              isStepChecked
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{isStepChecked ? 'Completed' : 'Mark Complete'}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="btn-primary py-3 px-6 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg"
          >
            <span>{isLastStep ? 'Finish Cooking' : 'Next Step'}</span>
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
