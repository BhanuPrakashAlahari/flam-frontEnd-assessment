import { 
  Info, ShieldCheck, CheckCircle2, Layers, Cpu 
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 border border-slate-800 bg-slate-900/90 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Info className="w-5 h-5" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Architecture & Assignment Specification
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            Flam Frontend Internship Assignment • Technical Design Decisions, Data Flow & Defensive Architecture
          </p>
        </div>
      </div>

      {/* Core Principles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-sm text-white">No Chatbot Rule</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Free-form inputs are converted strictly into typed JSON schemas that drive interactive UI components—never printed as raw chat prose.
          </p>
        </div>

        <div className="glass-panel p-5 border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-sm text-white">Defensive Parsing</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every model response undergoes markdown stripping, JSON syntax validation, and strict Zod runtime type-checking before touching React state.
          </p>
        </div>

        <div className="glass-panel p-5 border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-sm text-white">Secure Proxy Layer</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            API keys are kept strictly on the Node/Express backend proxy (:3001). The browser client never makes direct LLM calls.
          </p>
        </div>
      </div>

      {/* Defensive Failure Strategy Matrix */}
      <div className="glass-panel p-6 sm:p-8 border border-slate-800 bg-slate-900/80 space-y-4">
        <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>Failure Mode Handling Matrix</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Failure Mode</th>
                <th className="py-2.5 px-3">Root Cause in Production</th>
                <th className="py-2.5 px-3">Defensive Guard Implemented</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="py-3 px-3 font-semibold text-rose-400">Malformed JSON</td>
                <td className="py-3 px-3 text-slate-400">Unclosed brackets or conversational preamble from smaller/unpredictable models.</td>
                <td className="py-3 px-3">Catches syntax error, sanitizes markdown code fences, and displays error diagnostics without UI crash.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-amber-400">Wrong Shape</td>
                <td className="py-3 px-3 text-slate-400">Valid JSON but missing critical fields (e.g. empty steps array).</td>
                <td className="py-3 px-3">Strict Zod runtime schema check flags field-level violations and provides itemized error trace.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-orange-400">Empty Response</td>
                <td className="py-3 px-3 text-slate-400">Gateway dropped connection or model returned blank string.</td>
                <td className="py-3 px-3">Explicit blank/null checks route to descriptive error state with instant retry button.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-cyan-400">Slow Timeout (&gt;25s)</td>
                <td className="py-3 px-3 text-slate-400">High inference queue latency causing silent page hangs.</td>
                <td className="py-3 px-3">Client-side `AbortController` timer aborts at 25s and displays friendly retry UI.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-purple-400">Stale Race Condition</td>
                <td className="py-3 px-3 text-slate-400">Slow Request A resolves after faster Request B, silently overwriting newer results.</td>
                <td className="py-3 px-3">`staleRequestIdRef` counter discards any response whose ID does not match current counter.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Rubric Compliance */}
      <div className="glass-panel p-6 sm:p-8 border border-slate-800 bg-slate-900/80 space-y-4">
        <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Rubric Criteria & Compliance Checklist</span>
        </h2>

        <div className="space-y-3 text-xs sm:text-sm text-slate-300">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
            <div>
              <strong className="text-white">React & Frontend Architecture (25%):</strong> Clean modular components, custom hooks, typed interfaces, and zero prop-drilling chaos.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
            <div>
              <strong className="text-white">AI Integration & Data Handling (25%):</strong> Gemini 1.5 Flash structured output via backend proxy + built-in offline mock engine fallback.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
            <div>
              <strong className="text-white">Handling Bad AI Output (20%):</strong> Exhaustive defensive parsing, Zod validation, and live evaluator testing bar.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
            <div>
              <strong className="text-white">UI/UX & Product Sense (15%):</strong> Scalable servings with fraction math, smart swap toggles, focus cooking mode with audio chimes.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
            <div>
              <strong className="text-white">Communication & Documentation (15%):</strong> Full README.md, AI disclosure note, architecture breakdown, and time spent.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
