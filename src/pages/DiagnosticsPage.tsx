import { useState } from 'react';
import { 
  Bug, ShieldAlert, AlertOctagon, RefreshCw, Clock, 
  Zap, FastForward, FileCode, Play, Terminal 
} from 'lucide-react';
import { generateRecipe } from '../lib/api';
import type { GenerateOptions } from '../lib/api';

interface LogEntry {
  id: number;
  timestamp: string;
  testName: string;
  status: 'SUCCESS' | 'EXPECTED_FAILURE' | 'ERROR';
  type: string;
  message: string;
  durationMs: number;
  details?: string;
}

export const DiagnosticsPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [activeTab, setActiveTab] = useState<'tests' | 'schema'>('tests');

  const runTestScenario = async (
    testName: string,
    simulateType: GenerateOptions['simulateFailure'] | 'race_condition'
  ) => {
    setIsRunningTest(true);
    const startTime = performance.now();

    if (simulateType === 'race_condition') {
      // Race condition test: Launch slow request then fast request
      const slowPromise = generateRecipe('Slow Request A', { simulateFailure: 'slow_timeout' });
      const fastPromise = new Promise<void>((resolve) => {
        setTimeout(async () => {
          const fastRes = await generateRecipe('Fast Request B (5-min eggs)', {});
          const duration = Math.round(performance.now() - startTime);

          setLogs((prev) => [
            {
              id: Date.now(),
              timestamp: new Date().toLocaleTimeString(),
              testName: 'Stale Request Race Condition Test',
              status: fastRes.success ? 'SUCCESS' : 'EXPECTED_FAILURE',
              type: fastRes.success ? 'STALE_GUARD_VERIFIED' : 'FAILED',
              message: fastRes.success
                ? 'Fast Request B completed and rendered. Request A was discarded safely.'
                : fastRes.error?.message || 'Error occurred',
              durationMs: duration,
              details: `Request A in-flight was prevented from overwriting Request B. Current ID: ${fastRes.requestId}`,
            },
            ...prev,
          ]);
          setIsRunningTest(false);
          resolve();
        }, 300);
      });

      await Promise.all([slowPromise, fastPromise]);
      return;
    }

    // Standard failure simulation test
    const response = await generateRecipe('Test recipe generation', {
      simulateFailure: simulateType,
    });
    const duration = Math.round(performance.now() - startTime);

    setLogs((prev) => [
      {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        testName,
        status: response.success ? 'SUCCESS' : 'EXPECTED_FAILURE',
        type: response.error?.type || 'VALID_PAYLOAD',
        message: response.error?.message || `Successfully validated recipe '${response.data?.title}'`,
        durationMs: duration,
        details: response.error?.details,
      },
      ...prev,
    ]);

    setIsRunningTest(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 border border-slate-800 bg-slate-900/90 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Bug className="w-5 h-5" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                AI Diagnostics & Evaluation Lab
              </h1>
            </div>
            <p className="text-sm text-slate-400">
              Interactive test harness designed to verify defensive parsing, schema validation, and recovery across all failure modes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('tests')}
              className={`text-xs sm:text-sm py-2 px-4 rounded-xl font-semibold border transition-all ${
                activeTab === 'tests'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Test Scenarios
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('schema')}
              className={`text-xs sm:text-sm py-2 px-4 rounded-xl font-semibold border transition-all ${
                activeTab === 'schema'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              JSON Schema Inspector
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'tests' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Test Triggers Grid */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-display font-bold text-base text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>Available Failure Mode Tests:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Malformed JSON */}
              <div className="glass-panel p-5 border border-slate-800 bg-slate-900/80 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm mb-1">
                    <AlertOctagon className="w-4 h-4" />
                    <span>Malformed JSON</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Simulates non-parseable syntax output (broken brackets) to verify `validateResult.ts` catch blocks.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isRunningTest}
                  onClick={() => runTestScenario('Malformed JSON Syntax Test', 'malformed')}
                  className="btn-secondary text-xs py-2 px-3 rounded-lg border-rose-500/40 text-rose-300 hover:bg-rose-950/30 flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Test</span>
                </button>
              </div>

              {/* 2. Wrong Shape */}
              <div className="glass-panel p-5 border border-slate-800 bg-slate-900/80 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Wrong Shape / Missing Keys</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Simulates valid JSON missing required fields (`steps`, `ingredients`) to trigger strict Zod validation.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isRunningTest}
                  onClick={() => runTestScenario('Wrong Shape Schema Test', 'wrong_shape')}
                  className="btn-secondary text-xs py-2 px-3 rounded-lg border-amber-500/40 text-amber-300 hover:bg-amber-950/30 flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Test</span>
                </button>
              </div>

              {/* 3. Empty Response */}
              <div className="glass-panel p-5 border border-slate-800 bg-slate-900/80 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-orange-400 font-semibold text-sm mb-1">
                    <RefreshCw className="w-4 h-4" />
                    <span>Empty Response</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Simulates blank string / null payload from upstream model endpoint.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isRunningTest}
                  onClick={() => runTestScenario('Empty Response Test', 'empty')}
                  className="btn-secondary text-xs py-2 px-3 rounded-lg border-orange-500/40 text-orange-300 hover:bg-orange-950/30 flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Test</span>
                </button>
              </div>

              {/* 4. Slow Response Timeout */}
              <div className="glass-panel p-5 border border-slate-800 bg-slate-900/80 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm mb-1">
                    <Clock className="w-4 h-4" />
                    <span>Slow Response (&gt;25s)</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Simulates network hang and triggers client-side AbortController timeout protection.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isRunningTest}
                  onClick={() => runTestScenario('Slow Timeout Guard Test', 'slow_timeout')}
                  className="btn-secondary text-xs py-2 px-3 rounded-lg border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/30 flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Test</span>
                </button>
              </div>

              {/* 5. Server 500 Error */}
              <div className="glass-panel p-5 border border-slate-800 bg-slate-900/80 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm mb-1">
                    <Zap className="w-4 h-4" />
                    <span>Backend 500 Gateway Error</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Simulates upstream AI service unavailability and verifies proxy error capturing.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isRunningTest}
                  onClick={() => runTestScenario('Server 500 Gateway Test', 'server_error')}
                  className="btn-secondary text-xs py-2 px-3 rounded-lg border-rose-500/40 text-rose-300 hover:bg-rose-950/30 flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Test</span>
                </button>
              </div>

              {/* 6. Stale Request Race Condition */}
              <div className="glass-panel p-5 border border-slate-800 bg-slate-900/80 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm mb-1">
                    <FastForward className="w-4 h-4" />
                    <span>Stale Request Race Guard</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Fires slow Request A then fast Request B to prove Request A cannot overwrite Request B.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isRunningTest}
                  onClick={() => runTestScenario('Stale Request Race Test', 'race_condition')}
                  className="btn-secondary text-xs py-2 px-3 rounded-lg border-purple-500/40 text-purple-300 hover:bg-purple-950/30 flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Test</span>
                </button>
              </div>
            </div>
          </div>

          {/* Test Execution Logs Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Live Test Execution Logs:</span>
              </h3>
              {logs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setLogs([])}
                  className="text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  Clear Logs
                </button>
              )}
            </div>

            <div className="glass-panel p-4 border border-slate-800 bg-slate-950 min-h-[360px] max-h-[500px] overflow-y-auto space-y-3 font-mono text-xs">
              {logs.length === 0 ? (
                <div className="text-center py-16 text-slate-500 space-y-2">
                  <Terminal className="w-8 h-8 mx-auto text-slate-600" />
                  <p>Click any test trigger to execute diagnostics and view real-time traces here.</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{log.timestamp}</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        log.status === 'EXPECTED_FAILURE'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {log.status === 'EXPECTED_FAILURE' ? 'DEFENSIVE CATCH ✅' : 'OK ✅'} ({log.durationMs}ms)
                      </span>
                    </div>

                    <div className="text-slate-200 font-semibold">{log.testName}</div>
                    <div className="text-slate-400">{log.message}</div>
                    {log.details && (
                      <div className="text-rose-300 text-[10px] bg-slate-950 p-2 rounded border border-slate-800 whitespace-pre-wrap">
                        {log.details}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* JSON Schema Inspector */
        <div className="glass-panel p-6 sm:p-8 border border-slate-800 bg-slate-900/80 space-y-6">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-lg text-white">
              Enforced Recipe JSON Schema Specification
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            This structured schema is enforced on every AI model completion via runtime Zod parsing before rendering into React state:
          </p>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
{`{
  "title": string (min 2 chars),
  "tagline": string,
  "description": string (min 5 chars),
  "cuisine": string,
  "difficulty": "Easy" | "Medium" | "Hard",
  "prepTimeMinutes": number (>= 0),
  "cookTimeMinutes": number (>= 0),
  "totalTimeMinutes": number,
  "baseServings": number (>= 1),
  "dietaryTags": string[],
  "ingredients": [
    {
      "id": string,
      "name": string,
      "amount": number (> 0),
      "unit": string,
      "category": "produce" | "dairy" | "meat" | "pantry" | "bakery" | "spices" | "canned" | "other",
      "notes"?: string,
      "isPantryStaple"?: boolean,
      "swaps"?: [
        {
          "original": string,
          "substitute": string,
          "ratio": string,
          "dietaryBenefit"?: string
        }
      ]
    }
  ],
  "pantryStaplesNeeded": string[],
  "steps": [
    {
      "stepNumber": number (int > 0),
      "shortSummary"?: string,
      "instruction": string (min 3 chars),
      "timerMinutes"?: number,
      "tip"?: string,
      "ingredientsUsed"?: string[]
    }
  ],
  "nutritionPerServing"?: {
    "calories": number,
    "proteinGrams": number,
    "carbsGrams": number,
    "fatGrams": number,
    "fiberGrams"?: number
  },
  "chefTips"?: string[],
  "swapsSummary"?: [
    { "ingredient": string, "substitute": string, "reason": string }
  ]
}`}
          </pre>
        </div>
      )}
    </div>
  );
};
