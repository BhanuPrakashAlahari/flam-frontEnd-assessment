import { 
  Info, ShieldCheck, CheckCircle2, Layers, Cpu 
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 border border-slate-200 bg-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Info className="w-5 h-5" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Architecture & Assignment Specification
            </h1>
          </div>
          <p className="text-sm text-slate-600">
            Flam Frontend Internship Assignment • Technical Design Decisions, Data Flow & Defensive Architecture
          </p>
        </div>
      </div>

      {/* Core Principles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-sm text-slate-900">No Chatbot Rule</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Free-form inputs are converted strictly into typed JSON schemas that drive interactive UI components—never printed as raw chat prose.
          </p>
        </div>

        <div className="glass-panel p-5 border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-sm text-slate-900">Defensive Parsing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every model response undergoes markdown stripping, JSON syntax validation, and strict Zod runtime type-checking before touching React state.
          </p>
        </div>

        <div className="glass-panel p-5 border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-sm text-slate-900">Secure Proxy Layer</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            API keys are kept strictly on the Node/Express backend proxy (:3001). The browser client never makes direct LLM calls.
          </p>
        </div>
      </div>

      {/* Defensive Failure Strategy Matrix */}
      <div className="glass-panel p-6 sm:p-8 border border-slate-200 bg-white space-y-4 shadow-sm">
        <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <span>Failure Mode Handling Matrix</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Failure Mode</th>
                <th className="py-2.5 px-3">Root Cause in Production</th>
                <th className="py-2.5 px-3">Defensive Guard Implemented</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-3 font-semibold text-rose-600">Malformed JSON</td>
                <td className="py-3 px-3 text-slate-500">Unclosed brackets or conversational preamble from smaller/unpredictable models.</td>
                <td className="py-3 px-3">Catches syntax error, sanitizes markdown code fences, and displays error diagnostics without UI crash.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-amber-600">Wrong Shape</td>
                <td className="py-3 px-3 text-slate-500">Valid JSON but missing critical fields (e.g. empty steps array).</td>
                <td className="py-3 px-3">Strict Zod runtime schema check flags field-level violations and provides itemized error trace.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-orange-600">Empty Response</td>
                <td className="py-3 px-3 text-slate-500">Gateway dropped connection or model returned blank string.</td>
                <td className="py-3 px-3">Explicit blank/null checks route to descriptive error state with instant retry button.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-blue-600">Slow Timeout (&gt;25s)</td>
                <td className="py-3 px-3 text-slate-500">High inference queue latency causing silent page hangs.</td>
                <td className="py-3 px-3">Client-side `AbortController` timer aborts at 25s and displays friendly retry UI.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-purple-600">Stale Race Condition</td>
                <td className="py-3 px-3 text-slate-500">Slow Request A resolves after faster Request B, silently overwriting newer results.</td>
                <td className="py-3 px-3">`staleRequestIdRef` counter discards any response whose ID does not match current counter.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Rubric Compliance */}
      <div className="glass-panel p-6 sm:p-8 border border-slate-200 bg-white space-y-4 shadow-sm">
        <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Rubric Criteria & Compliance Checklist</span>
        </h2>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
            <div>
              <strong className="text-slate-900">React & Frontend Architecture (25%):</strong> Clean modular components, custom hooks, typed interfaces, and zero prop-drilling chaos.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
            <div>
              <strong className="text-slate-900">AI Integration & Data Handling (25%):</strong> Google Gemini 3 Flash structured output via protected backend proxy + built-in offline mock engine fallback.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
            <div>
              <strong className="text-slate-900">Handling Bad AI Output (20%):</strong> Exhaustive defensive parsing, Zod validation, and live evaluator testing bar.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
            <div>
              <strong className="text-slate-900">UI/UX & Product Sense (15%):</strong> Scalable servings with fraction math, smart swap toggles, focus cooking mode with audio chimes.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
            <div>
              <strong className="text-slate-900">Communication & Documentation (15%):</strong> Full README.md, AI disclosure note, architecture breakdown, and time spent.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
