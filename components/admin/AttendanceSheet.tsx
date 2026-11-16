"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CheckCheck, ChevronLeft, ChevronRight, RotateCcw, Save, Search, UserX } from "lucide-react";
import { saveAttendanceAction } from "@/app/admin/actions";
import type { AttendanceMark } from "@/lib/types";

type Row = { id: string; name: string; rollNo: string; batch: string; course: string };

type Props = {
  date: string;
  today: string;
  course: string;
  courses: { id: string; title: string }[];
  students: Row[];
  initial: Record<string, AttendanceMark>;
};

const markStyle: Record<AttendanceMark, { on: string; label: string }> = {
  P: { on: "bg-emerald-500 text-white ring-emerald-500 shadow-emerald-500/30", label: "Present" },
  A: { on: "bg-red-500 text-white ring-red-500 shadow-red-500/30", label: "Absent" },
  L: { on: "bg-amber-400 text-amber-950 ring-amber-400 shadow-amber-400/30", label: "Leave" },
};

function shiftDate(date: string, days: number) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function AttendanceSheet({ date, today, course, courses, students, initial }: Props) {
  const router = useRouter();
  const [marks, setMarks] = useState<Record<string, AttendanceMark | undefined>>(initial);
  const [query, setQuery] = useState("");
  const [saving, startSave] = useTransition();
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);

  const dirty = students.some((s) => marks[s.id] !== initial[s.id]);
  const counts = useMemo(() => {
    const c = { P: 0, A: 0, L: 0, none: 0 };
    for (const s of students) {
      const m = marks[s.id];
      if (m) c[m]++;
      else c.none++;
    }
    return c;
  }, [marks, students]);

  const visible = students.filter((s) =>
    [s.name, s.rollNo].some((v) => v.toLowerCase().includes(query.trim().toLowerCase())),
  );

  function go(next: { date?: string; course?: string }) {
    if (dirty && !confirm("You have unsaved attendance. Leave without saving?")) return;
    const params = new URLSearchParams({ date: next.date ?? date });
    const c = next.course ?? course;
    if (c) params.set("course", c);
    router.push(`/admin/attendance?${params}`);
  }

  function setAll(mark: AttendanceMark | undefined) {
    setMarks((m) => {
      const next = { ...m };
      for (const s of visible) next[s.id] = mark;
      return next;
    });
  }

  function save() {
    const payload: Record<string, AttendanceMark | null> = {};
    for (const s of students) payload[s.id] = marks[s.id] ?? null;
    startSave(async () => {
      try {
        await saveAttendanceAction(date, payload);
        setToast({ ok: true, text: `Attendance saved for ${counts.P + counts.A + counts.L} students.` });
        router.refresh();
      } catch (e) {
        setToast({ ok: false, text: (e as Error).message || "Could not save attendance." });
      }
      setTimeout(() => setToast(null), 3500);
    });
  }

  const pretty = new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 lg:grid-cols-[auto_1fr_260px]">
        <div className="flex items-center gap-2">
          <button onClick={() => go({ date: shiftDate(date, -1) })} className="grid h-10 w-10 place-items-center rounded-xl ring-1 ring-slate-200 hover:bg-slate-50" aria-label="Previous day">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <label className="relative">
            <span className="sr-only">Date</span>
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={date}
              max={today}
              onChange={(e) => e.target.value && go({ date: e.target.value })}
              className="rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm"
            />
          </label>
          <button
            onClick={() => go({ date: shiftDate(date, 1) })}
            disabled={date >= today}
            className="grid h-10 w-10 place-items-center rounded-xl ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-30"
            aria-label="Next day"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {date !== today && (
            <button onClick={() => go({ date: today })} className="rounded-xl px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50">
              Today
            </button>
          )}
        </div>
        <p className="self-center text-sm font-medium text-slate-700 lg:text-center">{pretty}</p>
        <select value={course} onChange={(e) => go({ course: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" aria-label="Course">
          <option value="">All courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Present", value: counts.P, cls: "text-emerald-600", bar: "bg-emerald-500" },
          { label: "Absent", value: counts.A, cls: "text-red-600", bar: "bg-red-500" },
          { label: "Leave", value: counts.L, cls: "text-amber-600", bar: "bg-amber-400" },
          { label: "Not marked", value: counts.none, cls: "text-slate-500", bar: "bg-slate-300" },
        ].map((x) => (
          <div key={x.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className={`text-2xl font-bold ${x.cls}`}>{x.value}</p>
            <p className="text-xs text-slate-500">{x.label}</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className={`h-full rounded-full ${x.bar}`}
                animate={{ width: `${students.length ? (x.value / students.length) * 100 : 0}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
          </div>
        ))}
      </div>

      {students.length === 0 ? (
        <div className="rounded-2xl bg-white p-16 text-center ring-1 ring-slate-200">
          <UserX className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">No active students for this date{course ? " and course" : ""}.</p>
          <a href="/admin/students/new" className="mt-4 inline-block text-sm font-semibold text-brand-600">Add a student →</a>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-3">
            <label className="relative mr-auto min-w-48 flex-1 sm:flex-none">
              <span className="sr-only">Search students</span>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search student"
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-400"
              />
            </label>
            <button onClick={() => setAll("P")} className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100">
              <CheckCheck className="h-4 w-4" /> All Present
            </button>
            <button onClick={() => setAll("A")} className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100">
              All Absent
            </button>
            <button onClick={() => setAll(undefined)} className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50">
              <RotateCcw className="h-4 w-4" /> Clear
            </button>
          </div>

          <ul className="divide-y divide-slate-100">
            {visible.map((s, i) => {
              const current = marks[s.id];
              return (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.4) }}
                  className="flex flex-wrap items-center gap-3 px-4 py-3"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-100 to-gold-300/50 font-semibold text-brand-800">
                    {s.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">{s.name}</p>
                    <p className="truncate text-xs text-slate-500">
                      <span className="font-mono">{s.rollNo}</span> · {s.course}
                      {s.batch && ` · ${s.batch}`}
                    </p>
                  </div>
                  <div className="flex gap-1.5" role="radiogroup" aria-label={`Attendance for ${s.name}`}>
                    {(Object.keys(markStyle) as AttendanceMark[]).map((m) => (
                      <motion.button
                        key={m}
                        whileTap={{ scale: 0.88 }}
                        role="radio"
                        aria-checked={current === m}
                        title={markStyle[m].label}
                        onClick={() => setMarks((prev) => ({ ...prev, [s.id]: prev[s.id] === m ? undefined : m }))}
                        className={`h-10 w-10 rounded-xl text-sm font-bold ring-1 transition ${
                          current === m ? `${markStyle[m].on} shadow-lg` : "bg-white text-slate-400 ring-slate-200 hover:ring-slate-300"
                        }`}
                      >
                        {m}
                      </motion.button>
                    ))}
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Sticky save bar */}
      {students.length > 0 && (
        <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-2xl bg-brand-950 px-5 py-3 text-white shadow-2xl">
          <p className="text-sm">{dirty ? "You have unsaved changes" : "All changes saved"}</p>
          <button
            onClick={save}
            disabled={saving || !dirty}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 px-5 py-2.5 text-sm font-semibold text-brand-950 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className={`fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-medium shadow-xl ${
              toast.ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
