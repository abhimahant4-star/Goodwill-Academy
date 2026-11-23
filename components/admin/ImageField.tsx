"use client";

import { useEffect, useRef, useState } from "react";
import { Eraser, ImageUp, Loader2, PenLine, Trash2, User } from "lucide-react";
import { uploadMediaAction } from "@/app/media-actions";
import type { MediaKind } from "@/lib/types";

import { mediaUrl } from "@/lib/media";

export { mediaUrl };

// ---------- Image processing (runs in the browser before upload) ----------

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => reject(new Error("That file couldn't be opened as an image."));
    img.src = url;
  });
}

/** Passport photo: centre-crop to 7:9 (35×45 mm) and save as a small JPEG. */
function toPassportPhoto(img: HTMLImageElement) {
  const ratio = 7 / 9;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;
  if (sw / sh > ratio) sw = sh * ratio;
  else sh = sw / ratio;
  const sx = (img.naturalWidth - sw) / 2;
  const sy = (img.naturalHeight - sh) / 2;
  const canvas = document.createElement("canvas");
  canvas.width = 420;
  canvas.height = 540;
  canvas.getContext("2d")!.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.88);
}

/** Signatures and stamps: scale down, turn the paper background transparent and trim empty edges. */
function toTransparentInk(source: CanvasImageSource, width: number, height: number, maxWidth: number) {
  const scale = Math.min(1, maxWidth / width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = img.data;
  let minX = canvas.width, minY = canvas.height, maxX = -1, maxY = -1;
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      const lightness = (d[i] + d[i + 1] + d[i + 2]) / 3;
      // Light paper → transparent; darker ink keeps its colour with a soft edge.
      const alpha = d[i + 3] === 0 ? 0 : Math.max(0, Math.min(255, (225 - lightness) * 3.5));
      d[i + 3] = Math.min(d[i + 3], alpha);
      if (d[i + 3] > 20) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) throw new Error("No signature or stamp was found in that image.");
  ctx.putImageData(img, 0, 0);

  const pad = 6;
  const out = document.createElement("canvas");
  out.width = maxX - minX + 1 + pad * 2;
  out.height = maxY - minY + 1 + pad * 2;
  out.getContext("2d")!.drawImage(canvas, minX, minY, maxX - minX + 1, maxY - minY + 1, pad, pad, maxX - minX + 1, maxY - minY + 1);
  return out.toDataURL("image/png");
}

async function upload(kind: MediaKind, dataUrl: string) {
  const res = await uploadMediaAction(kind, dataUrl);
  if (!res.id) throw new Error(res.error || "Upload failed.");
  return res.id;
}

// ---------- Passport photo / stamp upload ----------

type FieldProps = {
  /** Name of the hidden input that carries the media id in the form */
  name: string;
  label: string;
  hint?: string;
  initialId?: string;
  kind: "photo" | "stamp";
  /** Notified when the id changes (for forms that also use it outside the hidden input) */
  onChange?: (id: string) => void;
};

export function ImageUploadField({ name, label, hint, initialId, kind, onChange }: FieldProps) {
  const [id, setId] = useState(initialId ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setId(initialId ?? ""), [initialId]);

  function set(next: string) {
    setId(next);
    onChange?.(next);
  }

  async function choose(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const img = await loadImage(file);
      const dataUrl = kind === "photo" ? toPassportPhoto(img) : toTransparentInk(img, img.naturalWidth, img.naturalHeight, 900);
      set(await upload(kind, dataUrl));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const isPhoto = kind === "photo";
  return (
    <div>
      <input type="hidden" name={name} value={id} />
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <div className="flex items-center gap-4">
        <div
          className={`grid shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200 ${
            isPhoto ? "h-[108px] w-[84px]" : "h-24 w-40"
          }`}
        >
          {busy ? (
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          ) : id ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(id)} alt={label} className={isPhoto ? "h-full w-full object-cover" : "max-h-full max-w-full object-contain p-1"} />
          ) : (
            <User className="h-8 w-8 text-slate-300" />
          )}
        </div>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-brand-300">
            <ImageUp className="h-4 w-4" /> {id ? "Change" : "Upload"} {isPhoto ? "photo" : "image"}
            <input type="file" accept="image/*" onChange={choose} className="sr-only" disabled={busy} />
          </label>
          {id && (
            <button type="button" onClick={() => set("")} className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:underline">
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          )}
        </div>
      </div>
      {hint && <span className="mt-1.5 block text-xs text-slate-400">{hint}</span>}
      {error && <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span>}
    </div>
  );
}

// ---------- Course photo (upload, or paste a link) ----------

/** Landscape 16:10 crop, 1280×800 JPEG — the shape used on course pages and cards. */
function toCover(img: HTMLImageElement) {
  const ratio = 16 / 10;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;
  if (sw / sh > ratio) sw = sh * ratio;
  else sh = sw / ratio;
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 800;
  canvas
    .getContext("2d")!
    .drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.85);
}

