"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Print", className }: { label?: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={
        className ??
        "flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-brand-300 print:hidden"
      }
    >
      <Printer className="h-4 w-4" /> {label}
    </button>
  );
}
