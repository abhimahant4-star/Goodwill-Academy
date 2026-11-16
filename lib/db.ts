import { randomUUID } from "crypto";
import type { Collection, Document } from "mongodb";
import { getDb } from "./mongo";
import { seedCategories, seedCourses, seedSettings } from "./seed";
import type {
  AttendanceBook,
  AttendanceMark,
  Category,
  Certificate,
  Course,
  Enquiry,
  Settings,
  Student,
  Teacher,
} from "./types";

/**
 * MongoDB data layer. Every page, action and API in the app goes through these functions.
 * Each document keeps its public id both as `_id` and as a normal field, and `_id` is
 * stripped before data leaves this module.
 */

type WithId<T> = T & { _id: string };

type AttendanceDoc = {
  _id: string; // `${date}:${studentId}`
  date: string;
  studentId: string;
  mark: AttendanceMark;
  markedBy: string;
  updatedAt: Date;
};

const NO_ID = { projection: { _id: 0 } } as const;

let ready: Promise<void> | null = null;

async function col<T extends Document>(name: string): Promise<Collection<T>> {
  ready ??= init().catch((err) => {
    ready = null;
    throw err;
  });
  await ready;
  return (await getDb()).collection<T>(name);
}

/** Creates indexes and seeds the default content the first time the app talks to a new database. */
async function init() {
  const db = await getDb();
  await Promise.all([
    db.collection("courses").createIndex({ categorySlug: 1, slug: 1 }, { unique: true }),
    db.collection("enquiries").createIndex({ createdAt: -1 }),
    db.collection("students").createIndex({ createdAt: -1 }),
    db.collection("students").createIndex({ rollNo: 1 }, { unique: true }),
    db.collection("attendance").createIndex({ date: 1 }),
    db.collection("attendance").createIndex({ studentId: 1 }),
    db.collection("certificates").createIndex({ createdAt: -1 }),
    db.collection("teachers").createIndex({ username: 1 }, { unique: true }),
  ]);

  const settings = db.collection<WithId<Settings>>("settings");
  await settings.updateOne({ _id: "site" }, { $setOnInsert: seedSettings }, { upsert: true });

  const categories = db.collection<WithId<Category>>("categories");
  if ((await categories.estimatedDocumentCount()) === 0) {
    await categories.insertMany(seedCategories.map((c) => ({ ...c, _id: c.slug })));
  }
  const courses = db.collection<WithId<Course>>("courses");
  if ((await courses.estimatedDocumentCount()) === 0) {
    await courses.insertMany(seedCourses.map((c) => ({ ...c, _id: c.id })));
  }
}

export function newId() {
  return randomUUID();
}

// ---------- Settings ----------
export async function getSettings(): Promise<Settings> {
  const doc = await (await col<WithId<Settings>>("settings")).findOne({ _id: "site" }, NO_ID);
  // Merge over defaults so fields added in later versions always exist.
  return { ...seedSettings, ...(doc as Settings | null) };
}

export async function updateSettings(settings: Settings) {
  await (await col<WithId<Settings>>("settings")).updateOne({ _id: "site" }, { $set: settings }, { upsert: true });
}

// ---------- Categories ----------
export async function getCategories(): Promise<Category[]> {
  return (await col<WithId<Category>>("categories")).find({}, NO_ID).sort({ order: 1 }).toArray();
}

export async function getCategory(slug: string) {
  return (await (await col<WithId<Category>>("categories")).findOne({ _id: slug }, NO_ID)) ?? undefined;
}

// ---------- Courses ----------
export async function getCourses({ includeDrafts = false } = {}): Promise<Course[]> {
  const filter = includeDrafts ? {} : { published: true };
  return (await col<WithId<Course>>("courses")).find(filter, NO_ID).sort({ order: 1, title: 1 }).toArray();
}

export async function getCoursesByCategory(categorySlug: string) {
  return (await col<WithId<Course>>("courses"))
    .find({ categorySlug, published: true }, NO_ID)
    .sort({ order: 1, title: 1 })
    .toArray();
}

export async function getCourse(categorySlug: string, slug: string) {
  return (await (await col<WithId<Course>>("courses")).findOne({ categorySlug, slug, published: true }, NO_ID)) ?? undefined;
}

export async function getCourseById(id: string) {
  return (await (await col<WithId<Course>>("courses")).findOne({ _id: id }, NO_ID)) ?? undefined;
}

