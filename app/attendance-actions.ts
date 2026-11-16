"use server";

import { revalidatePath } from "next/cache";
import { getStudents, saveAttendance } from "@/lib/db";
import { isValidDate, todayIST } from "@/lib/attendance";
import { requireAdmin, requireTeacher } from "@/lib/session";
import type { AttendanceMark } from "@/lib/types";

export type Panel = "admin" | "teacher";

/** Shared by the admin and teacher panels. Teachers can only mark students in their assigned courses. */
export async function saveAttendanceAction(panel: Panel, date: string, marks: Record<string, AttendanceMark | null>) {
  let markedBy = "Admin";
  let courseIds: string[] | undefined;
  if (panel === "admin") {
    await requireAdmin();
  } else {
    const teacher = await requireTeacher();
    markedBy = teacher.name;
    courseIds = teacher.courseIds.length ? teacher.courseIds : undefined;
  }

  if (!isValidDate(date)) throw new Error("Invalid date.");
  if (date > todayIST()) throw new Error("Attendance cannot be marked for a future date.");

  const allowed = new Set((await getStudents({ courseIds })).map((s) => s.id));
  const clean: Record<string, AttendanceMark | null> = {};
  for (const [id, mark] of Object.entries(marks)) {
    if (!allowed.has(id)) continue;
    if (mark === null || mark === "P" || mark === "A" || mark === "L") clean[id] = mark;
  }
  await saveAttendance(date, clean, markedBy);
  revalidatePath("/admin", "layout");
  revalidatePath("/teacher", "layout");
}
