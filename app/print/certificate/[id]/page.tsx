import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Certificate } from "@/components/certificate/Certificate";
import { AutoPrint } from "@/components/certificate/AutoPrint";
import { getCertificateView } from "@/lib/certificate-view";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Print Certificate", robots: { index: false, follow: false } };

export default async function PrintCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const view = await getCertificateView(id);
  if (!view) notFound();

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 bg-slate-200 py-6 print:block print:bg-white print:p-0">
      <AutoPrint />
      <Certificate {...view} />
    </div>
  );
}
