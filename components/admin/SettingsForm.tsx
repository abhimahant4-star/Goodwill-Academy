"use client";

import { useActionState } from "react";
import { saveSettings } from "@/app/admin/actions";
import type { Settings } from "@/lib/types";

const fields: { key: keyof Settings; label: string; hint?: string }[] = [
  { key: "siteName", label: "Academy name" },
  { key: "phone", label: "Phone number", hint: "Shown on the website, e.g. +91 98765 43210" },
  { key: "whatsapp", label: "WhatsApp number", hint: "With country code, digits only, e.g. 919876543210" },
  { key: "email", label: "Email" },
  { key: "address", label: "Full address" },
  { key: "city", label: "City" },
  { key: "hours", label: "Opening hours" },
  { key: "mapEmbedUrl", label: "Google Maps embed URL", hint: "Google Maps → Share → Embed a map → copy the src link starting with https://www.google.com/maps/embed" },
  { key: "instagram", label: "Instagram URL" },
  { key: "facebook", label: "Facebook URL" },
  { key: "youtube", label: "YouTube URL" },
  { key: "signatory1Name", label: "Certificate signature 1 – name", hint: "Printed on the left signature line of certificates" },
  { key: "signatory1Title", label: "Certificate signature 1 – designation" },
  { key: "signatory2Name", label: "Certificate signature 2 – name", hint: "Printed on the right signature line of certificates" },
  { key: "signatory2Title", label: "Certificate signature 2 – designation" },
];

export function SettingsForm({ settings }: { settings: Settings }) {
  const [message, action, pending] = useActionState(saveSettings, null);
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
        {fields.map((f) => (
          <label key={f.key} className={f.key === "address" || f.key === "mapEmbedUrl" ? "block md:col-span-2" : "block"}>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">{f.label}</span>
            <input
              name={f.key}
              defaultValue={settings[f.key]}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            />
            {f.hint && <span className="mt-1 block text-xs text-slate-400">{f.hint}</span>}
          </label>
        ))}
      </div>
      {message && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">{message}</p>}
      <button disabled={pending} className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
        {pending ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
