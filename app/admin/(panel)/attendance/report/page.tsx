import { AttendanceReportView } from "@/components/attendance/AttendanceReportView";

export const metadata = { title: "Attendance Report" };

export default async function AttendanceReportPage({ searchParams }: { searchParams: Promise<{ month?: string; course?: string }> }) {
  return (
    <AttendanceReportView
      markPath="/admin/attendance"
      search={await searchParams}
      studentHref={(id) => `/admin/students/${id}`}
      generatedBy="Admin"
    />
  );
}
