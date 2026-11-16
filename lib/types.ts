export type IconName =
  | "sparkles"
  | "scissors"
  | "palette"
  | "hand"
  | "shirt"
  | "ruler"
  | "needle"
  | "flower"
  | "layers"
  | "crown"
  | "monitor"
  | "file"
  | "calculator"
  | "keyboard"
  | "chart";

export type Category = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  icon: IconName;
  /** Tailwind gradient classes used for cards and banners */
  gradient: string;
  keywords: string[];
  order: number;
};

export type Course = {
  id: string;
  slug: string;
  categorySlug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: IconName;
  duration: string;
  fee: string;
  level: string;
  topics: string[];
  certificates: string[];
  keywords: string[];
  image?: string;
  featured: boolean;
  published: boolean;
  order: number;
};

export type EnquiryStatus = "new" | "contacted" | "enrolled" | "closed";

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  course?: string;
  message?: string;
  status: EnquiryStatus;
  createdAt: string;
};

export type Settings = {
  siteName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  hours: string;
  mapEmbedUrl: string;
  instagram: string;
  facebook: string;
  youtube: string;
  signatory1Name: string;
  signatory1Title: string;
  signatory2Name: string;
  signatory2Title: string;
};

export type StudentStatus = "active" | "completed" | "dropped";

export type Student = {
  id: string;
  rollNo: string;
  name: string;
  guardianName: string;
  phone: string;
  email?: string;
  courseId: string;
  batch: string;
  joinDate: string; // YYYY-MM-DD
  status: StudentStatus;
  createdAt: string;
};

/** P = present, A = absent, L = leave */
export type AttendanceMark = "P" | "A" | "L";

/** date (YYYY-MM-DD) -> studentId -> mark */
export type AttendanceBook = Record<string, Record<string, AttendanceMark>>;

export type CertificateStatus = "valid" | "revoked";

export type Certificate = {
  /** Public unique code printed on the certificate, e.g. GWA-2026-K7P4QX */
  id: string;
  studentId?: string;
  studentName: string;
  /** "S/o", "D/o" or "W/o" — printed before the guardian's name */
  relation: string;
  guardianName: string;
  courseTitle: string;
  duration: string;
  grade: string;
  certificateType: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  status: CertificateStatus;
  createdAt: string;
};

export type Database = {
  settings: Settings;
  categories: Category[];
  courses: Course[];
  enquiries: Enquiry[];
  students: Student[];
  attendance: AttendanceBook;
  certificates: Certificate[];
};
