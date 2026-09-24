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
          icon: <Bug className="w-5 h-5 text-rose-400" />,
          label: 'Malformed JSON Syntax',
          badgeClass: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
        };
      case 'WRONG_SHAPE':
        return {
          icon: <ShieldAlert className="w-5 h-5 text-amber-400" />,
          label: 'Schema Validation Failure',
          badgeClass: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        };
      case 'EMPTY_RESPONSE':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
          label: 'Empty AI Output',
          badgeClass: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
        };
      case 'SLOW_TIMEOUT':
        return {
          icon: <Clock className="w-5 h-5 text-cyan-400" />,
          label: 'Request Timed Out (>25s)',
          badgeClass: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
        };
      case 'NETWORK_ERROR':
        return {
          icon: <WifiOff className="w-5 h-5 text-rose-400" />,
          label: 'Backend Connection Error',
          badgeClass: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
        };
      default:
        return {
          icon: <AlertTriangle className="w-5 h-5 text-rose-400" />,
          label: 'Model Processing Error',
          badgeClass: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
        };
    }
  };

  const badge = getErrorBadge();

  return (
    <div className="glass-panel p-6 sm:p-8 border border-rose-500/30 bg-slate-900/90 relative overflow-hidden animate-in fade-in duration-300">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header with error badge */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
              {badge.icon}
            </div>
            <div>
              <span className={`badge-tag border text-xs ${badge.badgeClass}`}>
                {badge.label}
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
                {error.title}
              </h3>
            </div>
          </div>
        </div>

        {/* User-friendly message */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {error.message}
          </p>
          {error.type === 'MALFORMED_JSON' && (
            <p className="text-xs text-slate-400 mt-2">
              💡 Defensive parsing caught the invalid syntax before it could cause a React runtime crash.
            </p>
          )}
          {error.type === 'WRONG_SHAPE' && (
            <p className="text-xs text-slate-400 mt-2">
              💡 Strict Zod runtime validation protected the UI from rendering incomplete or incorrectly-typed data.
            </p>
          )}
        </div>

        {/* Technical Diagnostics Accordion */}
        {(error.details || error.rawResponse) && (
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full px-4 py-3 text-left text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Bug className="w-4 h-4 text-amber-400" />
                Technical Diagnostics & Schema Validation Trace
              </span>
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDetails && (
              <div className="p-4 border-t border-slate-800 space-y-3 font-mono text-xs text-slate-300 bg-slate-950">
                {error.details && (
                  <div>
                    <span className="text-slate-500 block mb-1 font-sans font-semibold">Error Trace / Field Violations:</span>
                    <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-rose-300 whitespace-pre-wrap overflow-x-auto">
                      {error.details}
                    </pre>
                  </div>
                )}

                {error.rawResponse && (
                  <div>
                    <span className="text-slate-500 block mb-1 font-sans font-semibold">Raw Model Output Snippet:</span>
                    <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 whitespace-pre-wrap overflow-x-auto max-h-48">
                      {error.rawResponse}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
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
              className="btn-secondary text-sm py-2 px-4 rounded-xl border-amber-500/30 text-amber-300 hover:bg-amber-500/10 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Load Smart Fallback Recipe</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
