import { AnimatedNavFramer } from "@/components/ui/navigation-menu";

export default function DemoPage() {
  return (
    <div className="space-y-12 pb-16">
      <AnimatedNavFramer />
      <div className="max-w-4xl mx-auto px-4 pt-16 text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900">
          Translucent In-Tact Navigation
        </h1>
        <p className="text-slate-600">
          Scroll down to see the navbar stay in-tact with frosted glass translucency as page content flows underneath.
        </p>
      </div>
      <div className="h-[120vh] max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800">Page Content Scroll Simulation</h2>
        <p className="mt-2 text-slate-500 text-sm">
          The full navigation links, live AI status, and action buttons stay permanently visible and accessible.
        </p>
      </div>
    </div>
  );
}
