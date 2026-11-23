"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { saveTeacherAction } from "@/app/admin/actions";
import { AdminField, adminField } from "./StudentForm";
import { SignatureField } from "./ImageField";
import type { Teacher } from "@/lib/types";

type CourseOption = { id: string; title: string; category: string };

export function TeacherForm({ teacher, courses }: { teacher?: Teacher; courses: CourseOption[] }) {
  const [error, action, pending] = useActionState(saveTeacherAction, null);
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState<string[]>(teacher?.courseIds ?? []);
  const groups = [...new Set(courses.map((c) => c.category))];

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="id" defaultValue={teacher?.id} />
      {selected.map((id) => (
        <input key={id} type="hidden" name="courseIds" value={id} />
      ))}

      <div className="grid gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
        <AdminField label="Teacher name *">
          <input name="name" required defaultValue={teacher?.name} className={adminField} />
        </AdminField>
        <AdminField label="Phone">
          <input name="phone" type="tel" defaultValue={teacher?.phone} className={adminField} />
        </AdminField>
        <AdminField label="Username *" hint="Used to sign in at /teacher/login. Lowercase letters, numbers, dot, dash, underscore.">
          <input
            name="username"
            required
            autoCapitalize="none"
            defaultValue={teacher?.username}
            pattern="[a-zA-Z0-9._-]{3,40}"
            className={adminField}
          />
        </AdminField>
        <AdminField
          label={teacher ? "New password" : "Password *"}
          hint={teacher ? "Leave empty to keep the current password. Changing it signs the teacher out everywhere." : "At least 8 characters."}
        >
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="password"
              type={show ? "text" : "password"}
              required={!teacher}
              minLength={8}
              autoComplete="new-password"
              className={`${adminField} pl-9 pr-10`}
            />
            <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label={show ? "Hide password" : "Show password"}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </AdminField>
        <label className="flex items-center gap-2 text-sm text-slate-700 md:col-span-2">
          <input type="checkbox" name="active" defaultChecked={teacher?.active ?? true} className="h-4 w-4 accent-brand-600" /> Account active (can sign in)
        </label>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-1 font-semibold text-slate-900">Signature</h2>
        <p className="mb-4 text-xs text-slate-500">
          Printed on certificates this teacher issues. Draw it with the mouse or finger, or upload a photo of the signature on white paper.
        </p>
        <SignatureField name="signatureId" label="Teacher signature" initialId={teacher?.signatureId} />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Assigned courses</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {selected.length ? `${selected.length} selected` : "All courses"}
          </span>
        </div>
        <p className="mb-4 text-xs text-slate-500">The teacher only sees and marks students of these courses. Select none to allow all courses.</p>
        <div className="grid gap-5 md:grid-cols-2">
          {groups.map((g) => (
            <div key={g}>
              <p className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">{g}</p>
              <div className="space-y-1.5">
                {courses.filter((c) => c.category === g).map((c) => (
                  <label key={c.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                    <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} className="h-4 w-4 accent-brand-600" />
                    {c.title}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">{error}</p>}

      <div className="flex gap-3">
        <button disabled={pending} className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
          {pending ? "Saving..." : teacher ? "Save Changes" : "Add Teacher"}
        </button>
        <Link href="/admin/teachers" className="rounded-xl px-6 py-3 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-white">
          Cancel
        </Link>
      </div>
    </form>
  );
}
