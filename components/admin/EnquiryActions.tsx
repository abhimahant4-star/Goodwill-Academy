"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { removeEnquiry, setEnquiryStatus } from "@/app/admin/actions";
import type { EnquiryStatus } from "@/lib/types";

const statuses: EnquiryStatus[] = ["new", "contacted", "enrolled", "closed"];

export function EnquiryActions({ id, status }: { id: string; status: EnquiryStatus }) {
  const [pending, start] = useTransition();
  return (
    <div className={`mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 ${pending ? "opacity-50" : ""}`}>
      <span className="text-xs text-slate-500">Mark as:</span>
      {statuses.map((s) => (
        <button
          key={s}
          disabled={pending || s === status}
          onClick={() => start(() => setEnquiryStatus(id, s))}
          className="rounded-full px-3 py-1 text-xs font-medium capitalize ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:bg-brand-600 disabled:text-white disabled:ring-brand-600"
        >
          {s}
        </button>
      ))}
      <button
        disabled={pending}
        onClick={() => confirm("Delete this enquiry permanently?") && start(() => removeEnquiry(id))}
        className="ml-auto flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-3.5 w-3.5" /> Delete
      </button>
    </div>
  );
}
