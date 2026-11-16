import Link from "next/link";
import { Award, BookOpen, CalendarCheck, Inbox, Sparkles, Users } from "lucide-react";
import { getAttendanceFor, getCategories, getCertificates, getCourses, getEnquiries, getStudents } from "@/lib/db";
import { todayIST } from "@/lib/attendance";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function Dashboard() {
  const today = todayIST();
  const [enquiries, courses, categories, students, certificates, todayMarks] = await Promise.all([
    getEnquiries(),
    getCourses({ includeDrafts: true }),
    getCategories(),
    getStudents(),
    getCertificates(),
    getAttendanceFor(today),
  ]);
  const active = students.filter((s) => s.status === "active");
  const presentToday = active.filter((s) => todayMarks[s.id] === "P").length;
  const markedToday = active.filter((s) => todayMarks[s.id]).length;

  const stats = [
    { label: "New Enquiries", value: enquiries.filter((e) => e.status === "new").length, icon: Sparkles, color: "from-rose-500 to-pink-500", href: "/admin/enquiries?status=new" },
    { label: "Active Students", value: active.length, icon: Users, color: "from-violet-500 to-purple-500", href: "/admin/students?status=active" },
    { label: "Present Today", value: `${presentToday}/${active.length}`, icon: CalendarCheck, color: "from-emerald-500 to-teal-500", href: "/admin/attendance" },
    { label: "Certificates Issued", value: certificates.length, icon: Award, color: "from-amber-500 to-orange-500", href: "/admin/certificates" },
  ];

  return (
    <>
      <h1 className="mb-1 font-display text-3xl font-bold text-brand-950">Dashboard</h1>
      <p className="mb-8 text-sm text-slate-500">Overview of enquiries, students, attendance and certificates.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: I, color, href }) => (
          <Link key={label} href={href} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md">
            <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${color} text-white`}>
              <I className="h-5 w-5" />
            </span>
            <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </Link>
        ))}
      </div>

      {active.length > 0 && markedToday < active.length && (
        <Link
          href="/admin/attendance"
          className="mt-6 flex items-center gap-3 rounded-2xl bg-amber-50 px-5 py-4 text-sm text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100"
        >
          <CalendarCheck className="h-5 w-5" />
          Today&apos;s attendance is pending for {active.length - markedToday} student{active.length - markedToday === 1 ? "" : "s"}.
          <span className="ml-auto font-semibold">Mark now →</span>
        </Link>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold text-slate-900"><Inbox className="h-4 w-4" /> Latest Enquiries</h2>
              <Link href="/admin/enquiries" className="text-sm font-medium text-brand-600">View all</Link>
            </div>
            {enquiries.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No enquiries yet. They will appear here when students fill a form.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {enquiries.slice(0, 5).map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{e.name}</p>
                      <p className="truncate text-xs text-slate-500">{e.course || "General enquiry"} · {e.phone}</p>
                    </div>
                    <StatusBadge status={e.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold text-slate-900"><Award className="h-4 w-4" /> Recent Certificates</h2>
              <Link href="/admin/certificates" className="text-sm font-medium text-brand-600">View all</Link>
            </div>
            {certificates.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No certificates issued yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {certificates.slice(0, 5).map((c) => (
                  <li key={c.id}>
                    <Link href={`/admin/certificates/${c.id}`} className="flex items-center justify-between gap-4 py-3 hover:text-brand-600">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{c.studentName}</p>
                        <p className="truncate text-xs text-slate-500">{c.courseTitle}</p>
                      </div>
                      <span className="font-mono text-xs text-slate-500">{c.id}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 font-semibold text-slate-900">Courses by Category</h2>
            <ul className="space-y-3">
              {categories.map((cat) => {
                const n = courses.filter((c) => c.categorySlug === cat.slug).length;
                return (
                  <li key={cat.slug}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-slate-700">{cat.shortName}</span>
                      <span className="font-semibold text-slate-900">{n}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full bg-gradient-to-r ${cat.gradient}`} style={{ width: `${(n / Math.max(courses.length, 1)) * 100}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="grid gap-2">
            <Link href="/admin/students/new" className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
              <Users className="h-4 w-4" /> Add Student
            </Link>
            <Link href="/admin/certificates/new" className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 py-2.5 text-sm font-semibold text-brand-950">
              <Award className="h-4 w-4" /> Create Certificate
            </Link>
            <Link href="/admin/courses/new" className="flex items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
              <BookOpen className="h-4 w-4" /> Add Course
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
