import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ExternalLink, Printer } from "lucide-react";
import { Certificate } from "@/components/certificate/Certificate";
import { CertificateScaler } from "@/components/certificate/CertificateScaler";
import { CertificateAdminActions } from "@/components/admin/CertificateAdminActions";
import { getCertificateView } from "@/lib/certificate-view";

export const metadata = { title: "Certificate" };

export default async function AdminCertificatePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  const view = await getCertificateView(id);
  if (!view) notFound();
  const { cert } = view;

  return (
    <>
      <Link href="/admin/certificates" className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" /> All certificates
      </Link>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-sm font-semibold text-brand-600">{cert.id}</p>
          <h1 className="font-display text-3xl font-bold text-brand-950">{cert.studentName}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={`/print/certificate/${cert.id}`}
            target="_blank"
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <Printer className="h-4 w-4" /> Print / Download PDF
          </a>
          <a
            href={`/certificate/${cert.id}`}
            target="_blank"
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-brand-300"
          >
            <ExternalLink className="h-4 w-4" /> Public page
          </a>
        </div>
      </div>

      {created && (
        <p className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
          <CheckCircle2 className="h-4 w-4" /> Certificate generated. Students can now verify it with the QR code or ID <b>{cert.id}</b>.
        </p>
      )}

      <CertificateScaler className="mb-6 overflow-hidden rounded-lg">
        <Certificate {...view} />
      </CertificateScaler>

      <CertificateAdminActions id={cert.id} status={cert.status} />
    </>
  );
}