export function CoverImageField({ name, label, hint, initialUrl }: { name: string; label: string; hint?: string; initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function choose(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      setUrl(mediaUrl(await upload("cover", toCover(await loadImage(file)))));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={url} />
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <div className="flex flex-wrap items-start gap-4">
        <div className="grid aspect-[16/10] w-56 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200">
          {busy ? (
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          ) : url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={label} className="h-full w-full object-cover" />
          ) : (
            <ImageUp className="h-8 w-8 text-slate-300" />
          )}
        </div>
        <div className="min-w-56 flex-1 space-y-2">
          <label className="flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-brand-300">
            <ImageUp className="h-4 w-4" /> {url ? "Upload a different photo" : "Upload photo"}
            <input type="file" accept="image/*" onChange={choose} className="sr-only" disabled={busy} />
          </label>
          <input
            value={url.startsWith("/api/media/") ? "" : url}
            onChange={(e) => setUrl(e.target.value.trim())}
            placeholder={url.startsWith("/api/media/") ? "Uploaded photo in use" : "…or paste an image link (https://…)"}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-brand-400"
          />
          {url && (
            <button type="button" onClick={() => setUrl("")} className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:underline">
              <Trash2 className="h-3.5 w-3.5" /> Remove photo
            </button>
          )}
        </div>
      </div>
      {hint && <span className="mt-1.5 block text-xs text-slate-400">{hint}</span>}
      {error && <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span>}
    </div>
  );
}

// ---------- Signature (draw or upload) ----------

export function SignatureField({ name, label, hint, initialId }: { name: string; label: string; hint?: string; initialId?: string }) {
  const [id, setId] = useState(initialId ?? "");
  const [mode, setMode] = useState<"view" | "draw">(initialId ? "view" : "draw");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [hasInk, setHasInk] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    if (mode !== "draw") return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.lineWidth = 3.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1e2a78"; // blue ink
  }, [mode]);

  function point(e: React.PointerEvent<HTMLCanvasElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * e.currentTarget.width, y: ((e.clientY - r.top) / r.height) * e.currentTarget.height };
  }

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const ctx = e.currentTarget.getContext("2d")!;
    const p = point(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = e.currentTarget.getContext("2d")!;
    const p = point(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    setHasInk(true);
  }

  function clear() {
    const c = canvasRef.current;
    c?.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setHasInk(false);
  }

  async function save(work: () => string) {
    setError("");
    setBusy(true);
    try {
      setId(await upload("signature", work()));
      setMode("view");
      setHasInk(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function applyDrawing() {
    const c = canvasRef.current!;
    // Paint onto white first so the shared ink-trimming step works the same as for scans.
    const flat = document.createElement("canvas");
    flat.width = c.width;
    flat.height = c.height;
    const fctx = flat.getContext("2d")!;
    fctx.fillStyle = "#fff";
    fctx.fillRect(0, 0, flat.width, flat.height);
    fctx.drawImage(c, 0, 0);
    save(() => toTransparentInk(flat, flat.width, flat.height, 700));
  }

  async function chooseFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const img = await loadImage(file);
      save(() => toTransparentInk(img, img.naturalWidth, img.naturalHeight, 700));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={id} />
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>

      {mode === "view" && id ? (
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid h-24 w-64 place-items-center rounded-xl bg-white ring-1 ring-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mediaUrl(id)} alt="Signature" className="max-h-20 max-w-60 object-contain" />
          </div>
          <div className="space-y-2 text-sm">
            <button type="button" onClick={() => setMode("draw")} className="flex items-center gap-1.5 font-semibold text-brand-600 hover:underline">
              <PenLine className="h-4 w-4" /> Change signature
            </button>
            <button type="button" onClick={() => setId("")} className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:underline">
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-md">
          <div className="relative overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
            <canvas
              ref={canvasRef}
              width={700}
              height={220}
              onPointerDown={start}
              onPointerMove={move}
              onPointerUp={() => (drawing.current = false)}
              onPointerCancel={() => (drawing.current = false)}
              className="block aspect-[700/220] w-full cursor-crosshair touch-none"
              aria-label="Draw signature here"
            />
            {!hasInk && (
              <span className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-slate-300">Sign here with mouse or finger</span>
            )}
            <span className="pointer-events-none absolute inset-x-6 bottom-8 border-b border-dashed border-slate-200" />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={applyDrawing}
              disabled={!hasInk || busy}
              className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <PenLine className="h-4 w-4" />} Use this signature
            </button>
            <button type="button" onClick={clear} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-600 ring-1 ring-slate-200">
              <Eraser className="h-4 w-4" /> Clear
            </button>
            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-600 ring-1 ring-slate-200">
              <ImageUp className="h-4 w-4" /> Upload scan
              <input type="file" accept="image/*" onChange={chooseFile} className="sr-only" />
            </label>
            {id && (
              <button type="button" onClick={() => setMode("view")} className="text-sm text-slate-500 hover:underline">
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
      {hint && <span className="mt-1.5 block text-xs text-slate-400">{hint}</span>}
      {error && <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span>}
    </div>
  );
}
