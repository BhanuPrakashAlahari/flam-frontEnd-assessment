import React, { useState } from 'react';
import { Bug, ChevronDown, ChevronUp, AlertOctagon, RefreshCw, Zap, ShieldAlert, Clock, FastForward } from 'lucide-react';
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
    <div className="border border-slate-200 bg-slate-50/60 rounded-xl text-xs overflow-hidden">
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Bug className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-700">Assignment Rubric: AI Failure Simulator</span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          <span>{isOpen ? 'Close' : 'Open Test Harness'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white p-3 space-y-2">
          <p className="text-[11px] text-slate-500">
            Simulate model failure modes to verify defensive catch handling:
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              disabled={isLoading}
              onClick={() => onSimulate('malformed')}
              className="btn-secondary text-[11px] py-1 px-2 rounded-lg border-rose-200 text-rose-700 hover:bg-rose-50 flex items-center gap-1"
            >
              <AlertOctagon className="w-3 h-3 text-rose-600" />
              <span>Malformed JSON</span>
            </button>

            <button
              disabled={isLoading}
              onClick={() => onSimulate('wrong_shape')}
              className="btn-secondary text-[11px] py-1 px-2 rounded-lg border-amber-200 text-amber-700 hover:bg-amber-50 flex items-center gap-1"
            >
              <ShieldAlert className="w-3 h-3 text-amber-600" />
              <span>Wrong Shape</span>
            </button>

            <button
              disabled={isLoading}
              onClick={() => onSimulate('empty')}
              className="btn-secondary text-[11px] py-1 px-2 rounded-lg border-orange-200 text-orange-700 hover:bg-orange-50 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3 text-orange-600" />
              <span>Empty Response</span>
            </button>

            <button
              disabled={isLoading}
              onClick={() => onSimulate('slow_timeout')}
              className="btn-secondary text-[11px] py-1 px-2 rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50 flex items-center gap-1"
            >
              <Clock className="w-3 h-3 text-blue-600" />
              <span>Timeout (&gt;25s)</span>
            </button>

            <button
              disabled={isLoading}
              onClick={() => onSimulate('server_error')}
              className="btn-secondary text-[11px] py-1 px-2 rounded-lg border-rose-200 text-rose-700 hover:bg-rose-50 flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-rose-600" />
              <span>Server 500</span>
            </button>

            <button
              disabled={isLoading}
              onClick={onTestStaleRaceCondition}
              className="btn-secondary text-[11px] py-1 px-2 rounded-lg border-purple-200 text-purple-700 hover:bg-purple-50 flex items-center gap-1"
            >
              <FastForward className="w-3 h-3 text-purple-600" />
              <span>Stale Race Guard</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
