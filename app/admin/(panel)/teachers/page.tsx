import Link from "next/link";
import { CheckCircle2, ExternalLink, Plus, UserCog } from "lucide-react";
import { getTeachers } from "@/lib/db";
import { getCourseOptions } from "@/lib/admin-data";
import { TeacherRowActions } from "@/components/admin/TeacherRowActions";

export const metadata = { title: "Teachers" };

export default async function TeachersPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const [teachers, courses] = await Promise.all([getTeachers(), getCourseOptions()]);
  const courseTitle = Object.fromEntries(courses.map((c) => [c.id, c.title]));

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-1 font-display text-3xl font-bold text-brand-950">Teachers</h1>
          <p className="text-sm text-slate-500">
            Teacher accounts can only mark daily attendance and generate attendance reports for their courses.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/teacher/login"
            target="_blank"
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-brand-300"
          >
            <ExternalLink className="h-4 w-4" /> Teacher login page
          </a>
          <Link href="/admin/teachers/new" className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            <Plus className="h-4 w-4" /> Add Teacher
          </Link>
        </div>
      </div>

      {saved && (
        <p className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
          <CheckCircle2 className="h-4 w-4" /> Teacher saved.
        </p>
      )}

      {teachers.length === 0 ? (
        <div className="rounded-2xl bg-white p-16 text-center ring-1 ring-slate-200">
          <UserCog className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">No teacher accounts yet. Add one so teachers can mark attendance.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-5 py-3">Teacher</th>
                <th className="px-5 py-3">Username</th>
                <th className="px-5 py-3">Courses</th>
                <th className="px-5 py-3 text-right">Status &amp; actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60">
                  <td className="px-5 py-3">
                    <Link href={`/admin/teachers/${t.id}`} className="font-medium text-slate-900 hover:text-brand-600">{t.name}</Link>
                    {t.phone && <p className="text-xs text-slate-500">{t.phone}</p>}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-600">{t.username}</td>
                  <td className="px-5 py-3 text-slate-600">
                    {t.courseIds.length ? t.courseIds.map((id) => courseTitle[id] ?? "Deleted course").join(", ") : <span className="text-slate-400">All courses</span>}
                  </td>
                  <td className="px-5 py-3">
                    <TeacherRowActions id={t.id} active={t.active} />
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
