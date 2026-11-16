import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIES, verifySessionToken } from "./auth";
import { getTeacher } from "./db";
import type { Teacher } from "./types";


export async function getAdmin() {
  const token = (await cookies()).get(SESSION_COOKIES.admin)?.value;
  return verifySessionToken(token, "admin");
}

/** Returns the signed-in teacher, or null if the session is missing, expired, the account is disabled or its password changed. */
export async function getTeacherSession(): Promise<Teacher | null> {
  const token = (await cookies()).get(SESSION_COOKIES.teacher)?.value;
  const session = await verifySessionToken(token, "teacher");
  if (!session) return null;
  const teacher = await getTeacher(session.sub);
  if (!teacher || !teacher.active || session.issuedAt < teacher.passwordChangedAt) return null;
  return teacher;
}

export async function requireAdmin() {
  if (!(await getAdmin())) redirect("/admin/login");
}

export async function requireTeacher() {
  const teacher = await getTeacherSession();
  if (!teacher) redirect("/teacher/login");
  return teacher;
}

