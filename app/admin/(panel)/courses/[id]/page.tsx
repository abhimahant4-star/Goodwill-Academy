import { notFound } from "next/navigation";
import { CourseForm } from "@/components/admin/CourseForm";
import { getCategories, getCourseById } from "@/lib/db";

export const metadata = { title: "Edit Course" };

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [course, categories] = await Promise.all([getCourseById(id), getCategories()]);
  if (!course) notFound();
  return (
    <>
      <h1 className="mb-6 font-display text-3xl font-bold text-brand-950">Edit: {course.title}</h1>
      <CourseForm course={course} categories={categories} />
    </>
  );
}
