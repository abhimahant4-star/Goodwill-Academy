import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getEnquiries } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Goodwill Admin" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const newCount = (await getEnquiries()).filter((e) => e.status === "new").length;
  return (
    <div className="min-h-screen bg-slate-50 lg:pl-64 print:bg-white print:pl-0">
      <AdminSidebar newEnquiries={newCount} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</div>
    </div>
  );
}
