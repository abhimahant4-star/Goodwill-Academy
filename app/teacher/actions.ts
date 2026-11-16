"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIES, SESSION_TTL_SECONDS, createSessionToken } from "@/lib/auth";
import { getTeacherForLogin } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

export async function teacherLogin(_prev: string | null, form: FormData): Promise<string | null> {
  const username = String(form.get("username") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const teacher = username ? await getTeacherForLogin(username) : undefined;
  const ok = !!teacher && (await verifyPassword(password, teacher.passwordHash));

  if (!ok || !teacher) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return "Incorrect username or password.";
  }
  if (!teacher.active) return "Your account is disabled. Please contact the academy admin.";

  (await cookies()).set(SESSION_COOKIES.teacher, await createSessionToken("teacher", teacher.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  redirect("/teacher");
}

export async function teacherLogout() {
  (await cookies()).delete(SESSION_COOKIES.teacher);
  redirect("/teacher/login");
}