export async function saveCourse(course: Course) {
  const courses = await col<WithId<Course>>("courses");
  const clash = await courses.findOne({ _id: { $ne: course.id }, slug: course.slug, categorySlug: course.categorySlug });
  if (clash) throw new Error(`Another course already uses the URL "${course.slug}" in this category.`);
  await courses.replaceOne({ _id: course.id }, course, { upsert: true });
}

export async function deleteCourse(id: string) {
  await (await col<WithId<Course>>("courses")).deleteOne({ _id: id });
}

// ---------- Enquiries ----------
export async function getEnquiries(): Promise<Enquiry[]> {
  return (await col<WithId<Enquiry>>("enquiries")).find({}, NO_ID).sort({ createdAt: -1 }).toArray();
}

export async function addEnquiry(data: Omit<Enquiry, "id" | "status" | "createdAt">) {
  const id = randomUUID();
  await (await col<WithId<Enquiry>>("enquiries")).insertOne({
    ...data,
    _id: id,
    id,
    status: "new",
    createdAt: new Date().toISOString(),
  });
}

export async function updateEnquiryStatus(id: string, status: Enquiry["status"]) {
  await (await col<WithId<Enquiry>>("enquiries")).updateOne({ _id: id }, { $set: { status } });
}

export async function deleteEnquiry(id: string) {
  await (await col<WithId<Enquiry>>("enquiries")).deleteOne({ _id: id });
}

// ---------- Students ----------
async function nextSequence(name: string) {
  const counters = await col<{ _id: string; seq: number }>("counters");
  const doc = await counters.findOneAndUpdate({ _id: name }, { $inc: { seq: 1 } }, { upsert: true, returnDocument: "after" });
  return doc!.seq;
}

export async function getStudents(filter: { courseIds?: string[] } = {}): Promise<Student[]> {
  const query = filter.courseIds ? { courseId: { $in: filter.courseIds } } : {};
  return (await col<WithId<Student>>("students")).find(query, NO_ID).sort({ createdAt: -1 }).toArray();
}

export async function getStudent(id: string) {
  return (await (await col<WithId<Student>>("students")).findOne({ _id: id }, NO_ID)) ?? undefined;
}

export async function saveStudent(input: Omit<Student, "rollNo" | "createdAt">) {
  const students = await col<WithId<Student>>("students");
  const { id, ...fields } = input;
  const existing = await students.findOne({ _id: id });
  if (existing) {
    await students.updateOne({ _id: id }, { $set: fields });
    return;
  }
  const seq = await nextSequence("student");
  await students.insertOne({
    ...input,
    _id: id,
    rollNo: `GSA${String(seq).padStart(4, "0")}`,
    createdAt: new Date().toISOString(),
  });
}

export async function deleteStudent(id: string) {
  await (await col<WithId<Student>>("students")).deleteOne({ _id: id });
  await (await col<AttendanceDoc>("attendance")).deleteMany({ studentId: id });
}

// ---------- Attendance ----------
function toBook(docs: AttendanceDoc[]): AttendanceBook {
  const book: AttendanceBook = {};
  for (const d of docs) (book[d.date] ??= {})[d.studentId] = d.mark;
  return book;
}

export async function getAttendanceFor(date: string): Promise<Record<string, AttendanceMark>> {
  return toBook(await (await col<AttendanceDoc>("attendance")).find({ date }).toArray())[date] ?? {};
}

/** All attendance between two dates (inclusive, YYYY-MM-DD), optionally for some students only. */
export async function getAttendanceRange(from: string, to: string, studentIds?: string[]) {
  const query: Document = { date: { $gte: from, $lte: to } };
  if (studentIds) query.studentId = { $in: studentIds };
  return toBook(await (await col<AttendanceDoc>("attendance")).find(query).toArray());
}

export async function getAttendanceBook(studentIds?: string[]) {
  const query = studentIds ? { studentId: { $in: studentIds } } : {};
  return toBook(await (await col<AttendanceDoc>("attendance")).find(query).toArray());
}

