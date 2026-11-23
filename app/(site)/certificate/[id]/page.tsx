import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, CalendarDays, GraduationCap, Hash, Printer, ShieldX, Star, User } from "lucide-react";
import { Certificate } from "@/components/certificate/Certificate";
import { CertificateScaler } from "@/components/certificate/CertificateScaler";
import { CertificateLookup } from "@/components/certificate/CertificateLookup";
import { VerifyBadge } from "@/components/certificate/VerifyBadge";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { getCertificateView } from "@/lib/certificate-view";
import { formatDate } from "@/lib/attendance";
import { maskAadhaar } from "@/lib/aadhaar";

export const dynamic = "force-dynamic";

// Certificate pages contain personal details, so keep them out of search results.
export const metadata: Metadata = {
  title: "Certificate Verification Result",
  robots: { index: false, follow: false },
};

export default async function CertificateResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const view = await getCertificateView(id);

  if (!view) {
    const shown = decodeURIComponent(id).toUpperCase();
    return (
      <section className="relative overflow-clip bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 pt-36 pb-24 text-white">
        <div className="grain absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-xl px-4 text-center sm:px-6">
          <Reveal>
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-red-500/15 ring-1 ring-red-400/40">
              <ShieldX className="h-10 w-10 text-red-300" />
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold">Certificate Not Found</h1>
            <p className="mt-3 text-white/70">
              We couldn&apos;t find a certificate with ID <span className="font-mono font-semibold text-white">{shown}</span>. Check the ID and
              try again, or contact the academy.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 text-left text-ink">
            <CertificateLookup />
          </Reveal>
        </div>
      </section>
    );
  }

  const { cert } = view;
  const valid = cert.status === "valid";
  const details = [
    { icon: User, label: "Student Name", value: cert.studentName },
    ...(cert.aadhaarLast4 ? [{ icon: Hash, label: "Aadhaar No.", value: maskAadhaar(cert.aadhaarLast4) }] : []),
    { icon: GraduationCap, label: "Course", value: cert.courseTitle },
    { icon: BadgeCheck, label: "Certificate Type", value: cert.certificateType },
    { icon: Star, label: "Grade", value: cert.grade || "—" },
    { icon: CalendarDays, label: "Course Period", value: cert.startDate && cert.endDate ? `${formatDate(cert.startDate)} – ${formatDate(cert.endDate)}` : cert.duration || "—" },
    { icon: Hash, label: "Issued On", value: formatDate(cert.issueDate) },
  ];

  return (
    <>
      <section className="relative overflow-clip bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 pt-32 pb-40 text-white">
        <div className="grain absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Link href="/certificate" className="mb-8 inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-gold-300">
            <ArrowLeft className="h-4 w-4" /> Verify another certificate
          </Link>
          <div className="flex flex-col items-center text-center">
            <VerifyBadge valid={valid} />
            <Reveal delay={0.2}>
              <h1 className="mt-6 font-display text-4xl font-bold sm:text-5xl">{valid ? "Certificate Verified" : "Certificate Revoked"}</h1>
              <p className="mx-auto mt-3 max-w-xl text-white/75">
                {valid
                  ? "This is a genuine certificate issued by Goodwill Skills Academy, Tarn Taran."
                  : "This certificate was issued by Goodwill Skills Academy but has been revoked and is no longer valid."}
              </p>
              <p className="mt-4 inline-block rounded-full bg-white/10 px-5 py-2 font-mono text-lg font-semibold tracking-wider ring-1 ring-white/20">
                {cert.id}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-28 max-w-6xl px-4 pb-24 sm:px-6">
        <Stagger className="grid gap-3 rounded-3xl bg-white p-4 shadow-2xl shadow-brand-950/10 ring-1 ring-brand-100 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
          {details.map(({ icon: I, label, value }) => (
            <StaggerItem key={label} className="flex items-start gap-3 rounded-2xl bg-cream p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700">
                <I className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-wider text-ink/50 uppercase">{label}</p>
                <p className="font-semibold text-brand-950">{value}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-12">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-bold text-brand-950">Certificate Preview</h2>
            {valid && (
              <a
                href={`/print/certificate/${cert.id}`}
                target="_blank"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-700 to-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:shadow-brand-600/50"
              >
                <Printer className="h-4 w-4" /> Download / Print
              </a>
            )}
          </div>
          <CertificateScaler className="overflow-hidden rounded-lg">
            <Certificate {...view} />
          </CertificateScaler>
        </Reveal>
      </section>
    </>
  );
}
