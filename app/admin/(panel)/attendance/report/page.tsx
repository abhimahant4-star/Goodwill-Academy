import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAttendanceRange, getStudents } from "@/lib/db";
import { getCourseOptions } from "@/lib/admin-data";
import { daysInMonth, percentColor, studentStats, todayIST } from "@/lib/attendance";
import { PrintButton } from "@/components/admin/PrintButton";

export const metadata = { title: "Attendance Report" };

const cell: Record<string, string> = {
  P: "bg-emerald-500 text-white",
  A: "bg-red-500 text-white",
  L: "bg-amber-400 text-amber-950",
};

export default async function AttendanceReportPage({ searchParams }: { searchParams: Promise<{ month?: string; course?: string }> }) {
  const sp = await searchParams;
  const today = todayIST();
  const month = /^\d{4}-\d{2}$/.test(sp.month ?? "") ? sp.month! : today.slice(0, 7);
  const course = sp.course ?? "";
  const days = daysInMonth(month);
  const from = `${month}-01`;
  const to = `${month}-${String(days).padStart(2, "0")}`;

  const [students, courses, book] = await Promise.all([getStudents(), getCourseOptions(), getAttendanceRange(from, to)]);
  const courseTitle = Object.fromEntries(courses.map((c) => [c.id, c.title]));
  const roster = students
    .filter((s) => (!course || s.courseId === course) && s.joinDate <= to)
    .filter((s) => s.status === "active" || Object.values(book).some((d) => d[s.id]))
    .sort((a, b) => a.name.localeCompare(b.name));

  const dayList = Array.from({ length: days }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`);
  const monthLabel = new Date(`${from}T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <Link href="/admin/attendance" className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600">
            <ArrowLeft className="h-4 w-4" /> Mark attendance
          </Link>
          <h1 className="font-display text-3xl font-bold text-brand-950">Attendance Report</h1>
        </div>
        <PrintButton label="Print Report" />
      </div>

      <form className="mb-6 flex flex-wrap gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 print:hidden">
        <input type="month" name="month" defaultValue={month} max={today.slice(0, 7)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" aria-label="Month" />
        <select name="course" defaultValue={course} className="min-w-56 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm" aria-label="Course">
          <option value="">All courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <button className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white">Show</button>
      </form>

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            {monthLabel} · {course ? courseTitle[course] : "All courses"}
          </h2>
          <div className="flex gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><i className="h-3 w-3 rounded bg-emerald-500" /> Present</span>
            <span className="flex items-center gap-1"><i className="h-3 w-3 rounded bg-red-500" /> Absent</span>
            <span className="flex items-center gap-1"><i className="h-3 w-3 rounded bg-amber-400" /> Leave</span>
          </div>
        </div>

        {roster.length === 0 ? (
          <p className="p-16 text-center text-sm text-slate-400">No students for this month.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500">
                  <th className="sticky left-0 z-10 min-w-48 bg-slate-50 px-4 py-2 text-left font-semibold">Student</th>
                  {dayList.map((d) => {
                    const dow = new Date(`${d}T00:00:00`).getDay();
                    return (
                      <th key={d} className={`w-7 px-0.5 py-2 text-center font-medium ${dow === 0 ? "text-red-400" : ""}`}>
                        {Number(d.slice(-2))}
                      </th>
                    );
                  })}
                  <th className="px-2 py-2 text-center font-semibold">P</th>
                  <th className="px-2 py-2 text-center font-semibold">A</th>
                  <th className="px-2 py-2 text-center font-semibold">L</th>
                  <th className="px-3 py-2 text-center font-semibold">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roster.map((s) => {
                  const st = studentStats(book, s.id);
                  return (
                    <tr key={s.id}>
                      <td className="sticky left-0 z-10 bg-white px-4 py-2">
                        <Link href={`/admin/students/${s.id}`} className="font-medium text-slate-900 hover:text-brand-600">{s.name}</Link>
                        <p className="text-[10px] text-slate-400">{s.rollNo} · {courseTitle[s.courseId] ?? "—"}</p>
                      </td>
                      {dayList.map((d) => {
                        const m = book[d]?.[s.id];
                        const sunday = new Date(`${d}T00:00:00`).getDay() === 0;
                        return (
                          <td key={d} className="px-0.5 py-2 text-center">
                            <span className={`mx-auto grid h-6 w-6 place-items-center rounded-md text-[10px] font-bold ${m ? cell[m] : sunday || d > today || d < s.joinDate ? "" : "bg-slate-100 text-slate-300"}`}>
                              {m ?? ""}
                            </span>
                          </td>
                        );
                      })}
                      <td className="px-2 text-center font-semibold text-emerald-600">{st.present}</td>
                      <td className="px-2 text-center font-semibold text-red-600">{st.absent}</td>
                      <td className="px-2 text-center font-semibold text-amber-600">{st.leave}</td>
                      <td className={`px-3 text-center text-sm font-bold ${percentColor(st.percent)}`}>
                        {st.percent === null ? "—" : `${st.percent}%`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
