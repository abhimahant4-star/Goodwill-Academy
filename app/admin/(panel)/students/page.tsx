import Link from "next/link";
import { CheckCircle2, Plus, Search } from "lucide-react";
import { getAttendanceBook, getStudents } from "@/lib/db";
import { getCourseOptions } from "@/lib/admin-data";
import { percentColor, studentStats } from "@/lib/attendance";
import { maskAadhaar } from "@/lib/aadhaar";
import { StudentRowActions } from "@/components/admin/StudentRowActions";
import type { StudentStatus } from "@/lib/types";

export const metadata = { title: "Students" };

const statusStyle: Record<StudentStatus, string> = {
  active: "bg-emerald-100 text-emerald-700",
  completed: "bg-sky-100 text-sky-700",
  dropped: "bg-slate-100 text-slate-500",
};

type StudentSearch = { q?: string; course?: string; status?: string; saved?: string };

export default async function StudentsPage({ searchParams }: { searchParams: Promise<StudentSearch> }) {
  const { q = "", course = "", status = "", saved } = await searchParams;
  const [students, courses, book] = await Promise.all([getStudents(), getCourseOptions(), getAttendanceBook()]);
  const courseById = Object.fromEntries(courses.map((c) => [c.id, c]));

  const query = q.trim().toLowerCase();
  const list = students.filter(
    (s) =>
      (!course || s.courseId === course) &&
      (!status || s.status === status) &&
      (!query || [s.name, s.phone, s.rollNo, s.guardianName].some((v) => v.toLowerCase().includes(query))),
  );

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-1 font-display text-3xl font-bold text-brand-950">Students</h1>
          <p className="text-sm text-slate-500">{students.length} students registered · attendance % excludes approved leave.</p>
        </div>
        <Link href="/admin/students/new" className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          <Plus className="h-4 w-4" /> Add Student
        </Link>
      </div>

      {saved && (
        <p className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
          <CheckCircle2 className="h-4 w-4" /> Student saved.
        </p>
      )}

      <form className="mb-6 grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:grid-cols-[1fr_220px_160px_auto]">
        <label className="relative">
          <span className="sr-only">Search</span>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input name="q" defaultValue={q} placeholder="Search name, phone or roll no." className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-400" />
        </label>
        <select name="course" defaultValue={course} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" aria-label="Course">
          <option value="">All courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <select name="status" defaultValue={status} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" aria-label="Status">
          <option value="">All status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="dropped">Dropped</option>
        </select>
        <button className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">Filter</button>
      </form>

      {list.length === 0 ? (
        <div className="rounded-2xl bg-white p-16 text-center text-sm text-slate-400 ring-1 ring-slate-200">
          {students.length ? "No students match these filters." : "No students yet. Click “Add Student” to register your first student."}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-5 py-3">Roll No.</th>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Attendance</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((s) => {
                const st = studentStats(book, s.id);
                return (
                  <tr key={s.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">{s.rollNo}</td>
                    <td className="px-5 py-3">
                      <Link href={`/admin/students/${s.id}`} className="font-medium text-slate-900 hover:text-brand-600">{s.name}</Link>
                      <p className="text-xs text-slate-500">
                        {s.phone}
                        {s.batch && ` · ${s.batch}`}
                        {s.aadhaar && <span className="font-mono"> · Aadhaar {maskAadhaar(s.aadhaar)}</span>}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-slate-700">{courseById[s.courseId]?.title ?? "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`font-semibold ${percentColor(st.percent)}`}>{st.percent === null ? "—" : `${st.percent}%`}</span>
                      <span className="ml-1 text-xs text-slate-400">({st.present}/{st.present + st.absent})</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle[s.status]}`}>{s.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      <StudentRowActions id={s.id} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
