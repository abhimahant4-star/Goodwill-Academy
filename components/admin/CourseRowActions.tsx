"use client";

import Link from "next/link";
import { useTransition } from "react";
import { ExternalLink, Pencil, Star, Trash2 } from "lucide-react";
import { removeCourse, toggleCourse } from "@/app/admin/actions";

type Props = { id: string; published: boolean; featured: boolean; href: string };

export function CourseRowActions({ id, published, featured, href }: Props) {
  const [pending, start] = useTransition();
  return (
    <div className={`flex items-center gap-2 ${pending ? "opacity-50" : ""}`}>
      <button
        disabled={pending}
        onClick={() => start(() => toggleCourse(id, "published"))}
        className={`rounded-full px-3 py-1 text-xs font-semibold ${published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
        title="Toggle visibility on website"
      >
        {published ? "Published" : "Draft"}
      </button>
      <button
        disabled={pending}
        onClick={() => start(() => toggleCourse(id, "featured"))}
        className={`grid h-8 w-8 place-items-center rounded-lg ${featured ? "text-amber-500" : "text-slate-300 hover:text-slate-500"}`}
        title={featured ? "Featured on homepage" : "Feature on homepage"}
      >
        <Star className={`h-4 w-4 ${featured ? "fill-current" : ""}`} />
      </button>
      {published && (
        <a href={href} target="_blank" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:text-slate-700" title="View on website">
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
      <Link href={`/admin/courses/${id}`} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:text-brand-600" title="Edit">
        <Pencil className="h-4 w-4" />
      </Link>
      <button
        disabled={pending}
        onClick={() => confirm("Delete this course permanently? Its page will be removed from the website.") && start(() => removeCourse(id))}
        className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:text-red-600"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
