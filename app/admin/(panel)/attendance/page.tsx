import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { getAttendanceFor, getStudents } from "@/lib/db";
import { getCourseOptions } from "@/lib/admin-data";
import { isValidDate, todayIST } from "@/lib/attendance";
import { AttendanceSheet } from "@/components/admin/AttendanceSheet";

export const metadata = { title: "Attendance" };

export default async function AttendancePage({ searchParams }: { searchParams: Promise<{ date?: string; course?: string }> }) {
  const sp = await searchParams;
  const today = todayIST();
  const date = isValidDate(sp.date) && sp.date <= today ? sp.date : today;
  const course = sp.course ?? "";

  const [students, courses, marks] = await Promise.all([getStudents(), getCourseOptions(), getAttendanceFor(date)]);
  const courseTitle = Object.fromEntries(courses.map((c) => [c.id, c.title]));

  // Students who were enrolled on that date; dropped/completed students still show if already marked that day.
  const roster = students
    .filter((s) => (!course || s.courseId === course) && s.joinDate <= date && (s.status === "active" || marks[s.id]))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((s) => ({ id: s.id, name: s.name, rollNo: s.rollNo, batch: s.batch, course: courseTitle[s.courseId] ?? "—" }));

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-1 font-display text-3xl font-bold text-brand-950">Mark Attendance</h1>
          <p className="text-sm text-slate-500">Choose a date and course, mark each student, then save.</p>
        </div>
        <Link
          href={`/admin/attendance/report?month=${date.slice(0, 7)}${course ? `&course=${course}` : ""}`}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-brand-300"
        >
          <BarChart3 className="h-4 w-4" /> Attendance Report
        </Link>
      </div>
      <AttendanceSheet
        key={`${date}-${course}`}
        date={date}
        today={today}
        course={course}
        courses={courses.map((c) => ({ id: c.id, title: c.title }))}
        students={roster}
        initial={marks}
      />
    </>
  );
}
