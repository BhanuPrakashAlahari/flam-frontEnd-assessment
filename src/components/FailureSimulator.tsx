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
    <div className="simulator-bar border border-amber-200 bg-amber-50/70 rounded-2xl text-xs overflow-hidden shadow-2xs">
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-amber-900 font-medium">
          <Bug className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-bold">Assignment Evaluator Bar:</span>
          <span className="text-amber-800 hidden sm:inline">
            Test and trigger realistic AI failure modes on demand
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-amber-800 hover:text-amber-950 font-semibold py-1 px-2.5 rounded-lg bg-white border border-amber-300 shadow-2xs transition-colors"
          >
            <span>{isOpen ? 'Hide Test Triggers' : 'Show Error Test Scenarios'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-amber-200 bg-white py-3.5 px-4 transition-all space-y-3">
          <p className="text-slate-600 text-xs">
            Click any scenario below to verify that unpredictable model output and network issues route to clean UI states instead of crashing:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              disabled={isLoading}
              onClick={() => onSimulate('malformed')}
              className="btn-secondary text-xs py-1.5 px-3 rounded-lg border-rose-200 hover:bg-rose-50 text-rose-700 flex items-center gap-1.5 font-medium"
              title="AI returns invalid, broken JSON text"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
              <span>Malformed JSON</span>
            </button>

            <button
              disabled={isLoading}
              onClick={() => onSimulate('wrong_shape')}
              className="btn-secondary text-xs py-1.5 px-3 rounded-lg border-amber-200 hover:bg-amber-50 text-amber-700 flex items-center gap-1.5 font-medium"
              title="AI returns valid JSON with missing required fields"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Wrong Shape / Missing Fields</span>
            </button>

            <button
              disabled={isLoading}
              onClick={() => onSimulate('empty')}
              className="btn-secondary text-xs py-1.5 px-3 rounded-lg border-orange-200 hover:bg-orange-50 text-orange-700 flex items-center gap-1.5 font-medium"
              title="AI returns blank/empty response"
            >
              <RefreshCw className="w-3.5 h-3.5 text-orange-600" />
              <span>Empty Response</span>
            </button>

            <button
              disabled={isLoading}
              onClick={() => onSimulate('slow_timeout')}
              className="btn-secondary text-xs py-1.5 px-3 rounded-lg border-blue-200 hover:bg-blue-50 text-blue-700 flex items-center gap-1.5 font-medium"
              title="AI hangs > 25s, triggering abort timeout"
            >
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Slow Response (Timeout)</span>
            </button>

            <button
              disabled={isLoading}
              onClick={() => onSimulate('server_error')}
              className="btn-secondary text-xs py-1.5 px-3 rounded-lg border-rose-200 hover:bg-rose-50 text-rose-700 flex items-center gap-1.5 font-medium"
              title="Backend proxy 500 error"
            >
              <Zap className="w-3.5 h-3.5 text-rose-600" />
              <span>Server 500 Error</span>
            </button>

            <button
              disabled={isLoading}
              onClick={onTestStaleRaceCondition}
              className="btn-secondary text-xs py-1.5 px-3 rounded-lg border-purple-200 hover:bg-purple-50 text-purple-700 flex items-center gap-1.5 font-medium"
              title="Simulates fast request overtaking slow request to test requestId guard"
            >
              <FastForward className="w-3.5 h-3.5 text-purple-600" />
              <span>Stale Request Guard Test</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
