"use client";

import { useActionState, useState } from "react";
import { saveSettings } from "@/app/admin/actions";
import { Stamp } from "@/components/certificate/Stamp";
import { ImageUploadField, SignatureField, mediaUrl } from "./ImageField";
import { AdminField, adminField } from "./StudentForm";
import type { Settings } from "@/lib/types";

/** Signatures and stamp printed on every certificate. Saves through the same settings action (only these fields). */
export function CertificateBrandingForm({ settings }: { settings: Settings }) {
  const [message, action, pending] = useActionState(saveSettings, null);
  const [lines, setLines] = useState<[string, string, string]>([settings.stampLine1, settings.stampLine2, settings.stampLine3]);
  const [stampImageId, setStampImageId] = useState(settings.stampImageId);

  const setLine = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = [...lines] as [string, string, string];
    next[i] = e.target.value;
    setLines(next);
  };

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
        <div className="md:col-span-2">
          <h2 className="font-semibold text-slate-900">Left signature — issuing teacher</h2>
          <p className="text-xs text-slate-500">
            Each certificate shows the signature of the teacher chosen when it's issued. Add signatures in Admin → Teachers.
          </p>
        </div>
        <AdminField label="Designation under the teacher's name">
          <input name="signatory1Title" defaultValue={settings.signatory1Title} className={adminField} />
        </AdminField>
        <AdminField label="Name to show when no teacher is selected" hint="Leave empty to show only the designation.">
          <input name="signatory1Name" defaultValue={settings.signatory1Name} className={adminField} />
        </AdminField>
      </div>

      <div className="grid gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
        <div className="md:col-span-2">
          <h2 className="font-semibold text-slate-900">Right signature — director</h2>
          <p className="text-xs text-slate-500">The academy stamp is placed over this signature.</p>
        </div>
        <AdminField label="Director name" hint="Optional.">
          <input name="signatory2Name" defaultValue={settings.signatory2Name} className={adminField} />
        </AdminField>
        <AdminField label="Designation">
          <input name="signatory2Title" defaultValue={settings.signatory2Title} className={adminField} />
        </AdminField>
        <div className="md:col-span-2">
          <SignatureField name="directorSignatureId" label="Director signature" initialId={settings.directorSignatureId} />
        </div>
      </div>

      <div className="grid gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
        <div className="md:col-span-2">
          <h2 className="font-semibold text-slate-900">Academy stamp</h2>
          <p className="text-xs text-slate-500">
            A digital copy of your rubber stamp is used by default. You can also upload a clear photo of the real stamp on white paper
            instead.
          </p>
        </div>
        <div className="space-y-3">
          <AdminField label="Stamp line 1">
            <input name="stampLine1" value={lines[0]} onChange={setLine(0)} className={adminField} />
          </AdminField>
          <AdminField label="Stamp line 2">
            <input name="stampLine2" value={lines[1]} onChange={setLine(1)} className={adminField} />
          </AdminField>
          <AdminField label="Stamp line 3">
            <input name="stampLine3" value={lines[2]} onChange={setLine(2)} className={adminField} />
          </AdminField>
        </div>
        <div>
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Preview on certificate</span>
          <div className="grid h-44 place-items-center rounded-xl bg-[#fffdf7] ring-1 ring-slate-200">
            {stampImageId ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mediaUrl(stampImageId)} alt="Uploaded stamp" className="max-h-32 max-w-[80%] -rotate-6 object-contain" />
            ) : (
              <Stamp id="settings-stamp" lines={lines} className="w-64 -rotate-6 opacity-90" />
            )}
          </div>
          <div className="mt-4">
            <ImageUploadField
              name="stampImageId"
              kind="stamp"
              label="Use a photo of the real stamp instead (optional)"
              hint="The white paper is removed automatically. Remove the photo to go back to the digital stamp."
              initialId={settings.stampImageId}
              onChange={setStampImageId}
            />
          </div>
        </div>
      </div>

      {message && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">{message}</p>}
      <button disabled={pending} className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
        {pending ? "Saving..." : "Save Certificate Design"}
      </button>
    </form>
  );
}
