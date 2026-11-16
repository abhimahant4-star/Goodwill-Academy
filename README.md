# Goodwill Skills Academy Website

Next.js 15 (App Router) + Tailwind CSS 4 + Framer Motion + **MongoDB** website for Goodwill Skills Academy, Tarn Taran (Punjab) — with an admin panel and a separate teacher panel.

## Getting started

```bash
npm install
cp .env.example .env.local   # then set MONGODB_URI, ADMIN_PASSWORD and ADMIN_SECRET
npm run dev                  # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

## Pages

| URL | Purpose |
| --- | --- |
| `/` | Home — hero, categories, certificates, featured courses, FAQ, enquiry form |
| `/courses` | All courses grouped by category |
| `/courses/[category]` | One page per category (Beauty & Makeup, Fashion Designing, Computer, Sewing) |
| `/courses/[category]/[course]` | One page per course with syllabus, FAQ and enrol form |
| `/about`, `/contact` | About and contact/admission pages |
| `/certificate` | Public certificate verification — enter the certificate ID or scan its QR code |
| `/certificate/[id]` | Verification result with the certificate preview and download (not indexed by Google) |
| `/print/certificate/[id]` | Print-ready A4 landscape certificate (Print → Save as PDF) |
| `/sitemap.xml`, `/robots.txt` | Generated automatically from the course list |
| `/admin` | Admin panel (password protected) |
| `/teacher` | Teacher panel — attendance only (username + password per teacher) |

## SEO

- Every page has its own title, meta description, canonical URL, Open Graph tags and **10+ keywords**
  (e.g. "best fashion designing course in Tarn Taran"). Keywords also appear on the page in a
  "Popular Searches" block, because Google ignores the meta keywords tag on its own.
- Structured data: `EducationalOrganization`, `Course`, `BreadcrumbList`, `ItemList` and `FAQPage`.
- Course keywords are editable per course in the admin panel (minimum 10 enforced).
- Set `NEXT_PUBLIC_SITE_URL` to the real domain before deploying, then submit `/sitemap.xml` in Google Search Console.

## Admin panel

Go to `/admin` and sign in with `ADMIN_PASSWORD`.

- **Dashboard** – enquiry and course overview
- **Enquiries** – leads from every website form; call/WhatsApp, mark as contacted/enrolled/closed, delete
- **Courses** – add, edit, delete, publish/unpublish, feature on homepage, edit SEO keywords, fees, duration
- **Students** – register students (auto roll no. GSA0001…), course, batch, status, attendance %
- **Attendance** – mark Present / Absent / Leave per day and course (All Present, search, past dates);
  monthly **Attendance Report** grid with totals and % (leave is not counted against the student), printable
- **Certificates** – generate a certificate from a student (auto-filled) or manually; each gets a unique ID
  like `GSA-2026-K7P4QX` and a QR code that opens its verification page. Print/download as PDF, revoke or delete.
- **Teachers** – create teacher logins (username + password), assign courses, disable or reset passwords
- **Settings** – phone, WhatsApp, email, address, hours, Google Map, social links, certificate signature names

Changes are published to the live site immediately.

## Teacher panel

Teachers sign in at `/teacher/login` with the username and password the admin created for them.
They only see two screens:

- **Mark Attendance** – daily Present / Absent / Leave for students of their assigned courses
- **Attendance Report** – monthly register with totals and %, printable / save as PDF

Each attendance entry records who marked it. Disabling a teacher or changing their password signs them out immediately.

## Data storage (MongoDB)

All content, enquiries, students, attendance, certificates and teacher accounts live in MongoDB
(database `MONGODB_DB`, default `goodwill_skills_academy`). On first run the app creates the indexes and
inserts the default courses, categories and settings from `lib/seed.ts`.

- **Local:** install MongoDB Community Server and use `MONGODB_URI=mongodb://127.0.0.1:27017`.
- **Production:** create a free cluster on MongoDB Atlas, add a database user, allow your host's IP, and use the
  `mongodb+srv://…` URI. Works on Vercel, Render, Railway, a VPS or Hostinger Node hosting.
- Teacher passwords are stored as salted scrypt hashes, never in plain text.
- Back up with `mongodump --db goodwill_skills_academy`.
