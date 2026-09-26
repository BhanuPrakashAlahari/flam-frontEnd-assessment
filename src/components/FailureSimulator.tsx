import React, { useState } from 'react';
import { 
  Bug, ChevronDown, ChevronUp, AlertOctagon, RefreshCw, 
  Zap, ShieldAlert, Clock, FastForward 
} from 'lucide-react';
import type { GenerateOptions } from '../lib/api';

interface FailureSimulatorProps {
  onSimulate: (simulationType: GenerateOptions['simulateFailure']) => void;
  onTestStaleRaceCondition: () => void;
  isLoading: boolean;
}

export const FailureSimulator: React.FC<FailureSimulatorProps> = ({
  onSimulate,
  onTestStaleRaceCondition,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200/90 bg-white rounded-2xl text-xs overflow-hidden shadow-2xs">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 flex items-center justify-between cursor-pointer select-none bg-slate-50/70 hover:bg-slate-100/70 transition-colors"
      >
        <div className="flex items-center gap-2.5 text-slate-700 font-bold">
          <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
            <Bug className="w-3.5 h-3.5" />
          </div>
          <span>Assignment Evaluator: Live AI Failure Simulation Toolbar</span>
        </div>

        <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
          <span>{isOpen ? 'Hide Test Buttons' : 'Test Failure Modes (1-Click)'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 p-4 space-y-3 bg-white animate-in fade-in duration-150">
          <p className="text-xs text-slate-500 leading-relaxed">
            Click any button below to inject a simulated upstream failure into the generation pipeline and verify how the app defensively handles it without crashing:
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            <button
              disabled={isLoading}
              onClick={() => onSimulate('malformed')}
              className="btn-secondary text-[11px] py-2 px-2.5 rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 flex flex-col items-center gap-1 text-center font-bold"
              title="Simulates broken syntax brackets"
            >
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <span>Malformed JSON</span>
            </button>

            <button
              disabled={isLoading}
              onClick={() => onSimulate('wrong_shape')}
              className="btn-secondary text-[11px] py-2 px-2.5 rounded-xl border-amber-200 text-amber-700 hover:bg-amber-50 flex flex-col items-center gap-1 text-center font-bold"
              title="Simulates valid JSON missing required recipe fields"
            >
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Wrong Shape</span>
            </button>

            <button
              disabled={isLoading}
              onClick={() => onSimulate('empty')}
              className="btn-secondary text-[11px] py-2 px-2.5 rounded-xl border-orange-200 text-orange-700 hover:bg-orange-50 flex flex-col items-center gap-1 text-center font-bold"
              title="Simulates empty string / whitespace output"
            >
              <RefreshCw className="w-4 h-4 text-orange-600" />
              <span>Empty Response</span>
            </button>

            <button
              disabled={isLoading}
              onClick={() => onSimulate('slow_timeout')}
              className="btn-secondary text-[11px] py-2 px-2.5 rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50 flex flex-col items-center gap-1 text-center font-bold"
              title="Simulates 25-second connection timeout"
            >
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Timeout (&gt;25s)</span>
            </button>

            <button
              disabled={isLoading}
              onClick={() => onSimulate('server_error')}
              className="btn-secondary text-[11px] py-2 px-2.5 rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 flex flex-col items-center gap-1 text-center font-bold"
              title="Simulates 500 internal server error"
            >
              <Zap className="w-4 h-4 text-rose-600" />
              <span>Server 500</span>
            </button>

            <button
              disabled={isLoading}
              onClick={onTestStaleRaceCondition}
              className="btn-secondary text-[11px] py-2 px-2.5 rounded-xl border-purple-200 text-purple-700 hover:bg-purple-50 flex flex-col items-center gap-1 text-center font-bold"
              title="Fires slow request then fast request to verify stale guard"
            >
              <FastForward className="w-4 h-4 text-purple-600" />
              <span>Stale Race Guard</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
