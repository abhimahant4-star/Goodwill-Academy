import { TeacherForm } from "@/components/admin/TeacherForm";
import { getCourseOptions } from "@/lib/admin-data";

export const metadata = { title: "Add Teacher" };

export default async function NewTeacherPage() {
  return (
    <>
      <h1 className="mb-6 font-display text-3xl font-bold text-brand-950">Add Teacher</h1>
      <TeacherForm courses={await getCourseOptions()} />
    </>
  );
}
