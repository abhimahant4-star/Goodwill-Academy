import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type {
  AttendanceMark,
  Category,
  Certificate,
  Course,
  Database,
  Enquiry,
  Settings,
  Student,
} from "./types";
import { seedDatabase } from "./seed";

/**
 * Tiny JSON-file data store. Works on any Node host (VPS, cPanel Node, Render, Railway).
 * For serverless hosts with a read-only filesystem (e.g. Vercel), swap these
 * functions for a real database — the rest of the app only uses this module.
 */
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

let writeQueue: Promise<unknown> = Promise.resolve();
let seeding: Promise<void> | null = null;

/** Writes via a temp file + rename so readers never see a half-written file. */
async function writeAtomic(data: unknown) {
  const tmp = `${DB_FILE}.${process.pid}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  for (let attempt = 0; ; attempt++) {
    try {
      return await fs.rename(tmp, DB_FILE);
    } catch (err) {
      // Windows can briefly lock the target while another request is reading it.
      const code = (err as NodeJS.ErrnoException).code;
      if (attempt >= 5 || (code !== "EPERM" && code !== "EBUSY" && code !== "EACCES")) throw err;
      await new Promise((r) => setTimeout(r, 25 * (attempt + 1)));
    }
  }
}

/** Some filesystems (notably Windows) can expose an empty file for an instant during a replace — retry briefly. */
async function readJsonWithRetry(): Promise<Partial<Database>> {
  for (let attempt = 0; ; attempt++) {
    const raw = await fs.readFile(DB_FILE, "utf8");
    try {
      return JSON.parse(raw);
    } catch (err) {
      if (attempt >= 4) throw err;
      await new Promise((r) => setTimeout(r, 20 * (attempt + 1)));
    }
  }
}

async function readDb(): Promise<Database> {
  try {
    const db = await readJsonWithRetry();
    // Fill in collections/fields added in later versions so older db.json files keep working.
    return {
      ...structuredClone(seedDatabase),
      ...db,
      settings: { ...seedDatabase.settings, ...db.settings },
    } as Database;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    seeding ??= (async () => {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await writeAtomic(seedDatabase);
    })().finally(() => {
      seeding = null;
    });
    await seeding;
    return structuredClone(seedDatabase);
  }
}

/** Serialises writes so two admin saves never clobber each other. */
function mutate<T>(fn: (db: Database) => T): Promise<T> {
  const run = writeQueue.then(async () => {
    const db = await readDb();
    const result = fn(db);
    await writeAtomic(db);
    return result;
  });
  writeQueue = run.catch(() => undefined);
  return run;
}

// ---------- Settings ----------
export async function getSettings(): Promise<Settings> {
  return (await readDb()).settings;
}

export function updateSettings(settings: Settings) {
  return mutate((db) => {
    db.settings = settings;
  });
}

// ---------- Categories ----------
export async function getCategories(): Promise<Category[]> {
  return (await readDb()).categories.sort((a, b) => a.order - b.order);
}

export async function getCategory(slug: string) {
  return (await getCategories()).find((c) => c.slug === slug);
}

// ---------- Courses ----------
export async function getCourses({ includeDrafts = false } = {}): Promise<Course[]> {
  const courses = (await readDb()).courses.sort((a, b) => a.order - b.order);
  return includeDrafts ? courses : courses.filter((c) => c.published);
}

export async function getCoursesByCategory(categorySlug: string) {
  return (await getCourses()).filter((c) => c.categorySlug === categorySlug);
}

export async function getCourse(categorySlug: string, slug: string) {
  return (await getCourses()).find((c) => c.categorySlug === categorySlug && c.slug === slug);
}

export async function getCourseById(id: string) {
  return (await getCourses({ includeDrafts: true })).find((c) => c.id === id);
}

export function saveCourse(course: Course) {
  return mutate((db) => {
    const clash = db.courses.find(
      (c) => c.id !== course.id && c.slug === course.slug && c.categorySlug === course.categorySlug,
    );
    if (clash) throw new Error(`Another course already uses the URL "${course.slug}" in this category.`);
    const idx = db.courses.findIndex((c) => c.id === course.id);
    if (idx === -1) db.courses.push(course);
    else db.courses[idx] = course;
  });
}

export function deleteCourse(id: string) {
  return mutate((db) => {
    db.courses = db.courses.filter((c) => c.id !== id);
  });
}

// ---------- Enquiries ----------
export async function getEnquiries(): Promise<Enquiry[]> {
  return (await readDb()).enquiries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addEnquiry(data: Omit<Enquiry, "id" | "status" | "createdAt">) {
  return mutate((db) => {
    db.enquiries.push({ ...data, id: randomUUID(), status: "new", createdAt: new Date().toISOString() });
  });
}

export function updateEnquiryStatus(id: string, status: Enquiry["status"]) {
  return mutate((db) => {
    const e = db.enquiries.find((x) => x.id === id);
    if (e) e.status = status;
  });
}

export function deleteEnquiry(id: string) {
  return mutate((db) => {
    db.enquiries = db.enquiries.filter((e) => e.id !== id);
  });
}

export function newId() {
  return randomUUID();
}

// ---------- Students ----------
export async function getStudents(): Promise<Student[]> {
  return (await readDb()).students.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getStudent(id: string) {
  return (await readDb()).students.find((s) => s.id === id);
}

export function saveStudent(input: Omit<Student, "rollNo" | "createdAt"> & Partial<Pick<Student, "rollNo" | "createdAt">>) {
  return mutate((db) => {
    const idx = db.students.findIndex((s) => s.id === input.id);
    if (idx === -1) {
      const next = db.students.reduce((max, s) => Math.max(max, Number(s.rollNo.replace(/\D/g, "")) || 0), 0) + 1;
      db.students.push({ ...input, rollNo: `GWA${String(next).padStart(4, "0")}`, createdAt: new Date().toISOString() });
    } else {
      db.students[idx] = { ...db.students[idx], ...input, rollNo: db.students[idx].rollNo, createdAt: db.students[idx].createdAt };
    }
  });
}

export function deleteStudent(id: string) {
  return mutate((db) => {
    db.students = db.students.filter((s) => s.id !== id);
    for (const day of Object.values(db.attendance)) delete day[id];
  });
}

// ---------- Attendance ----------
export async function getAttendanceFor(date: string): Promise<Record<string, AttendanceMark>> {
  return (await readDb()).attendance[date] ?? {};
}

/** All attendance between two dates (inclusive, YYYY-MM-DD). */
export async function getAttendanceRange(from: string, to: string) {
  const book = (await readDb()).attendance;
  return Object.fromEntries(Object.entries(book).filter(([d]) => d >= from && d <= to));
}

export async function getAttendanceBook() {
  return (await readDb()).attendance;
}

/** Merges marks for one date; a null mark clears that student's entry. */
export function saveAttendance(date: string, marks: Record<string, AttendanceMark | null>) {
  return mutate((db) => {
    const day = { ...(db.attendance[date] ?? {}) };
    for (const [studentId, mark] of Object.entries(marks)) {
      if (mark) day[studentId] = mark;
      else delete day[studentId];
    }
    if (Object.keys(day).length) db.attendance[date] = day;
    else delete db.attendance[date];
  });
}

// ---------- Certificates ----------
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid misreading

function makeCode(year: number) {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `GWA-${year}-${Array.from(bytes, (b) => CODE_CHARS[b % CODE_CHARS.length]).join("")}`;
}

export function normaliseCertificateId(input: string) {
  const match = input.toUpperCase().match(/GWA-\d{4}-[A-Z0-9]{6}/);
  return match ? match[0] : input.trim().toUpperCase();
}

export async function getCertificates(): Promise<Certificate[]> {
  return (await readDb()).certificates.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getCertificate(id: string) {
  const code = normaliseCertificateId(id);
  return (await readDb()).certificates.find((c) => c.id === code);
}

export function createCertificate(input: Omit<Certificate, "id" | "createdAt" | "status">) {
  return mutate((db) => {
    const year = Number(input.issueDate.slice(0, 4)) || new Date().getFullYear();
    let id = makeCode(year);
    while (db.certificates.some((c) => c.id === id)) id = makeCode(year);
    const cert: Certificate = { ...input, id, status: "valid", createdAt: new Date().toISOString() };
    db.certificates.push(cert);
    if (input.studentId) {
      const s = db.students.find((x) => x.id === input.studentId);
      if (s) s.status = "completed";
    }
    return cert;
  });
}

export function updateCertificate(id: string, patch: Partial<Omit<Certificate, "id" | "createdAt">>) {
  return mutate((db) => {
    const c = db.certificates.find((x) => x.id === id);
    if (c) Object.assign(c, patch);
  });
}

export function deleteCertificate(id: string) {
  return mutate((db) => {
    db.certificates = db.certificates.filter((c) => c.id !== id);
  });
}
