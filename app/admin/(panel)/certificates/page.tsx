import Link from "next/link";
import { Award, Plus, Search } from "lucide-react";
import { getCertificates } from "@/lib/db";
import { formatDate } from "@/lib/attendance";

export const metadata = { title: "Certificates" };

export default async function CertificatesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const all = await getCertificates();
  const query = q.trim().toLowerCase();
  const list = query
    ? all.filter((c) => [c.id, c.studentName, c.courseTitle, c.guardianName].some((v) => v.toLowerCase().includes(query)))
    : all;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-1 font-display text-3xl font-bold text-brand-950">Certificates</h1>
          <p className="text-sm text-slate-500">
            {all.length} issued · {all.filter((c) => c.status === "revoked").length} revoked. Every certificate has a QR code and unique ID
            students can verify on the website.
          </p>
        </div>
        <Link href="/admin/certificates/new" className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          <Plus className="h-4 w-4" /> Create Certificate
        </Link>
      </div>

      <form className="relative mb-6">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by certificate ID, student or course"
          className="w-full rounded-2xl border-0 bg-white py-3.5 pl-11 pr-4 text-sm shadow-sm ring-1 ring-slate-200 outline-none focus:ring-brand-300"
        />
      </form>

      {list.length === 0 ? (
        <div className="rounded-2xl bg-white p-16 text-center ring-1 ring-slate-200">
          <Award className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">{all.length ? "No certificates match your search." : "No certificates issued yet."}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-5 py-3">Certificate ID</th>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Issued</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60">
                  <td className="px-5 py-3">
                    <Link href={`/admin/certificates/${c.id}`} className="font-mono font-semibold text-brand-700 hover:underline">{c.id}</Link>
                  </td>
                  <td className="px-5 py-3 font-medium text-slate-900">{c.studentName}</td>
                  <td className="px-5 py-3 text-slate-600">{c.courseTitle}</td>
                  <td className="px-5 py-3 text-slate-600">{formatDate(c.issueDate)}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.status === "valid" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {c.status === "valid" ? "Valid" : "Revoked"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
