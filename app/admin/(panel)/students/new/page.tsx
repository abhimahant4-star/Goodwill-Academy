import { StudentForm } from "@/components/admin/StudentForm";
import { getCourseOptions } from "@/lib/admin-data";
import { todayIST } from "@/lib/attendance";

export const metadata = { title: "Add Student" };

export default async function NewStudentPage() {
  const courses = await getCourseOptions();
  return (
    <>
      <h1 className="mb-6 font-display text-3xl font-bold text-brand-950">Add Student</h1>
      <StudentForm courses={courses} today={todayIST()} />
    </>
  );
}
