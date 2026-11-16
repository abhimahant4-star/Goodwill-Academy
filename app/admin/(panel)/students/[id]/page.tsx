import Link from "next/link";
import { notFound } from "next/navigation";
import { Award } from "lucide-react";
import { StudentForm } from "@/components/admin/StudentForm";
import { getAttendanceBook, getCertificates, getStudent } from "@/lib/db";
import { getCourseOptions } from "@/lib/admin-data";
import { formatDate, percentColor, studentStats, todayIST } from "@/lib/attendance";

export const metadata = { title: "Edit Student" };

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [student, courses, book, certificates] = await Promise.all([
    getStudent(id),
    getCourseOptions(),
    getAttendanceBook(),
    getCertificates(),
  ]);
  if (!student) notFound();
  const st = studentStats(book, student.id);
  const certs = certificates.filter((c) => c.studentId === student.id);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-slate-500">{student.rollNo}</p>
          <h1 className="font-display text-3xl font-bold text-brand-950">{student.name}</h1>
        </div>
        <Link
          href={`/admin/certificates/new?student=${student.id}`}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 px-4 py-2.5 text-sm font-semibold text-brand-950"
        >
          <Award className="h-4 w-4" /> Issue Certificate
        </Link>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Attendance", value: st.percent === null ? "—" : `${st.percent}%`, cls: percentColor(st.percent) },
          { label: "Present", value: st.present, cls: "text-emerald-600" },
          { label: "Absent", value: st.absent, cls: "text-red-600" },
          { label: "Leave", value: st.leave, cls: "text-amber-600" },
        ].map((x) => (
          <div key={x.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className={`text-2xl font-bold ${x.cls}`}>{x.value}</p>
            <p className="text-xs text-slate-500">{x.label}</p>
          </div>
        ))}
      </div>

      {certs.length > 0 && (
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-3 font-semibold text-slate-900">Certificates issued</h2>
          <ul className="space-y-2">
            {certs.map((c) => (
              <li key={c.id}>
                <Link href={`/admin/certificates/${c.id}`} className="flex flex-wrap items-center gap-3 text-sm hover:text-brand-600">
                  <span className="font-mono font-semibold">{c.id}</span>
                  <span className="text-slate-500">{c.courseTitle} · {formatDate(c.issueDate)}</span>
                  {c.status === "revoked" && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">Revoked</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <StudentForm student={student} courses={courses} today={todayIST()} />
    </>
  );
}
