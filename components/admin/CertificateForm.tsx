"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Award } from "lucide-react";
import { createCertificateAction } from "@/app/admin/actions";
import { AdminField, adminField } from "./StudentForm";

type StudentOption = { id: string; name: string; rollNo: string; guardianName: string; courseId: string; joinDate: string };
type CourseOption = { id: string; title: string; category: string; duration: string; certificates: string[] };

type Props = { students: StudentOption[]; courses: CourseOption[]; initialStudent?: string; today: string };

const GRADES = ["A+", "A", "B+", "B", "C", "Distinction", "First Division", ""];

function fromStudent(s: StudentOption | undefined, courses: CourseOption[], today: string) {
  const course = courses.find((c) => c.id === s?.courseId);
  return {
    studentId: s?.id ?? "",
    studentName: s?.name ?? "",
    guardianName: s?.guardianName ?? "",
    courseTitle: course?.title ?? "",
    duration: course?.duration ?? "",
    certificateType: course?.certificates[0] ?? "International Certificate",
    startDate: s?.joinDate ?? "",
    endDate: s ? today : "",
  };
}

export function CertificateForm({ students, courses, initialStudent, today }: Props) {
  const [error, action, pending] = useActionState(createCertificateAction, null);
  const [v, setV] = useState(() => fromStudent(students.find((s) => s.id === initialStudent), courses, today));
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setV({ ...v, [k]: e.target.value });
  const courseTypes = courses.find((c) => c.title === v.courseTitle)?.certificates ?? [];
  const typeOptions = [...new Set([...courseTypes, "International Certificate", "Salon Certificate", "Certificate of Completion"])];

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="studentId" value={v.studentId} />

      <div className="rounded-2xl bg-gradient-to-r from-brand-50 to-gold-300/20 p-5 ring-1 ring-brand-100">
        <AdminField label="Student (optional)" hint="Selecting a student fills in their details and marks them as completed.">
          <select
            value={v.studentId}
            onChange={(e) => setV(fromStudent(students.find((s) => s.id === e.target.value), courses, today))}
            className={adminField}
          >
            <option value="">— Manual entry —</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
            ))}
          </select>
        </AdminField>
      </div>

      <div className="grid gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
        <AdminField label="Student name (as printed) *">
          <input name="studentName" required value={v.studentName} onChange={set("studentName")} className={adminField} />
        </AdminField>
        <div className="grid grid-cols-[110px_1fr] gap-3">
          <AdminField label="Relation">
            <select name="relation" defaultValue="D/o" className={adminField}>
              <option value="S/o">S/o</option>
              <option value="D/o">D/o</option>
              <option value="W/o">W/o</option>
            </select>
          </AdminField>
          <AdminField label="Father's / Husband's name">
            <input name="guardianName" value={v.guardianName} onChange={set("guardianName")} className={adminField} />
          </AdminField>
        </div>
        <AdminField label="Course *">
          <input name="courseTitle" required list="course-list" value={v.courseTitle} onChange={set("courseTitle")} className={adminField} />
          <datalist id="course-list">
            {courses.map((c) => (
              <option key={c.id} value={c.title} />
            ))}
          </datalist>
        </AdminField>
        <AdminField label="Duration">
          <input name="duration" value={v.duration} onChange={set("duration")} className={adminField} placeholder="3 Months" />
        </AdminField>
        <AdminField label="Certificate type">
          <select name="certificateType" value={v.certificateType} onChange={set("certificateType")} className={adminField}>
            {typeOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Grade">
          <select name="grade" defaultValue="A" className={adminField}>
            {GRADES.map((g) => (
              <option key={g} value={g}>{g || "— No grade —"}</option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Course start date">
          <input name="startDate" type="date" value={v.startDate} onChange={set("startDate")} className={adminField} />
        </AdminField>
        <AdminField label="Course end date">
          <input name="endDate" type="date" value={v.endDate} onChange={set("endDate")} className={adminField} />
        </AdminField>
        <AdminField label="Date of issue *">
          <input name="issueDate" type="date" required defaultValue={today} className={adminField} />
        </AdminField>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">{error}</p>}

      <div className="flex gap-3">
        <button disabled={pending} className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
          <Award className="h-4 w-4" /> {pending ? "Generating..." : "Generate Certificate"}
        </button>
        <Link href="/admin/certificates" className="rounded-xl px-6 py-3 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-white">
          Cancel
        </Link>
      </div>
    </form>
  );
}
