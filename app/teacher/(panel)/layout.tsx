import type { Metadata } from "next";
import { TeacherSidebar } from "@/components/attendance/TeacherSidebar";
import { getCourseOptions } from "@/lib/admin-data";
import { requireTeacher } from "@/lib/session";

export const metadata: Metadata = {
  title: { default: "Attendance", template: "%s | Goodwill Teacher" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const teacher = await requireTeacher();
  const courses = await getCourseOptions();
  const courseNames = teacher.courseIds.length
    ? courses.filter((c) => teacher.courseIds.includes(c.id)).map((c) => c.title)
    : ["All courses"];

  return (
    <div className="min-h-screen bg-slate-50 lg:pl-64 print:bg-white print:pl-0">
      <TeacherSidebar name={teacher.name} courses={courseNames} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</div>
    </div>
  );
}
