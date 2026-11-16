import { notFound } from "next/navigation";
import { TeacherForm } from "@/components/admin/TeacherForm";
import { getTeacher } from "@/lib/db";
import { getCourseOptions } from "@/lib/admin-data";

export const metadata = { title: "Edit Teacher" };

export default async function EditTeacherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [teacher, courses] = await Promise.all([getTeacher(id), getCourseOptions()]);
  if (!teacher) notFound();
  return (
    <>
      <h1 className="mb-6 font-display text-3xl font-bold text-brand-950">Edit: {teacher.name}</h1>
      <TeacherForm teacher={teacher} courses={courses} />
    </>
  );
}
