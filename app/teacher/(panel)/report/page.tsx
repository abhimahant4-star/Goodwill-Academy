import { AttendanceReportView } from "@/components/attendance/AttendanceReportView";
import { requireTeacher } from "@/lib/session";

export const metadata = { title: "Attendance Report" };

export default async function TeacherReportPage({ searchParams }: { searchParams: Promise<{ month?: string; course?: string }> }) {
  const teacher = await requireTeacher();
  return (
    <AttendanceReportView
      markPath="/teacher"
      search={await searchParams}
      courseIds={teacher.courseIds.length ? teacher.courseIds : undefined}
      generatedBy={teacher.name}
    />
  );
}
