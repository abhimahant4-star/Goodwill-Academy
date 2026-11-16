import { CourseForm } from "@/components/admin/CourseForm";
import { getCategories } from "@/lib/db";

export const metadata = { title: "Add Course" };

export default async function NewCoursePage() {
  const categories = await getCategories();
  return (
    <>
      <h1 className="mb-6 font-display text-3xl font-bold text-brand-950">Add Course</h1>
      <CourseForm categories={categories} />
    </>
  );
}
