import type { AttendanceBook } from "./types";

/** Today's date in India as YYYY-MM-DD. */
export function todayIST() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

export function isValidDate(d: string | undefined): d is string {
  return !!d && /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(d));
}

export function daysInMonth(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

export type AttendanceStats = { present: number; absent: number; leave: number; marked: number; percent: number | null };

/** Percentage = present ÷ (present + absent). Approved leave is not counted against the student. */
export function studentStats(book: AttendanceBook, studentId: string): AttendanceStats {
  let present = 0;
  let absent = 0;
  let leave = 0;
  for (const day of Object.values(book)) {
    const mark = day[studentId];
    if (mark === "P") present++;
    else if (mark === "A") absent++;
    else if (mark === "L") leave++;
  }
  const counted = present + absent;
  return {
    present,
    absent,
    leave,
    marked: counted + leave,
    percent: counted ? Math.round((present / counted) * 100) : null,
  };
}

export function percentColor(p: number | null) {
  if (p === null) return "text-slate-400";
  if (p >= 85) return "text-emerald-600";
  if (p >= 70) return "text-amber-600";
  return "text-red-600";
}

export function formatDate(d: string) {
  if (!isValidDate(d)) return d;
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
