"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Award } from "lucide-react";
import { createCertificateAction } from "@/app/admin/actions";
import { AdminField, adminField } from "./StudentForm";
import { ImageUploadField } from "./ImageField";
import { formatAadhaar, maskAadhaar } from "@/lib/aadhaar";

type StudentOption = { id: string; name: string; rollNo: string; guardianName: string; courseId: string; joinDate: string; photoId: string; aadhaar: string };
type CourseOption = { id: string; title: string; category: string; duration: string; certificates: string[] };
type TeacherOption = { id: string; name: string; courseIds: string[]; hasSignature: boolean };

type Props = { students: StudentOption[]; courses: CourseOption[]; teachers: TeacherOption[]; initialStudent?: string; today: string };

/** Suggest the teacher who teaches the student's course (and has a signature), else the first one with a signature. */
function suggestTeacher(teachers: TeacherOption[], courseId?: string) {
  const signed = teachers.filter((t) => t.hasSignature);
  return (
    signed.find((t) => courseId && t.courseIds.includes(courseId)) ??
    signed.find((t) => t.courseIds.length === 0) ??
    signed[0] ??
    teachers[0]
  )?.id ?? "";
}

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
    photoId: s?.photoId ?? "",
    aadhaar: s?.aadhaar ? formatAadhaar(s.aadhaar) : "",
  };
}

export function CertificateForm({ students, courses, teachers, initialStudent, today }: Props) {
  const [error, action, pending] = useActionState(createCertificateAction, null);
  const [v, setV] = useState(() => fromStudent(students.find((s) => s.id === initialStudent), courses, today));
  const [teacherId, setTeacherId] = useState(() => suggestTeacher(teachers, students.find((s) => s.id === initialStudent)?.courseId));
  const selectedTeacher = teachers.find((t) => t.id === teacherId);
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
            onChange={(e) => {
              const s = students.find((x) => x.id === e.target.value);
              setV(fromStudent(s, courses, today));
              if (s) setTeacherId(suggestTeacher(teachers, s.courseId));
            }}
            className={adminField}
          >
            <option value="">— Manual entry —</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
            ))}
          </select>
        </AdminField>
      </div>

      <div className="grid gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
        <ImageUploadField
          key={v.studentId || "manual"}
          name="photoId"
          kind="photo"
          label="Student photo"
          hint={v.studentId ? "Taken from the student's profile — change it here if needed." : "Passport-size photo printed on the certificate."}
          initialId={v.photoId}
        />
        <div>
          <AdminField label="Issued by (teacher)" hint="This teacher's signature is printed on the certificate.">
            <select name="issuedByTeacherId" value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className={adminField}>
              <option value="">— No teacher signature —</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                  {t.hasSignature ? "" : " (no signature yet)"}
                </option>
              ))}
            </select>
          </AdminField>
          {selectedTeacher && !selectedTeacher.hasSignature && (
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-200">
              {selectedTeacher.name} has no signature yet. Add it in{" "}
              <a href={`/admin/teachers/${selectedTeacher.id}`} target="_blank" className="font-semibold underline">
                Teachers
              </a>{" "}
              before generating, or the signature line stays blank.
            </p>
          )}
          {teachers.length === 0 && (
            <p className="mt-2 text-xs text-slate-500">
              No teachers yet. <a href="/admin/teachers/new" className="font-semibold text-brand-600">Add a teacher</a> with a signature first.
            </p>
          )}
        </div>
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
        <AdminField
          label="Aadhaar number"
          hint={v.aadhaar.replace(/\D/g, "").length === 12 ? `Printed as ${maskAadhaar(v.aadhaar)} — only the last 4 digits are saved on the certificate.` : "Optional. Only the last 4 digits are printed."}
        >
          <input
            name="aadhaar"
            inputMode="numeric"
            autoComplete="off"
            maxLength={14}
            placeholder="1234 5678 9012"
            value={v.aadhaar}
            onChange={set("aadhaar")}
            className={`${adminField} font-mono tracking-wider`}
          />
        </AdminField>
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
