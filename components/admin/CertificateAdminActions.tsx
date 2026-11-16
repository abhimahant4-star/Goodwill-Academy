"use client";

import { useTransition } from "react";
import { Ban, RotateCcw, Trash2 } from "lucide-react";
import { removeCertificate, setCertificateStatus } from "@/app/admin/actions";
import type { CertificateStatus } from "@/lib/types";

export function CertificateAdminActions({ id, status }: { id: string; status: CertificateStatus }) {
  const [pending, start] = useTransition();
  return (
    <div className={`flex flex-wrap items-center gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 ${pending ? "opacity-60" : ""}`}>
      <div className="mr-auto text-sm">
        <p className="font-semibold text-slate-900">Verification status: {status === "valid" ? "Valid" : "Revoked"}</p>
        <p className="text-slate-500">Revoking keeps the record but shows the certificate as invalid when someone verifies it.</p>
      </div>
      {status === "valid" ? (
        <button
          disabled={pending}
          onClick={() => confirm("Revoke this certificate? Verification will show it as invalid.") && start(() => setCertificateStatus(id, "revoked"))}
          className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100"
        >
          <Ban className="h-4 w-4" /> Revoke
        </button>
      ) : (
        <button
          disabled={pending}
          onClick={() => start(() => setCertificateStatus(id, "valid"))}
          className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
        >
          <RotateCcw className="h-4 w-4" /> Restore
        </button>
      )}
      <button
        disabled={pending}
        onClick={() => confirm("Delete this certificate permanently? Its ID will no longer verify.") && start(() => removeCertificate(id))}
        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" /> Delete
      </button>
    </div>
  );
}
