import { AttendanceMarkView } from "@/components/attendance/AttendanceMarkView";

export const metadata = { title: "Attendance" };

export default async function AttendancePage({ searchParams }: { searchParams: Promise<{ date?: string; course?: string }> }) {
  return (
    <AttendanceMarkView
      basePath="/admin/attendance"
      reportPath="/admin/attendance/report"
      search={await searchParams}
      addStudentHref="/admin/students/new"
    />
  );
}
