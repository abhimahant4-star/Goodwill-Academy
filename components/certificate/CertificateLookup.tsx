"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import jsQR from "jsqr";
import { Camera, CameraOff, Hash, ImageUp, Loader2, QrCode, Search, ShieldCheck } from "lucide-react";

const ID_PATTERN = /GWA-\d{4}-[A-Z0-9]{6}/i;

type Tab = "id" | "scan";

export function CertificateLookup({ initialId = "", notFound }: { initialId?: string; notFound?: boolean }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("id");
  const [id, setId] = useState(initialId);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(notFound ? `No certificate found with ID “${initialId}”. Please check the ID and try again.` : "");

  function openCertificate(raw: string) {
    const match = raw.match(ID_PATTERN);
    if (!match) {
      setError("This QR code is not a Goodwill Academy certificate.");
      return false;
    }
    setBusy(true);
    router.push(`/certificate/${match[0].toUpperCase()}`);
    return true;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = id.trim().toUpperCase();
    if (!value) return setError("Please enter your certificate ID.");
    setError("");
    setBusy(true);
    router.push(`/certificate?id=${encodeURIComponent(value)}`);
  }

  return (
    <div className="relative rounded-[2rem] bg-white p-3 shadow-2xl shadow-brand-950/20 ring-1 ring-brand-100">
      <div className="grid grid-cols-2 gap-1 rounded-[1.4rem] bg-brand-50 p-1">
        {([
          { key: "id", label: "Certificate ID", icon: Hash },
          { key: "scan", label: "Scan QR Code", icon: QrCode },
        ] as const).map(({ key, label, icon: I }) => (
          <button
            key={key}
            onClick={() => {
              setTab(key);
              setError("");
            }}
            className={`relative flex items-center justify-center gap-2 rounded-[1.1rem] px-4 py-3 text-sm font-semibold transition ${
              tab === key ? "text-white" : "text-brand-800 hover:text-brand-600"
            }`}
          >
            {tab === key && (
              <motion.span layoutId="lookup-tab" className="absolute inset-0 rounded-[1.1rem] bg-gradient-to-r from-brand-700 to-brand-500 shadow-lg" />
            )}
            <I className="relative h-4 w-4" />
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-7">
        <AnimatePresence mode="wait">
          {tab === "id" ? (
            <motion.form
              key="id"
              onSubmit={submit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink/70">Enter the unique ID printed on your certificate</span>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-400" />
                  <input
                    value={id}
                    onChange={(e) => setId(e.target.value.toUpperCase())}
                    placeholder="GWA-2026-XXXXXX"
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full rounded-2xl border border-brand-100 bg-cream py-4 pl-12 pr-4 font-mono text-lg tracking-wider text-brand-950 uppercase outline-none transition placeholder:text-ink/25 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                </div>
              </label>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-gold-500 py-4 font-semibold text-white shadow-lg shadow-brand-600/30 disabled:opacity-70"
              >
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                {busy ? "Verifying..." : "Verify Certificate"}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div key="scan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <QrScanner onResult={openCertificate} onError={setError} busy={busy} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-100"
              role="alert"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function decode(source: CanvasImageSource, width: number, height: number) {
  const canvas = document.createElement("canvas");
  // Large photos decode faster and more reliably when downscaled.
  const scale = Math.min(1, 1000 / Math.max(width, height));
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return jsQR(img.data, img.width, img.height, { inversionAttempts: "attemptBoth" })?.data ?? null;
}

function QrScanner({ onResult, onError, busy }: { onResult: (text: string) => boolean; onError: (msg: string) => void; busy: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [starting, setStarting] = useState(false);

  function stop() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setActive(false);
  }

  useEffect(() => stop, []);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      const v = videoRef.current;
      if (v && v.readyState >= 2 && t - last > 150) {
        last = t;
        const text = decode(v, v.videoWidth, v.videoHeight);
        if (text) {
          if (onResult(text)) return stop();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, onResult]);

  async function start() {
    onError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      onError("Camera is not available in this browser. Upload a photo of the QR code instead.");
      return;
    }
    setStarting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      setActive(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => undefined);
        }
      });
    } catch {
      onError("Camera permission was denied. Allow camera access or upload a photo of the QR code.");
    } finally {
      setStarting(false);
    }
  }

  function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    onError("");
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const text = decode(img, img.naturalWidth, img.naturalHeight);
      URL.revokeObjectURL(url);
      if (!text) onError("Couldn't find a QR code in that image. Try a clearer, closer photo.");
      else onResult(text);
    };
    img.onerror = () => onError("That file couldn't be opened as an image.");
    img.src = url;
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-brand-950 sm:aspect-[4/3]">
        <video ref={videoRef} playsInline muted className={`h-full w-full object-cover ${active ? "" : "hidden"}`} />
        {active ? (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="relative h-3/5 w-3/5 max-w-64 sm:aspect-square sm:h-auto">
              {["left-0 top-0 border-l-4 border-t-4", "right-0 top-0 border-r-4 border-t-4", "bottom-0 left-0 border-b-4 border-l-4", "bottom-0 right-0 border-b-4 border-r-4"].map((c) => (
                <span key={c} className={`absolute h-10 w-10 rounded-sm border-gold-400 ${c}`} />
              ))}
              <motion.span
                className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-gold-300 to-transparent shadow-[0_0_12px_#e8bd5c]"
                animate={{ top: ["8%", "92%", "8%"] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 grid place-items-center p-6 text-center text-white">
            <div>
              <motion.div
                className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-white/10 ring-1 ring-white/20"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              >
                <QrCode className="h-10 w-10 text-gold-300" />
              </motion.div>
              <p className="mt-4 font-display text-xl font-semibold">Scan the QR code on your certificate</p>
              <p className="mt-1 text-sm text-white/60">Hold it steady inside the frame — it opens automatically.</p>
            </div>
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-brand-950/70 text-white">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {active ? (
          <button onClick={stop} className="flex items-center justify-center gap-2 rounded-2xl bg-brand-950 py-3.5 font-semibold text-white">
            <CameraOff className="h-5 w-5" /> Stop Camera
          </button>
        ) : (
          <button
            onClick={start}
            disabled={starting}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-500 py-3.5 font-semibold text-white shadow-lg shadow-brand-600/30 disabled:opacity-70"
          >
            {starting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />} Open Camera
          </button>
        )}
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl py-3.5 font-semibold text-brand-700 ring-1 ring-brand-200 transition hover:bg-brand-50">
          <ImageUp className="h-5 w-5" /> Upload QR Photo
          <input type="file" accept="image/*" onChange={upload} className="sr-only" />
        </label>
      </div>
    </div>
  );
}
