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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex flex-col overflow-y-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 leading-tight">
              Focus Cooking Mode
            </h2>
            <p className="text-xs text-slate-500">
              {recipe.title} • {scaledServings} {scaledServings === 1 ? 'portion' : 'portions'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
          title="Exit Focus Mode"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 container max-w-3xl mx-auto px-4 py-8 flex flex-col justify-center">
        {/* Progress Bar & Step Counter */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="uppercase tracking-wider text-blue-600 font-bold">
              Step {currentStep.stepNumber} of {recipe.steps.length}
            </span>
            <span>
              {Math.round(((currentStepIndex + 1) / recipe.steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStepIndex + 1) / recipe.steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Big Step Card */}
        <div className="glass-panel p-6 sm:p-10 border-slate-200 bg-white shadow-xl relative overflow-hidden space-y-4">
          {currentStep.shortSummary && (
            <span className="badge-tag bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold">
              {currentStep.shortSummary}
            </span>
          )}

          {/* Large Step Instruction */}
          <p className="font-display text-xl sm:text-3xl text-slate-900 font-medium leading-relaxed sm:leading-normal">
            {currentStep.instruction}
          </p>

          {/* Ingredients Needed in this Step */}
          {currentStep.ingredientsUsed && currentStep.ingredientsUsed.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Ingredients used now:
              </span>
              {currentStep.ingredientsUsed.map((ing) => (
                <span
                  key={ing}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-medium"
                >
                  {ing}
                </span>
              ))}
            </div>
          )}

          {/* Chef Tip */}
          {currentStep.tip && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-900">
                <span className="font-bold text-amber-800">Chef's Technique: </span>
                {currentStep.tip}
              </div>
            </div>
          )}

          {/* Step Active Countdown Timer */}
          {currentStep.timerMinutes && currentStep.timerMinutes > 0 && (
            <div className="mt-6 p-6 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    Step Timer ({currentStep.timerMinutes} mins)
                  </div>
                  <div className="font-mono text-3xl sm:text-4xl font-bold text-slate-900 tracking-wider">
                    {formatTimer(timeLeft)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-xs ${
                    isTimerRunning
                      ? 'bg-amber-600 text-white hover:bg-amber-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
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
                  className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 bg-white border border-slate-200 transition-colors shadow-xs"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step Navigation Controls */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="btn-secondary py-3 px-5 rounded-xl text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleStep(currentStep.stepNumber)}
            className={`py-2 px-4 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
              isStepChecked
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isStepChecked ? 'Marked Complete' : 'Mark Complete'}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="btn-primary py-3 px-6 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm"
          >
            <span>{isLastStep ? 'Finish Cooking 🎉' : 'Next Step'}</span>
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
