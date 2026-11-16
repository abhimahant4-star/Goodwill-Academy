import { redirect } from "next/navigation";
import { Award, BadgeCheck, Building2, Fingerprint, QrCode, ShieldCheck } from "lucide-react";
import { CertificateLookup } from "@/components/certificate/CertificateLookup";
import { KeywordTags, SectionHeading } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { getCertificate } from "@/lib/db";
import { pageMetadata } from "@/lib/seo";

const KEYWORDS = [
  "Goodwill Skills Academy certificate verification",
  "verify Goodwill Skills Academy certificate",
  "online certificate verification Tarn Taran",
  "certificate verification by QR code",
  "international certificate verification",
  "salon certificate verification",
  "makeup course certificate Tarn Taran",
  "fashion designing course certificate verification",
  "computer course certificate verification",
  "sewing course certificate Tarn Taran",
  "check course certificate online",
  "download course certificate",
  "certificate verification Taran Taran",
  "Goodwill Skills Academy Taran Taran certificate",
];

export const metadata = pageMetadata({
  title: "Certificate Verification – Verify by QR Code or Certificate ID",
  description:
    "Verify a Goodwill Skills Academy Tarn Taran certificate online. Scan the QR code or enter the unique certificate ID to view and download the International or Salon Certificate.",
  path: "/certificate",
  keywords: KEYWORDS,
});

export default async function CertificateSearchPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  let notFound = false;
  if (id?.trim()) {
    const cert = await getCertificate(id);
    if (cert) redirect(`/certificate/${cert.id}`);
    notFound = true;
  }

  return (
    <>
      <section className="relative overflow-clip bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 pt-36 pb-24 text-white">
        <div className="grain absolute inset-0" aria-hidden />
        <div className="absolute -right-24 -top-24 h-96 w-96 animate-float rounded-full bg-gold-400/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 animate-float rounded-full bg-brand-500/30 blur-3xl [animation-delay:2s]" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_520px]">
          <Reveal>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-gold-300">
              <ShieldCheck className="h-4 w-4" /> Official Verification Portal
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Verify Your <span className="text-gradient">Certificate</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/75">
              Every Goodwill Skills Academy certificate carries a unique ID and a secure QR code. Scan it or enter the ID to
              instantly confirm it&apos;s genuine — and view or download your certificate.
            </p>
            <ul className="mt-8 grid max-w-lg gap-3 sm:grid-cols-2">
              {["International Certificate", "Salon Certificate", "Instant online verification", "Download & print anytime"].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-white/85">
                  <BadgeCheck className="h-5 w-5 shrink-0 text-gold-400" /> {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <CertificateLookup key={id ?? ""} initialId={id?.trim().toUpperCase() ?? ""} notFound={notFound} />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title={<>Verification in <span className="text-gradient">3 Simple Steps</span></>}
          text="Employers, salons and students can check any Goodwill Skills Academy certificate in seconds."
        />
        <Stagger className="grid gap-6 md:grid-cols-3">
          {[
            { icon: QrCode, t: "Scan or enter ID", d: "Scan the QR code at the bottom-left of the certificate, or type the ID like GSA-2026-XXXXXX." },
            { icon: Fingerprint, t: "We match our records", d: "The ID is checked against Goodwill Skills Academy's official register of issued certificates." },
            { icon: Award, t: "View & download", d: "See the student name, course, grade and dates, and download or print the certificate." },
          ].map(({ icon: I, t, d }, i) => (
            <StaggerItem key={t}>
              <div className="relative h-full overflow-hidden rounded-3xl bg-white p-8 ring-1 ring-brand-100">
                <span className="absolute right-6 top-4 font-display text-7xl font-bold text-brand-50">{i + 1}</span>
                <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-gold-500 text-white shadow-lg">
                  <I className="h-7 w-7" />
                </span>
                <h2 className="relative mt-5 font-display text-xl font-bold text-brand-950">{t}</h2>
                <p className="relative mt-2 text-sm leading-relaxed text-ink/65">{d}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-12 flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-r from-brand-50 to-gold-300/20 p-8 text-center ring-1 ring-brand-100 sm:flex-row sm:text-left">
          <Building2 className="h-12 w-12 shrink-0 text-brand-600" />
          <p className="text-ink/75">
            <b className="text-brand-950">For employers &amp; salons:</b> if a certificate can&apos;t be found or shows as revoked, please
            contact Goodwill Skills Academy before accepting it.
          </p>
        </Reveal>

        <div className="mt-16">
          <KeywordTags keywords={KEYWORDS} />
        </div>
      </section>
    </>
  );
}
