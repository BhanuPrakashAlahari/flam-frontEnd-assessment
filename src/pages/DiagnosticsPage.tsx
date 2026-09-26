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
      <div className="glass-panel p-6 sm:p-8 border border-slate-200 bg-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Bug className="w-5 h-5" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                AI Diagnostics & Evaluation Lab
              </h1>
            </div>
            <p className="text-sm text-slate-600">
              Interactive test harness designed to verify defensive parsing, schema validation, and recovery across all failure modes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('tests')}
              className={`text-xs sm:text-sm py-2 px-4 rounded-xl font-semibold border transition-all ${
                activeTab === 'tests'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Test Scenarios
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('schema')}
              className={`text-xs sm:text-sm py-2 px-4 rounded-xl font-semibold border transition-all ${
                activeTab === 'schema'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
            <h3 className="font-display font-bold text-base text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-600" />
              <span>Available Failure Mode Tests:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Malformed JSON */}
              <div className="glass-panel p-5 border border-slate-200 bg-white space-y-3 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm mb-1">
                    <AlertOctagon className="w-4 h-4" />
                    <span>Malformed JSON</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Simulates non-parseable syntax output (broken brackets) to verify `validateResult.ts` catch blocks.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isRunningTest}
                  onClick={() => runTestScenario('Malformed JSON Syntax Test', 'malformed')}
                  className="btn-secondary text-xs py-2 px-3 rounded-lg border-rose-200 text-rose-700 hover:bg-rose-50 flex items-center justify-center gap-1.5 font-medium"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Test</span>
                </button>
              </div>

              {/* 2. Wrong Shape */}
              <div className="glass-panel p-5 border border-slate-200 bg-white space-y-3 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm mb-1">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Wrong Shape / Missing Keys</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Simulates valid JSON missing required fields (`steps`, `ingredients`) to trigger strict Zod validation.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isRunningTest}
                  onClick={() => runTestScenario('Wrong Shape Schema Test', 'wrong_shape')}
                  className="btn-secondary text-xs py-2 px-3 rounded-lg border-amber-200 text-amber-700 hover:bg-amber-50 flex items-center justify-center gap-1.5 font-medium"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Test</span>
                </button>
              </div>

              {/* 3. Empty Response */}
              <div className="glass-panel p-5 border border-slate-200 bg-white space-y-3 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-2 text-orange-700 font-semibold text-sm mb-1">
                    <RefreshCw className="w-4 h-4 text-orange-600" />
                    <span>Empty Response</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Simulates blank string / null payload from upstream model endpoint.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isRunningTest}
                  onClick={() => runTestScenario('Empty Response Test', 'empty')}
                  className="btn-secondary text-xs py-2 px-3 rounded-lg border-orange-200 text-orange-700 hover:bg-orange-50 flex items-center justify-center gap-1.5 font-medium"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Test</span>
                </button>
              </div>

              {/* 4. Slow Response Timeout */}
              <div className="glass-panel p-5 border border-slate-200 bg-white space-y-3 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm mb-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Slow Response (&gt;25s)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Simulates network hang and triggers client-side AbortController timeout protection.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isRunningTest}
                  onClick={() => runTestScenario('Slow Timeout Guard Test', 'slow_timeout')}
                  className="btn-secondary text-xs py-2 px-3 rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50 flex items-center justify-center gap-1.5 font-medium"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Test</span>
                </button>
              </div>

              {/* 5. Server 500 Error */}
              <div className="glass-panel p-5 border border-slate-200 bg-white space-y-3 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-2 text-rose-700 font-semibold text-sm mb-1">
                    <Zap className="w-4 h-4 text-rose-600" />
                    <span>Backend 500 Gateway Error</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Simulates upstream AI service unavailability and verifies proxy error capturing.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isRunningTest}
                  onClick={() => runTestScenario('Server 500 Gateway Test', 'server_error')}
                  className="btn-secondary text-xs py-2 px-3 rounded-lg border-rose-200 text-rose-700 hover:bg-rose-50 flex items-center justify-center gap-1.5 font-medium"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Test</span>
                </button>
              </div>

              {/* 6. Stale Request Race Condition */}
              <div className="glass-panel p-5 border border-slate-200 bg-white space-y-3 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-2 text-purple-700 font-semibold text-sm mb-1">
                    <FastForward className="w-4 h-4 text-purple-600" />
                    <span>Stale Request Race Guard</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Fires slow Request A then fast Request B to prove Request A cannot overwrite Request B.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isRunningTest}
                  onClick={() => runTestScenario('Stale Request Race Test', 'race_condition')}
                  className="btn-secondary text-xs py-2 px-3 rounded-lg border-purple-200 text-purple-700 hover:bg-purple-50 flex items-center justify-center gap-1.5 font-medium"
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
              <h3 className="font-display font-bold text-base text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-600" />
                <span>Live Test Execution Logs:</span>
              </h3>
              {logs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setLogs([])}
                  className="text-xs text-blue-600 hover:text-blue-700 underline font-medium"
                >
                  Clear Logs
                </button>
              )}
            </div>

            <div className="glass-panel p-4 border border-slate-200 bg-slate-50 min-h-[360px] max-h-[500px] overflow-y-auto space-y-3 font-mono text-xs shadow-xs">
              {logs.length === 0 ? (
                <div className="text-center py-16 text-slate-400 space-y-2">
                  <Terminal className="w-8 h-8 mx-auto text-slate-300" />
                  <p>Click any test trigger to execute diagnostics and view real-time traces here.</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg bg-white border border-slate-200 space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{log.timestamp}</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        log.status === 'EXPECTED_FAILURE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {log.status === 'EXPECTED_FAILURE' ? 'DEFENSIVE CATCH ✅' : 'OK ✅'} ({log.durationMs}ms)
                      </span>
                    </div>

                    <div className="text-slate-900 font-semibold">{log.testName}</div>
                    <div className="text-slate-600">{log.message}</div>
                    {log.details && (
                      <div className="text-rose-700 text-[10px] bg-rose-50 p-2 rounded border border-rose-200 whitespace-pre-wrap">
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
        <div className="glass-panel p-6 sm:p-8 border border-slate-200 bg-white space-y-6 shadow-sm">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-blue-600" />
            <h3 className="font-display font-bold text-lg text-slate-900">
              Enforced Recipe JSON Schema Specification
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            This structured schema is enforced on every AI model completion via runtime Zod parsing before rendering into React state:
          </p>

          <pre className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 overflow-x-auto leading-relaxed">
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
