import React, { useState } from 'react';
import { 
  AlertTriangle, RefreshCw, Bug, ChevronDown, ChevronUp, 
  Sparkles, ShieldAlert, WifiOff, Clock, Copy, CheckCheck, UtensilsCrossed
} from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

  const getErrorBadge = () => {
    switch (error.type) {
      case 'MALFORMED_JSON':
        return {
          icon: <Bug className="w-12 h-12 text-rose-600" />,
          label: 'Malformed JSON Syntax',
        };
      case 'WRONG_SHAPE':
        return {
          icon: <ShieldAlert className="w-12 h-12 text-amber-600" />,
          label: 'Schema Validation Failure',
        };
      case 'EMPTY_RESPONSE':
        return {
          icon: <AlertTriangle className="w-12 h-12 text-orange-600" />,
          label: 'Empty AI Output',
        };
      case 'SLOW_TIMEOUT':
        return {
          icon: <Clock className="w-12 h-12 text-blue-600" />,
          label: 'Request Timed Out',
        };
      case 'NETWORK_ERROR':
        return {
          icon: <WifiOff className="w-12 h-12 text-rose-600" />,
          label: 'Backend Gateway Error',
        };
      case 'INVALID_PROMPT':
        return {
          icon: <UtensilsCrossed className="w-12 h-12 text-amber-600" />,
          label: 'Culinary Input Required',
        };
      default:
        if (error.title?.toLowerCase().includes('cooking') || error.title?.toLowerCase().includes('non-cooking')) {
          return {
            icon: <UtensilsCrossed className="w-12 h-12 text-amber-600" />,
            label: 'Culinary Input Required',
          };
        }
        return {
          icon: <AlertTriangle className="w-12 h-12 text-rose-600" />,
          label: 'Processing Error',
        };
    }
  };

  const badge = getErrorBadge();

  const handleCopyTrace = () => {
    const traceText = `Error: ${error.title}\nType: ${error.type}\nMessage: ${error.message}\nDetails: ${error.details || 'N/A'}\nRaw: ${error.rawResponse || 'N/A'}`;
    navigator.clipboard.writeText(traceText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-xs relative overflow-hidden animate-in fade-in duration-300 text-center flex flex-col items-center justify-center">
      {/* 1. Transparent Top Middle Logo */}
      <div className="flex justify-center mb-4 transition-transform">
        {badge.icon}
      </div>

      {/* 2. Centered Title */}
      <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-2 tracking-tight">
        {error.title}
      </h3>

      {/* 3. Detailed Single-Line Description (Centered) */}
      <p className="text-slate-600 text-sm sm:text-base text-center max-w-xl mx-auto leading-relaxed mb-6">
        {error.message}
      </p>

      {/* 4. Action Buttons (Centered) */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {error.canRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="btn-primary text-sm py-2.5 px-6 rounded-xl flex items-center gap-2 font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Generation</span>
          </button>
        )}

        {onUseFallback && (
          <button
            type="button"
            onClick={onUseFallback}
            className="btn-secondary text-sm py-2.5 px-5 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Load Sample Recipe</span>
          </button>
        )}
      </div>

      {/* 5. Optional Technical Diagnostics Accordion */}
      {(error.details || error.rawResponse) && (
        <div className="w-full max-w-xl mt-8 pt-6 border-t border-slate-100 text-left">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-between transition-colors py-1"
          >
            <span className="flex items-center gap-1.5">
              <Bug className="w-3.5 h-3.5 text-slate-400" />
              <span>Technical Diagnostics Trace</span>
            </span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetails && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs text-slate-800 animate-in fade-in duration-150">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCopyTrace}
                  className="btn-secondary text-[11px] py-1 px-2.5 rounded-lg font-mono flex items-center gap-1"
                >
                  {copied ? <CheckCheck className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Trace'}</span>
                </button>
              </div>

              {error.details && (
                <div>
                  <span className="text-slate-500 block mb-1 font-sans font-bold">Field Violations / Details:</span>
                  <pre className="p-3 rounded-xl bg-white border border-slate-200 text-rose-700 whitespace-pre-wrap overflow-x-auto text-[11px]">
                    {error.details}
                  </pre>
                </div>
              )}

              {error.rawResponse && (
                <div>
                  <span className="text-slate-500 block mb-1 font-sans font-bold">Raw Payload Received:</span>
                  <pre className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 whitespace-pre-wrap overflow-x-auto max-h-40 text-[11px]">
                    {error.rawResponse}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
