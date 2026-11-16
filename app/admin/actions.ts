"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIES, SESSION_TTL_SECONDS, checkAdminPassword, createSessionToken } from "@/lib/auth";
import { requireAdmin } from "@/lib/session";
import { hashPassword } from "@/lib/password";
import * as db from "@/lib/db";
import { dedupe } from "@/lib/seo";
import { isValidDate } from "@/lib/attendance";
import type { Course, EnquiryStatus, IconName, StudentStatus } from "@/lib/types";

function refreshSite() {
  revalidatePath("/", "layout");
}

// ---------- Auth ----------
export async function login(_prev: string | null, form: FormData): Promise<string | null> {
  const password = String(form.get("password") ?? "");
  if (!(await checkAdminPassword(password))) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return "Incorrect password.";
  }
  (await cookies()).set(SESSION_COOKIES.admin, await createSessionToken("admin", "admin"), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIES.admin);
  redirect("/admin/login");
}

// ---------- Enquiries ----------
export async function setEnquiryStatus(id: string, status: EnquiryStatus) {
  await requireAdmin();
  await db.updateEnquiryStatus(id, status);
  revalidatePath("/admin", "layout");
}

export async function removeEnquiry(id: string) {
  await requireAdmin();
  await db.deleteEnquiry(id);
  revalidatePath("/admin", "layout");
}

