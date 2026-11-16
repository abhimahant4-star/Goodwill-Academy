import { AttendanceMarkView } from "@/components/attendance/AttendanceMarkView";
import { requireTeacher } from "@/lib/session";

export const metadata = { title: "Mark Attendance" };

export default async function TeacherAttendancePage({ searchParams }: { searchParams: Promise<{ date?: string; course?: string }> }) {
  const teacher = await requireTeacher();
  return (
    <AttendanceMarkView basePath="/teacher" reportPath="/teacher/report" search={await searchParams} courseIds={teacher.courseIds.length ? teacher.courseIds : undefined} />
  );
}
