"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { removeTeacher, toggleTeacherActive } from "@/app/admin/actions";

export function TeacherRowActions({ id, active }: { id: string; active: boolean }) {
  const [pending, start] = useTransition();
  return (
    <div className={`flex items-center justify-end gap-2 ${pending ? "opacity-50" : ""}`}>
      <button
        disabled={pending}
        onClick={() => start(() => toggleTeacherActive(id))}
        className={`rounded-full px-3 py-1 text-xs font-semibold ${active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
        title={active ? "Click to disable sign-in" : "Click to enable sign-in"}
      >
        {active ? "Active" : "Disabled"}
      </button>
      <Link href={`/admin/teachers/${id}`} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:text-brand-600" title="Edit">
        <Pencil className="h-4 w-4" />
      </Link>
      <button
        disabled={pending}
        onClick={() => confirm("Delete this teacher account? Attendance they marked is kept.") && start(() => removeTeacher(id))}
        className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:text-red-600"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
