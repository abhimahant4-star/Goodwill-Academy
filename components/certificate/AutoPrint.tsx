"use client";

import { useEffect } from "react";
import { Printer } from "lucide-react";

/** Opens the print dialog once fonts are ready; "Save as PDF" there downloads the certificate. */
export function AutoPrint() {
  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) setTimeout(() => window.print(), 300);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-2.5 text-sm text-slate-600 shadow print:hidden">
      For best results choose <b>A4 · Landscape</b>, margins <b>None</b> and enable <b>Background graphics</b>.
      <button onClick={() => window.print()} className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 font-semibold text-white">
        <Printer className="h-4 w-4" /> Print / Save PDF
      </button>
    </div>
  );
}
