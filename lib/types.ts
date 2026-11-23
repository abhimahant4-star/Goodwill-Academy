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
  /** Banner photo URL */
  image?: string;
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
  /** Uploaded director signature (media id), printed on the right signature line */
  directorSignatureId: string;
  /** Uploaded scan of the rubber stamp (media id); when empty the built-in digital stamp is used */
  stampImageId: string;
  /** Text lines of the built-in digital stamp */
  stampLine1: string;
  stampLine2: string;
  stampLine3: string;
};

/** Settings fields that hold uploaded images — edited by their own controls, not the text form. */
export const SETTINGS_IMAGE_KEYS = ["directorSignatureId", "stampImageId"] as const;

export type MediaKind = "photo" | "signature" | "stamp" | "cover";

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
  /** Passport-size photo (media id) */
  photoId?: string;
  /** Full 12-digit Aadhaar number — admin only, never shown publicly */
  aadhaar?: string;
  createdAt: string;
};

/** P = present, A = absent, L = leave */
export type AttendanceMark = "P" | "A" | "L";

/** date (YYYY-MM-DD) -> studentId -> mark */
export type AttendanceBook = Record<string, Record<string, AttendanceMark>>;

export type CertificateStatus = "valid" | "revoked";

export type Certificate = {
  /** Public unique code printed on the certificate, e.g. GSA-2026-K7P4QX */
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
  /** Passport-size photo printed on the certificate (media id) */
  photoId?: string;
  /** Only the last 4 Aadhaar digits — printed masked as XXXX XXXX 1234 */
  aadhaarLast4?: string;
  /** Teacher who issued it — name and signature are copied so the certificate never changes later */
  issuedByTeacherId?: string;
  issuedByName?: string;
  issuedBySignatureId?: string;
  status: CertificateStatus;
  createdAt: string;
};

export type Teacher = {
  id: string;
  name: string;
  username: string;
  phone: string;
  /** Courses this teacher can see and mark. Empty = all courses. */
  courseIds: string[];
  active: boolean;
  /** Signature image (media id), printed on certificates this teacher issues */
  signatureId?: string;
  createdAt: string;
  /** ms timestamp — sessions issued before this are rejected */
  passwordChangedAt: number;
};
