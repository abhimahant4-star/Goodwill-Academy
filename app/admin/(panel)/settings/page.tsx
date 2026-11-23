import { getSettings } from "@/lib/db";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { CertificateBrandingForm } from "@/components/admin/CertificateBrandingForm";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <>
      <h1 className="mb-1 font-display text-3xl font-bold text-brand-950">Settings</h1>
      <p className="mb-6 text-sm text-slate-500">Contact details shown in the header, footer, contact page and SEO schema.</p>
      <SettingsForm settings={settings} />

      <h2 id="certificate-design" className="mt-14 mb-1 scroll-mt-8 font-display text-2xl font-bold text-brand-950">Certificate design</h2>
      <p className="mb-6 text-sm text-slate-500">Signatures and the academy stamp printed on every certificate.</p>
      <CertificateBrandingForm settings={settings} />
    </>
  );
}
