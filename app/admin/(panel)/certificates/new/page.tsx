import { CertificateForm } from "@/components/admin/CertificateForm";
import { getStudents, getTeachers } from "@/lib/db";
import { getCourseOptions } from "@/lib/admin-data";
import { todayIST } from "@/lib/attendance";

export const metadata = { title: "Create Certificate" };

export default async function NewCertificatePage({ searchParams }: { searchParams: Promise<{ student?: string }> }) {
  const { student } = await searchParams;
  const [students, courses, teachers] = await Promise.all([getStudents(), getCourseOptions(), getTeachers()]);
  return (
    <>
      <h1 className="mb-1 font-display text-3xl font-bold text-brand-950">Create Certificate</h1>
      <p className="mb-6 text-sm text-slate-500">
        Pick a student to auto-fill the details, or type them manually. A unique ID and QR code are generated automatically.
      </p>
      <CertificateForm
        students={students.map((s) => ({
          id: s.id,
          name: s.name,
          rollNo: s.rollNo,
          guardianName: s.guardianName,
          courseId: s.courseId,
          joinDate: s.joinDate,
          photoId: s.photoId ?? "",
          aadhaar: s.aadhaar ?? "",
        }))}
        courses={courses}
        teachers={teachers
          .filter((t) => t.active)
          .map((t) => ({ id: t.id, name: t.name, courseIds: t.courseIds, hasSignature: !!t.signatureId }))}
        initialStudent={student}
        today={todayIST()}
      />
    </>
  );
}
