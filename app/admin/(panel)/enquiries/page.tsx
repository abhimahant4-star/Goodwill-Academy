import { Mail, Phone } from "lucide-react";
import { getEnquiries } from "@/lib/db";
import { EnquiryActions } from "@/components/admin/EnquiryActions";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { EnquiryStatus } from "@/lib/types";

export const metadata = { title: "Enquiries" };

const filters: (EnquiryStatus | "all")[] = ["all", "new", "contacted", "enrolled", "closed"];

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = "all" } = await searchParams;
  const all = await getEnquiries();
  const list = status === "all" ? all : all.filter((e) => e.status === status);

  return (
    <>
      <h1 className="mb-1 font-display text-3xl font-bold text-brand-950">Enquiries</h1>
      <p className="mb-6 text-sm text-slate-500">Leads submitted from the website enquiry forms.</p>

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const count = f === "all" ? all.length : all.filter((e) => e.status === f).length;
          return (
            <a
              key={f}
              href={f === "all" ? "/admin/enquiries" : `/admin/enquiries?status=${f}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ring-1 transition ${
                status === f ? "bg-brand-600 text-white ring-brand-600" : "bg-white text-slate-600 ring-slate-200 hover:ring-brand-300"
              }`}
            >
              {f} ({count})
            </a>
          );
        })}
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl bg-white p-16 text-center text-sm text-slate-400 ring-1 ring-slate-200">No enquiries here.</div>
      ) : (
        <div className="space-y-3">
          {list.map((e) => (
            <div key={e.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{e.name}</p>
                    <StatusBadge status={e.status} />
                  </div>
                  <p className="mt-0.5 text-sm text-brand-600">{e.course || "General enquiry"}</p>
                </div>
                <time className="text-xs text-slate-400" dateTime={e.createdAt}>
                  {new Date(e.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </time>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <a href={`tel:${e.phone}`} className="flex items-center gap-1.5 text-slate-700 hover:text-brand-600">
                  <Phone className="h-4 w-4" /> {e.phone}
                </a>
                <a
                  href={`https://wa.me/${e.phone.replace(/\D/g, "").replace(/^(\d{10})$/, "91$1")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline"
                >
                  WhatsApp
                </a>
                {e.email && (
                  <a href={`mailto:${e.email}`} className="flex items-center gap-1.5 text-slate-700 hover:text-brand-600">
                    <Mail className="h-4 w-4" /> {e.email}
                  </a>
                )}
              </div>
              {e.message && <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{e.message}</p>}
              <EnquiryActions id={e.id} status={e.status} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