/** Saves marks for one date; a null mark clears that student's entry. */
export async function saveAttendance(date: string, marks: Record<string, AttendanceMark | null>, markedBy: string) {
  const ops = Object.entries(marks).map(([studentId, mark]) =>
    mark
      ? {
          updateOne: {
            filter: { _id: `${date}:${studentId}` },
            update: { $set: { date, studentId, mark, markedBy, updatedAt: new Date() } },
            upsert: true,
          },
        }
      : { deleteOne: { filter: { _id: `${date}:${studentId}` } } },
  );
  if (ops.length) await (await col<AttendanceDoc>("attendance")).bulkWrite(ops, { ordered: false });
}

// ---------- Certificates ----------
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid misreading
export const CERT_ID_PATTERN = /GSA-\d{4}-[A-Z0-9]{6}/;

function makeCode(year: number) {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `GSA-${year}-${Array.from(bytes, (b) => CODE_CHARS[b % CODE_CHARS.length]).join("")}`;
}

export function normaliseCertificateId(input: string) {
  const match = input.toUpperCase().match(CERT_ID_PATTERN);
  return match ? match[0] : input.trim().toUpperCase();
}

export async function getCertificates(): Promise<Certificate[]> {
  return (await col<WithId<Certificate>>("certificates")).find({}, NO_ID).sort({ createdAt: -1 }).toArray();
}

export async function getCertificate(id: string) {
  const code = normaliseCertificateId(id);
  return (await (await col<WithId<Certificate>>("certificates")).findOne({ _id: code }, NO_ID)) ?? undefined;
}

export async function createCertificate(input: Omit<Certificate, "id" | "createdAt" | "status">) {
  const certificates = await col<WithId<Certificate>>("certificates");
  const year = Number(input.issueDate.slice(0, 4)) || new Date().getFullYear();
  for (let attempt = 0; ; attempt++) {
    const id = makeCode(year);
    const cert: Certificate = { ...input, id, status: "valid", createdAt: new Date().toISOString() };
    try {
      await certificates.insertOne({ ...cert, _id: id });
    } catch (err) {
      // 11000 = duplicate key: the random code already exists, try another one.
      if ((err as { code?: number }).code === 11000 && attempt < 5) continue;
      throw err;
    }
    if (input.studentId) {
      await (await col<WithId<Student>>("students")).updateOne({ _id: input.studentId }, { $set: { status: "completed" } });
    }
    return cert;
  }
}

export async function updateCertificate(id: string, patch: Partial<Omit<Certificate, "id" | "createdAt">>) {
  await (await col<WithId<Certificate>>("certificates")).updateOne({ _id: id }, { $set: patch });
}

export async function deleteCertificate(id: string) {
  await (await col<WithId<Certificate>>("certificates")).deleteOne({ _id: id });
}

// ---------- Teachers ----------
type TeacherDoc = WithId<Teacher> & { passwordHash: string };

export async function getTeachers(): Promise<Teacher[]> {
  return (await col<TeacherDoc>("teachers"))
    .find({}, { projection: { _id: 0, passwordHash: 0 } })
    .sort({ name: 1 })
    .toArray();
}

export async function getTeacher(id: string) {
  return (await (await col<TeacherDoc>("teachers")).findOne({ _id: id }, { projection: { _id: 0, passwordHash: 0 } })) ?? undefined;
}

/** Includes the password hash — only for the login check. */
export async function getTeacherForLogin(username: string) {
  return (await (await col<TeacherDoc>("teachers")).findOne({ username: username.trim().toLowerCase() })) ?? undefined;
}

export async function saveTeacher(teacher: Omit<Teacher, "createdAt" | "passwordChangedAt">, passwordHash?: string) {
  const teachers = await col<TeacherDoc>("teachers");
  const { id, ...fields } = teacher;
  const clash = await teachers.findOne({ _id: { $ne: id }, username: teacher.username });
  if (clash) throw new Error(`The username "${teacher.username}" is already taken.`);

  const existing = await teachers.findOne({ _id: id });
  if (existing) {
    const set: Partial<TeacherDoc> = { ...fields };
    if (passwordHash) Object.assign(set, { passwordHash, passwordChangedAt: Date.now() });
    await teachers.updateOne({ _id: id }, { $set: set });
  } else {
    if (!passwordHash) throw new Error("A password is required for a new teacher.");
    await teachers.insertOne({
      ...teacher,
      _id: id,
      passwordHash,
      passwordChangedAt: Date.now(),
      createdAt: new Date().toISOString(),
    });
  }
}

export async function deleteTeacher(id: string) {
  await (await col<TeacherDoc>("teachers")).deleteOne({ _id: id });
}
