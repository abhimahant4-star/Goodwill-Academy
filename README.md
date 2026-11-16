# Goodwill Academy Website

Next.js 15 (App Router) + Tailwind CSS 4 + Framer Motion website for Goodwill Academy, Chandigarh — with a built-in admin panel.

## Getting started

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD and ADMIN_SECRET
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

## SEO

- Every page has its own title, meta description, canonical URL, Open Graph tags and **10+ keywords**
  (e.g. "best fashion designing course in Chandigarh"). Keywords also appear on the page in a
  "Popular Searches" block, because Google ignores the meta keywords tag on its own.
- Structured data: `EducationalOrganization`, `Course`, `BreadcrumbList`, `ItemList` and `FAQPage`.
- Course keywords are editable per course in the admin panel (minimum 10 enforced).
- Set `NEXT_PUBLIC_SITE_URL` to the real domain before deploying, then submit `/sitemap.xml` in Google Search Console.

## Admin panel

Go to `/admin` and sign in with `ADMIN_PASSWORD`.

- **Dashboard** – enquiry and course overview
- **Enquiries** – leads from every website form; call/WhatsApp, mark as contacted/enrolled/closed, delete
- **Courses** – add, edit, delete, publish/unpublish, feature on homepage, edit SEO keywords, fees, duration
- **Students** – register students (auto roll no. GWA0001…), course, batch, status, attendance %
- **Attendance** – mark Present / Absent / Leave per day and course (All Present, search, past dates);
  monthly **Attendance Report** grid with totals and % (leave is not counted against the student), printable
- **Certificates** – generate a certificate from a student (auto-filled) or manually; each gets a unique ID
  like `GWA-2026-K7P4QX` and a QR code that opens its verification page. Print/download as PDF, revoke or delete.
- **Settings** – phone, WhatsApp, email, address, hours, Google Map, social links, certificate signature names

Changes are published to the live site immediately.

## Data storage

Content and enquiries are stored in `data/db.json` (created automatically from `lib/seed.ts` on first run).
This works on any Node.js host with a writable disk (VPS, Hostinger/cPanel Node app, Render, Railway).
**Back up `data/db.json`** — it holds all enquiries.

Vercel/Netlify have a read-only filesystem, so for those hosts replace the functions in `lib/db.ts`
with a database (MongoDB, Supabase, etc.) — nothing else in the app needs to change.
