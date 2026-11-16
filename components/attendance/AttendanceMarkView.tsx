import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { getAttendanceFor, getStudents } from "@/lib/db";
import { getCourseOptions } from "@/lib/admin-data";
import { isValidDate, todayIST } from "@/lib/attendance";
import { AttendanceSheet } from "./AttendanceSheet";

type Props = {
  basePath: string;
  reportPath: string;
  search: { date?: string; course?: string };
  /** Restrict to these courses (teachers); undefined = all */
  courseIds?: string[];
  addStudentHref?: string;
};

/** "Mark Attendance" screen used by both the admin and the teacher panel. */
export async function AttendanceMarkView({ basePath, reportPath, search, courseIds, addStudentHref }: Props) {
  const today = todayIST();
  const date = isValidDate(search.date) && search.date <= today ? search.date : today;

  const [students, allCourses, marks] = await Promise.all([getStudents({ courseIds }), getCourseOptions(), getAttendanceFor(date)]);
  const courses = courseIds ? allCourses.filter((c) => courseIds.includes(c.id)) : allCourses;
  // A teacher with exactly one course always works in that course.
  const course = courses.some((c) => c.id === search.course) ? search.course! : courses.length === 1 ? courses[0].id : "";
  const courseTitle = Object.fromEntries(courses.map((c) => [c.id, c.title]));

  // Students who were enrolled on that date; dropped/completed students still show if already marked that day.
  const roster = students
    .filter((s) => courseTitle[s.courseId] && (!course || s.courseId === course))
    .filter((s) => s.joinDate <= date && (s.status === "active" || marks[s.id]))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((s) => ({ id: s.id, name: s.name, rollNo: s.rollNo, batch: s.batch, course: courseTitle[s.courseId] }));
  const rosterMarks = Object.fromEntries(roster.filter((s) => marks[s.id]).map((s) => [s.id, marks[s.id]]));

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-1 font-display text-3xl font-bold text-brand-950">Mark Attendance</h1>
          <p className="text-sm text-slate-500">Choose a date and course, mark each student, then save.</p>
        </div>
        <Link
          href={`${reportPath}?month=${date.slice(0, 7)}${course ? `&course=${course}` : ""}`}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-brand-300"
        >
          <BarChart3 className="h-4 w-4" /> Attendance Report
        </Link>
      </div>
      <AttendanceSheet
        key={`${date}-${course}`}
        basePath={basePath}
        addStudentHref={addStudentHref}
        date={date}
        today={today}
        course={course}
        courses={courses.map((c) => ({ id: c.id, title: c.title }))}
        students={roster}
        initial={rosterMarks}
      />
    </>
  );
}
