import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, 
  CheckCircle2, Clock, ChefHat, Lightbulb 
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
      // audio context not allowed without interaction
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
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col overflow-y-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-white leading-tight">
              Focus Cooking Mode
            </h2>
            <p className="text-xs text-slate-400">
              {recipe.title} • {scaledServings} {scaledServings === 1 ? 'serving' : 'servings'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors"
          title="Exit Focus Mode"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 container max-w-4xl mx-auto px-4 py-8 flex flex-col justify-center">
        {/* Progress Bar & Step Counter */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span className="uppercase tracking-wider text-amber-400">
              Step {currentStep.stepNumber} of {recipe.steps.length}
            </span>
            <span>
              {Math.round(((currentStepIndex + 1) / recipe.steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStepIndex + 1) / recipe.steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Big Step Card */}
        <div className="glass-panel p-6 sm:p-10 border border-amber-500/20 bg-slate-900/90 shadow-2xl relative overflow-hidden">
          {currentStep.shortSummary && (
            <span className="badge-tag bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold mb-3">
              {currentStep.shortSummary}
            </span>
          )}

          {/* Large Step Instruction */}
          <p className="font-display text-xl sm:text-3xl text-slate-100 font-medium leading-relaxed sm:leading-normal mt-2">
            {currentStep.instruction}
          </p>

          {/* Ingredients Needed in this Step */}
          {currentStep.ingredientsUsed && currentStep.ingredientsUsed.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Ingredients used now:
              </span>
              {currentStep.ingredientsUsed.map((ing) => (
                <span
                  key={ing}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-amber-300 font-medium"
                >
                  {ing}
                </span>
              ))}
            </div>
          )}

          {/* Chef Tip if available */}
          {currentStep.tip && (
            <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-200">
                <span className="font-bold text-amber-300">Chef's Technique: </span>
                {currentStep.tip}
              </div>
            </div>
          )}

          {/* Step Active Countdown Timer */}
          {currentStep.timerMinutes && currentStep.timerMinutes > 0 && (
            <div className="mt-8 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Clock className="w-7 h-7 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Step Timer ({currentStep.timerMinutes} mins)
                  </div>
                  <div className="font-mono text-3xl sm:text-4xl font-bold text-white tracking-wider">
                    {formatTimer(timeLeft)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
                    isTimerRunning
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                      : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
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
                  className="p-2.5 rounded-xl text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step Navigation Controls */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="btn-secondary py-3 px-5 rounded-xl text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleStep(currentStep.stepNumber)}
            className={`py-2 px-4 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
              isStepChecked
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{isStepChecked ? 'Marked Complete' : 'Mark Step Complete'}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="btn-primary py-3 px-6 rounded-xl text-sm font-semibold flex items-center gap-2"
          >
            <span>{isLastStep ? 'Finish Cooking 🎉' : 'Next Step'}</span>
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
