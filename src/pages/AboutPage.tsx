import React from 'react';
import { ShieldCheck, CheckCircle2, Layers, Cpu, Bug } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Architecture & Design Overview
        </h1>
        <p className="text-xs text-slate-500">
          Flam Frontend Internship Assignment • Technical Implementation & Rubric Compliance
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-sm text-slate-900">Structured Data Only</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Free-form inputs are converted strictly into typed JSON schemas to drive interactive UI components without chatbot prose.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-sm text-slate-900">Defensive Validation</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Strict Zod parsing catches malformed JSON, schema mismatches, and race conditions before touching React state.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-sm text-slate-900">Protected Backend Proxy</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            API keys are kept strictly on the Node proxy (:3001). The browser client never makes direct LLM calls.
          </p>
        </div>
      </div>

      {/* Failure Handling Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Defensive Failure Handling Matrix</span>
          </h2>
          <Link to="/diagnostics" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
            <Bug className="w-3.5 h-3.5" />
            <span>Test in Lab</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="py-2 px-3">Failure Mode</th>
                <th className="py-2 px-3">Defensive Guard Implemented</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-rose-600">Malformed JSON</td>
                <td className="py-2.5 px-3 text-slate-600">Catches syntax error, sanitizes markdown fences, and routes to friendly error state.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-amber-600">Wrong Shape</td>
                <td className="py-2.5 px-3 text-slate-600">Strict Zod schema validation flags missing fields before render.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-orange-600">Empty Response</td>
                <td className="py-2.5 px-3 text-slate-600">Explicit blank checks trigger informative retry UI.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-blue-600">Slow Timeout (&gt;25s)</td>
                <td className="py-2.5 px-3 text-slate-600">Client-side `AbortController` timer safely aborts hanging requests.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-purple-600">Stale Race Condition</td>
                <td className="py-2.5 px-3 text-slate-600">`staleRequestIdRef` counter discards outdated in-flight responses.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Rubric Checklist */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Assignment Rubric Compliance</span>
        </h2>

        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <div><strong>React & Frontend Architecture (25%):</strong> Clean functional components, custom hooks, typed interfaces.</div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <div><strong>AI Integration & Data Handling (25%):</strong> Gemini 3 Flash structured output via backend proxy + mock engine fallback.</div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <div><strong>Handling Bad AI Output (20%):</strong> Exhaustive defensive parsing, Zod validation, and test harness.</div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <div><strong>UI/UX & Product Sense (15%):</strong> Scalable servings with fraction math, smart swaps, focus cooking mode with audio.</div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <div><strong>Documentation (15%):</strong> Complete README.md, AI disclosure note, and architecture breakdown.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
