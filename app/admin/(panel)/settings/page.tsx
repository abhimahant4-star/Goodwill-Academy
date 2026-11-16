import { getSettings } from "@/lib/db";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <>
      <h1 className="mb-1 font-display text-3xl font-bold text-brand-950">Settings</h1>
      <p className="mb-6 text-sm text-slate-500">Contact details shown in the header, footer, contact page and SEO schema.</p>
      <SettingsForm settings={settings} />
    </>
  );
}
