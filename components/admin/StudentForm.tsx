"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveStudentAction } from "@/app/admin/actions";
import type { Student } from "@/lib/types";

export const adminField =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100";

export function AdminField({ label, hint, className, children }: { label: string; hint?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

type CourseOption = { id: string; title: string; category: string };

export function StudentForm({ student, courses, today }: { student?: Student; courses: CourseOption[]; today: string }) {
  const [error, action, pending] = useActionState(saveStudentAction, null);
  const groups = [...new Set(courses.map((c) => c.category))];

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="id" defaultValue={student?.id} />
      <div className="grid gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
        <AdminField label="Student name *">
          <input name="name" required defaultValue={student?.name} className={adminField} />
        </AdminField>
        <AdminField label="Father's / Husband's name" hint="Printed on the certificate as S/o, D/o or W/o.">
          <input name="guardianName" defaultValue={student?.guardianName} className={adminField} />
        </AdminField>
        <AdminField label="Phone *">
          <input name="phone" type="tel" required defaultValue={student?.phone} className={adminField} />
        </AdminField>
        <AdminField label="Email">
          <input name="email" type="email" defaultValue={student?.email} className={adminField} />
        </AdminField>
        <AdminField label="Course *">
          <select name="courseId" required defaultValue={student?.courseId ?? ""} className={adminField}>
            <option value="" disabled>Select course</option>
            {groups.map((g) => (
              <optgroup key={g} label={g}>
                {courses.filter((c) => c.category === g).map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </AdminField>
        <AdminField label="Batch / timing" hint="e.g. Morning 10–12">
          <input name="batch" defaultValue={student?.batch} className={adminField} />
        </AdminField>
        <AdminField label="Joining date *">
          <input name="joinDate" type="date" required defaultValue={student?.joinDate ?? today} className={adminField} />
        </AdminField>
        <AdminField label="Status">
          <select name="status" defaultValue={student?.status ?? "active"} className={adminField}>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="dropped">Dropped</option>
          </select>
        </AdminField>
      </div>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">{error}</p>}
      <div className="flex gap-3">
        <button disabled={pending} className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
          {pending ? "Saving..." : student ? "Save Changes" : "Add Student"}
        </button>
        <Link href="/admin/students" className="rounded-xl px-6 py-3 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-white">
          Cancel
        </Link>
      </div>
    </form>
  );
}
