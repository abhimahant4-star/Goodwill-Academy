import type { EnquiryStatus } from "@/lib/types";

const styles: Record<EnquiryStatus, string> = {
  new: "bg-rose-100 text-rose-700",
  contacted: "bg-sky-100 text-sky-700",
  enrolled: "bg-emerald-100 text-emerald-700",
  closed: "bg-slate-100 text-slate-600",
};

export function StatusBadge({ status }: { status: EnquiryStatus }) {
  return <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status]}`}>{status}</span>;
}
