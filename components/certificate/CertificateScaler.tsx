"use client";

import { useEffect, useRef, useState } from "react";
import { CERT_H, CERT_W } from "./Certificate";

/** Scales the fixed-size A4 certificate down to fit its container. */
export function CertificateScaler({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / CERT_W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={{ height: scale ? CERT_H * scale : undefined, aspectRatio: scale ? undefined : `${CERT_W} / ${CERT_H}` }}>
      <div
        className="origin-top-left shadow-2xl shadow-brand-950/20 transition-opacity duration-500"
        style={{ width: CERT_W, height: CERT_H, transform: `scale(${scale})`, opacity: scale ? 1 : 0 }}
      >
        {children}
      </div>
    </div>
  );
}
