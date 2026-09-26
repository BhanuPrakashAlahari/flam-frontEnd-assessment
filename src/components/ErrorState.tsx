import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Bug, ChevronDown, ChevronUp, Sparkles, ShieldAlert, WifiOff, Clock } from 'lucide-react';
import type { AppError } from '../types/result';

interface ErrorStateProps {
  error: AppError;
  onRetry: () => void;
  onUseFallback?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  onUseFallback,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getErrorBadge = () => {
    switch (error.type) {
      case 'MALFORMED_JSON':
        return {
          icon: <Bug className="w-5 h-5 text-rose-600" />,
          label: 'Malformed JSON Syntax',
          badgeClass: 'bg-rose-50 border-rose-200 text-rose-700',
        };
      case 'WRONG_SHAPE':
        return {
          icon: <ShieldAlert className="w-5 h-5 text-amber-600" />,
          label: 'Schema Validation Failure',
          badgeClass: 'bg-amber-50 border-amber-200 text-amber-700',
        };
      case 'EMPTY_RESPONSE':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
          label: 'Empty AI Output',
          badgeClass: 'bg-orange-50 border-orange-200 text-orange-700',
        };
      case 'SLOW_TIMEOUT':
        return {
          icon: <Clock className="w-5 h-5 text-blue-600" />,
          label: 'Request Timed Out (>25s)',
          badgeClass: 'bg-blue-50 border-blue-200 text-blue-700',
        };
      case 'NETWORK_ERROR':
        return {
          icon: <WifiOff className="w-5 h-5 text-rose-600" />,
          label: 'Backend Connection Error',
          badgeClass: 'bg-rose-50 border-rose-200 text-rose-700',
        };
      default:
        return {
          icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
          label: 'Model Processing Error',
          badgeClass: 'bg-rose-50 border-rose-200 text-rose-700',
        };
    }
  };

  const badge = getErrorBadge();

  return (
    <div className="glass-panel p-6 sm:p-8 border-rose-200 bg-white relative overflow-hidden shadow-sm animate-in fade-in duration-300 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
            {badge.icon}
          </div>
          <div>
            <span className={`badge-tag border text-xs ${badge.badgeClass}`}>
              {badge.label}
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {error.title}
            </h3>
          </div>
        </div>
      </div>

      {/* User-friendly message */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
          {error.message}
        </p>
        {error.type === 'MALFORMED_JSON' && (
          <p className="text-xs text-slate-500 mt-2 font-medium">
            💡 Defensive parsing caught the invalid syntax before it could cause a React runtime crash.
          </p>
        )}
        {error.type === 'WRONG_SHAPE' && (
          <p className="text-xs text-slate-500 mt-2 font-medium">
            💡 Strict Zod runtime validation protected the UI from rendering incomplete or incorrectly-typed data.
          </p>
        )}
      </div>

      {/* Technical Diagnostics Accordion */}
      {(error.details || error.rawResponse) && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-4 py-3 text-left text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <Bug className="w-4 h-4 text-rose-600" />
              Technical Diagnostics & Schema Validation Trace
            </span>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDetails && (
            <div className="p-4 border-t border-slate-200 space-y-3 font-mono text-xs text-slate-800 bg-white">
              {error.details && (
                <div>
                  <span className="text-slate-500 block mb-1 font-sans font-semibold">Error Trace / Field Violations:</span>
                  <pre className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-rose-700 whitespace-pre-wrap overflow-x-auto">
                    {error.details}
                  </pre>
                </div>
              )}

              {error.rawResponse && (
                <div>
                  <span className="text-slate-500 block mb-1 font-sans font-semibold">Raw Model Output Snippet:</span>
                  <pre className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 whitespace-pre-wrap overflow-x-auto max-h-48">
                    {error.rawResponse}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {error.canRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="btn-primary text-sm py-2 px-4 rounded-xl flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Generation</span>
          </button>
        )}

        {onUseFallback && (
          <button
            type="button"
            onClick={onUseFallback}
            className="btn-secondary text-sm py-2 px-4 rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Load Clean Fallback Recipe</span>
          </button>
        )}
      </div>
    </div>
  );
};
