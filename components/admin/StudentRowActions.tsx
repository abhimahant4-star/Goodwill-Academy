"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Award, Pencil, Trash2 } from "lucide-react";
import { removeStudent } from "@/app/admin/actions";

export function StudentRowActions({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <div className={`flex justify-end gap-1 ${pending ? "opacity-50" : ""}`}>
      <Link href={`/admin/certificates/new?student=${id}`} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:text-amber-600" title="Issue certificate">
        <Award className="h-4 w-4" />
      </Link>
      <Link href={`/admin/students/${id}`} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:text-brand-600" title="Edit">
        <Pencil className="h-4 w-4" />
      </Link>
      <button
        disabled={pending}
        onClick={() => confirm("Delete this student and their attendance records? Issued certificates stay valid.") && start(() => removeStudent(id))}
        className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:text-red-600"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
