import Link from "next/link";
import { CheckCircle2, Plus } from "lucide-react";
import { getCategories, getCourses } from "@/lib/db";
import { Icon } from "@/components/Icon";
import { CourseRowActions } from "@/components/admin/CourseRowActions";

export const metadata = { title: "Courses" };

export default async function AdminCoursesPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const [categories, courses] = await Promise.all([getCategories(), getCourses({ includeDrafts: true })]);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-1 font-display text-3xl font-bold text-brand-950">Courses</h1>
          <p className="text-sm text-slate-500">Edit course content, SEO keywords, fees and visibility.</p>
        </div>
        <Link href="/admin/courses/new" className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          <Plus className="h-4 w-4" /> Add Course
        </Link>
      </div>

      {saved && (
        <p className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
          <CheckCircle2 className="h-4 w-4" /> Course saved and website updated.
        </p>
      )}

      <div className="space-y-8">
        {categories.map((cat) => {
          const list = courses.filter((c) => c.categorySlug === cat.slug);
          return (
            <section key={cat.slug}>
              <h2 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
                <span className={`grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br ${cat.gradient} text-white`}>
                  <Icon name={cat.icon} className="h-4 w-4" />
                </span>
                {cat.name}
                <span className="text-sm font-normal text-slate-400">({list.length})</span>
              </h2>
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                {list.length === 0 && <p className="p-6 text-sm text-slate-400">No courses in this category.</p>}
                {list.map((c) => (
                  <div key={c.id} className="flex flex-wrap items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0">
                    <div className="min-w-0 flex-1">
                      <Link href={`/admin/courses/${c.id}`} className="font-medium text-slate-900 hover:text-brand-600">
                        {c.title}
                      </Link>
                      <p className="truncate text-xs text-slate-500">
                        {c.duration} · {c.topics.length} topics · {c.keywords.length} keywords
                      </p>
                    </div>
                    <CourseRowActions id={c.id} published={c.published} featured={c.featured} href={`/courses/${c.categorySlug}/${c.slug}`} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
