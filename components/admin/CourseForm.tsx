"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveCourseAction } from "@/app/admin/actions";
import { Icon, iconNames } from "@/components/Icon";
import type { Category, Course } from "@/lib/types";

const field = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

export function CourseForm({ course, categories }: { course?: Course; categories: Category[] }) {
  const [error, action, pending] = useActionState(saveCourseAction, null);
  const [keywords, setKeywords] = useState((course?.keywords ?? []).join("\n"));
  const [icon, setIcon] = useState(course?.icon ?? "sparkles");
  const kwCount = keywords.split("\n").filter((k) => k.trim()).length;

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="id" defaultValue={course?.id} />
      <input type="hidden" name="icon" value={icon} />

      <div className="grid gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
        <h2 className="font-semibold text-slate-900 md:col-span-2">Basic details</h2>
        <Field label="Course title *">
          <input name="title" required defaultValue={course?.title} className={field} placeholder="e.g. Bridal Makeup Course" />
        </Field>
        <Field label="Category *">
          <select name="categorySlug" defaultValue={course?.categorySlug ?? categories[0]?.slug} className={field}>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="URL slug" hint="Leave empty to generate from the title. Changing it changes the page URL.">
          <input name="slug" defaultValue={course?.slug} className={field} placeholder="bridal-makeup-course" />
        </Field>
        <Field label="Display order" hint="Lower numbers appear first.">
          <input name="order" type="number" defaultValue={course?.order ?? 99} className={field} />
        </Field>
        <Field label="Duration">
          <input name="duration" defaultValue={course?.duration} className={field} placeholder="3 Months" />
        </Field>
        <Field label="Fees">
          <input name="fee" defaultValue={course?.fee} className={field} placeholder="₹15,000 or Contact for fees" />
        </Field>
        <Field label="Level">
          <input name="level" defaultValue={course?.level ?? "Beginner to Advanced"} className={field} />
        </Field>
        <Field label="Image URL (optional)" hint="Shown on course cards instead of the icon.">
          <input name="image" defaultValue={course?.image} className={field} placeholder="https://..." />
        </Field>
        <div className="md:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Icon</span>
          <div className="flex flex-wrap gap-2">
            {iconNames.map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setIcon(n)}
                className={`grid h-10 w-10 place-items-center rounded-xl ring-1 transition ${
                  icon === n ? "bg-brand-600 text-white ring-brand-600" : "bg-white text-slate-500 ring-slate-200 hover:ring-brand-300"
                }`}
                title={n}
              >
                <Icon name={n} className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-6 md:col-span-2">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="published" defaultChecked={course?.published ?? true} className="h-4 w-4 accent-brand-600" /> Published
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="featured" defaultChecked={course?.featured} className="h-4 w-4 accent-brand-600" /> Featured on homepage
          </label>
        </div>
      </div>

      <div className="grid gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="font-semibold text-slate-900">Content</h2>
        <Field label="Short description" hint="Shown on course cards (1 line).">
          <input name="shortDescription" defaultValue={course?.shortDescription} className={field} />
        </Field>
        <Field label="Full description">
          <textarea name="description" rows={5} defaultValue={course?.description} className={field} />
        </Field>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Topics / syllabus" hint="One topic per line.">
            <textarea name="topics" rows={8} defaultValue={course?.topics.join("\n")} className={field} />
          </Field>
          <Field label="Certificates" hint="One per line.">
            <textarea
              name="certificates"
              rows={8}
              defaultValue={(course?.certificates ?? ["International Certificate"]).join("\n")}
              className={field}
            />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">SEO keywords</h2>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${kwCount >= 10 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
            {kwCount} / min 10
          </span>
        </div>
        <textarea
          name="keywords"
          rows={10}
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className={field}
          placeholder={"best bridal makeup course in Chandigarh\nbridal makeup course in Mohali\n..."}
        />
        <p className="mt-1 text-xs text-slate-400">One keyword per line. Used in the page meta tags and in the &quot;Popular Searches&quot; section of the page.</p>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">{error}</p>}

      <div className="flex gap-3">
        <button disabled={pending} className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
          {pending ? "Saving..." : "Save Course"}
        </button>
        <Link href="/admin/courses" className="rounded-xl px-6 py-3 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-white">
          Cancel
        </Link>
      </div>
    </form>
  );
}
