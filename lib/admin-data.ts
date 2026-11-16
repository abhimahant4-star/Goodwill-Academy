import { getCategories, getCourses } from "./db";

/** Courses (including drafts) with their category name, for admin dropdowns and labels. */
export async function getCourseOptions() {
  const [courses, categories] = await Promise.all([getCourses({ includeDrafts: true }), getCategories()]);
  const catName = Object.fromEntries(categories.map((c) => [c.slug, c.shortName]));
  return courses.map((c) => ({
    id: c.id,
    title: c.title,
    category: catName[c.categorySlug] ?? "Other",
    duration: c.duration,
    certificates: c.certificates,
  }));
}