// ---------- Courses ----------
const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export async function saveCourseAction(_prev: string | null, form: FormData): Promise<string | null> {
  await requireAdmin();
  const id = String(form.get("id") || "") || db.newId();
  const title = String(form.get("title") ?? "").trim();
  if (!title) return "Title is required.";
  const slug = slugify(String(form.get("slug") || "") || title);
  const categorySlug = String(form.get("categorySlug") ?? "");
  if (!(await db.getCategory(categorySlug))) return "Please choose a valid category.";

  const keywords = dedupe(String(form.get("keywords") ?? "").split(/\r?\n/));
  if (keywords.length < 10) return `Add at least 10 SEO keywords (currently ${keywords.length}), one per line.`;

  const course: Course = {
    id,
    slug,
    categorySlug,
    title,
    shortDescription: String(form.get("shortDescription") ?? "").trim(),
    description: String(form.get("description") ?? "").trim(),
    icon: (String(form.get("icon") || "sparkles") as IconName),
    duration: String(form.get("duration") ?? "").trim(),
    fee: String(form.get("fee") ?? "").trim() || "Contact for fees",
    level: String(form.get("level") ?? "").trim(),
    topics: String(form.get("topics") ?? "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
    certificates: lines(form.get("certificates")),
    keywords,
    image: String(form.get("image") ?? "").trim() || undefined,
    featured: form.get("featured") === "on",
    published: form.get("published") === "on",
    order: Number(form.get("order") || 99),
  };

  try {
    await db.saveCourse(course);
  } catch (e) {
    return (e as Error).message;
  }
  refreshSite();
  redirect("/admin/courses?saved=1");
}

export async function removeCourse(id: string) {
  await requireAdmin();
  await db.deleteCourse(id);
  refreshSite();
}

export async function toggleCourse(id: string, field: "published" | "featured") {
  await requireAdmin();
  const course = await db.getCourseById(id);
  if (!course) return;
  await db.saveCourse({ ...course, [field]: !course[field] });
  refreshSite();
}

// ---------- Settings ----------
export async function saveSettings(_prev: string | null, form: FormData): Promise<string | null> {
  await requireAdmin();
  const current = await db.getSettings();
  const next = { ...current };
  for (const key of Object.keys(current) as (keyof typeof current)[]) {
    next[key] = String(form.get(key) ?? "").trim();
  }
  await db.updateSettings(next);
  refreshSite();
  return "Settings saved.";
}

// ---------- Students ----------
const str = (form: FormData, key: string, max = 200) => String(form.get(key) ?? "").trim().slice(0, max);

export async function saveStudentAction(_prev: string | null, form: FormData): Promise<string | null> {
  await requireAdmin();
  const name = str(form, "name", 100);
  const phone = str(form, "phone", 20);
  const courseId = str(form, "courseId");
  const joinDate = str(form, "joinDate", 10);
  const status = str(form, "status") as StudentStatus;

  if (name.length < 2) return "Student name is required.";
  if (!/^[+\d][\d\s-]{8,}$/.test(phone)) return "Please enter a valid phone number.";
  if (!(await db.getCourseById(courseId))) return "Please choose a course.";
  if (!isValidDate(joinDate)) return "Please choose a valid joining date.";
  if (!["active", "completed", "dropped"].includes(status)) return "Invalid status.";

  const id = str(form, "id") || db.newId();
  await db.saveStudent({
    id,
    name,
    guardianName: str(form, "guardianName", 100),
    phone,
    email: str(form, "email", 120) || undefined,
    courseId,
    batch: str(form, "batch", 60),
    joinDate,
    status,
  });
  revalidatePath("/admin", "layout");
  redirect(`/admin/students?saved=1`);
}

export async function removeStudent(id: string) {
  await requireAdmin();
  await db.deleteStudent(id);
  revalidatePath("/admin", "layout");
}

// ---------- Certificates ----------
export async function createCertificateAction(_prev: string | null, form: FormData): Promise<string | null> {
  await requireAdmin();
  const studentName = str(form, "studentName", 100);
  const courseTitle = str(form, "courseTitle", 120);
  const issueDate = str(form, "issueDate", 10);
  const startDate = str(form, "startDate", 10);
  const endDate = str(form, "endDate", 10);

  if (studentName.length < 2) return "Student name is required.";
  if (!courseTitle) return "Course is required.";
  if (!isValidDate(issueDate)) return "Please choose a valid issue date.";
  if (startDate && !isValidDate(startDate)) return "Invalid start date.";
  if (endDate && !isValidDate(endDate)) return "Invalid end date.";
  if (startDate && endDate && endDate < startDate) return "End date must be after the start date.";

  const cert = await db.createCertificate({
    studentId: str(form, "studentId") || undefined,
    studentName,
    relation: ["S/o", "D/o", "W/o"].includes(str(form, "relation")) ? str(form, "relation") : "",
    guardianName: str(form, "guardianName", 100),
    courseTitle,
    duration: str(form, "duration", 40),
    grade: str(form, "grade", 20),
    certificateType: str(form, "certificateType", 60) || "Certificate of Completion",
    startDate,
    endDate,
    issueDate,
  });
  revalidatePath("/admin", "layout");
  redirect(`/admin/certificates/${cert.id}?created=1`);
}

export async function setCertificateStatus(id: string, status: "valid" | "revoked") {
  await requireAdmin();
  await db.updateCertificate(id, { status });
  revalidatePath("/admin", "layout");
  revalidatePath(`/certificate/${id}`);
}

export async function removeCertificate(id: string) {
  await requireAdmin();
  await db.deleteCertificate(id);
  revalidatePath("/admin", "layout");
  redirect("/admin/certificates");
}

// ---------- Teachers ----------
export async function saveTeacherAction(_prev: string | null, form: FormData): Promise<string | null> {
  await requireAdmin();
  const id = str(form, "id") || db.newId();
  const name = str(form, "name", 100);
  const username = str(form, "username", 40).toLowerCase();
  const password = String(form.get("password") ?? "");
  const isNew = !str(form, "id");

  if (name.length < 2) return "Teacher name is required.";
  if (!/^[a-z0-9._-]{3,40}$/.test(username)) return "Username must be 3–40 characters: letters, numbers, dot, dash or underscore.";
  if ((isNew || password) && password.length < 8) return "Password must be at least 8 characters.";

  const validCourses = new Set((await db.getCourses({ includeDrafts: true })).map((c) => c.id));
  try {
    await db.saveTeacher(
      {
        id,
        name,
        username,
        phone: str(form, "phone", 20),
        courseIds: form.getAll("courseIds").map(String).filter((c) => validCourses.has(c)),
        active: form.get("active") === "on",
      },
      password ? await hashPassword(password) : undefined,
    );
  } catch (e) {
    return (e as Error).message;
  }
  revalidatePath("/admin", "layout");
  redirect("/admin/teachers?saved=1");
}

export async function toggleTeacherActive(id: string) {
  await requireAdmin();
  const teacher = await db.getTeacher(id);
  if (!teacher) return;
  const { createdAt: _c, passwordChangedAt: _p, ...rest } = teacher;
  await db.saveTeacher({ ...rest, active: !teacher.active });
  revalidatePath("/admin", "layout");
}

export async function removeTeacher(id: string) {
  await requireAdmin();
  await db.deleteTeacher(id);
  revalidatePath("/admin", "layout");
}
