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
    <div className="simulator-bar border-b border-amber-500/20 bg-amber-950/20 text-xs">
      <div className="container mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-amber-300 font-medium">
          <Bug className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold">Assignment Evaluator Bar:</span>
          <span className="text-slate-400 hidden sm:inline">
            Test and trigger realistic AI failure modes on demand
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium py-1 px-2 rounded bg-amber-500/10 border border-amber-500/30"
          >
            <span>{isOpen ? 'Hide Test Triggers' : 'Show Error Test Scenarios'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-amber-500/20 bg-slate-950/90 py-3 px-4 transition-all">
          <div className="container mx-auto">
            <p className="text-slate-400 mb-2.5 text-xs">
              Click any scenario below to verify that unpredictable model output and network issues route to clean UI states instead of crashing:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                disabled={isLoading}
                onClick={() => onSimulate('malformed')}
                className="btn-secondary text-xs py-1.5 px-2.5 rounded-md border-rose-500/40 hover:bg-rose-950/30 text-rose-300 flex items-center gap-1.5"
                title="AI returns invalid, broken JSON text"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                <span>Malformed JSON</span>
              </button>

              <button
                disabled={isLoading}
                onClick={() => onSimulate('wrong_shape')}
                className="btn-secondary text-xs py-1.5 px-2.5 rounded-md border-amber-500/40 hover:bg-amber-950/30 text-amber-300 flex items-center gap-1.5"
                title="AI returns valid JSON with missing required fields"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Wrong Shape / Missing Fields</span>
              </button>

              <button
                disabled={isLoading}
                onClick={() => onSimulate('empty')}
                className="btn-secondary text-xs py-1.5 px-2.5 rounded-md border-orange-500/40 hover:bg-orange-950/30 text-orange-300 flex items-center gap-1.5"
                title="AI returns blank/empty response"
              >
                <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
                <span>Empty Response</span>
              </button>

              <button
                disabled={isLoading}
                onClick={() => onSimulate('slow_timeout')}
                className="btn-secondary text-xs py-1.5 px-2.5 rounded-md border-cyan-500/40 hover:bg-cyan-950/30 text-cyan-300 flex items-center gap-1.5"
                title="AI hangs > 25s, triggering abort timeout"
              >
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Slow Response (Timeout)</span>
              </button>

              <button
                disabled={isLoading}
                onClick={() => onSimulate('server_error')}
                className="btn-secondary text-xs py-1.5 px-2.5 rounded-md border-rose-500/40 hover:bg-rose-950/30 text-rose-300 flex items-center gap-1.5"
                title="Backend proxy 500 error"
              >
                <Zap className="w-3.5 h-3.5 text-rose-400" />
                <span>Server 500 Error</span>
              </button>

              <button
                disabled={isLoading}
                onClick={onTestStaleRaceCondition}
                className="btn-secondary text-xs py-1.5 px-2.5 rounded-md border-purple-500/40 hover:bg-purple-950/30 text-purple-300 flex items-center gap-1.5"
                title="Simulates fast request overtaking slow request to test requestId guard"
              >
                <FastForward className="w-3.5 h-3.5 text-purple-400" />
                <span>Stale Request Guard Test</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
