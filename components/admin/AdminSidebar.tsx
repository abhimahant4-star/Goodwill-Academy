"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  CalendarCheck,
  ExternalLink,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { logout } from "@/app/admin/actions";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ newEnquiries }: { newEnquiries: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between bg-brand-950 px-4 py-3 text-white lg:hidden print:hidden">
        <span className="font-display text-lg font-bold">Goodwill Admin</span>
        <button onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
      </div>

      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-brand-950 text-white transition-transform lg:translate-x-0 print:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-gold-500">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold">Goodwill Admin</span>
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {items.map(({ href, label, icon: I }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive(href) ? "text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {isActive(href) && (
                <motion.span layoutId="admin-active" className="absolute inset-0 rounded-xl bg-white/10 ring-1 ring-white/10" />
              )}
              <I className="relative h-5 w-5" />
              <span className="relative">{label}</span>
              {label === "Enquiries" && newEnquiries > 0 && (
                <span className="relative ml-auto rounded-full bg-gold-500 px-2 py-0.5 text-xs font-bold text-brand-950">
                  {newEnquiries}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="space-y-1 border-t border-white/10 p-3">
          <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white">
            <ExternalLink className="h-5 w-5" /> View Website
          </a>
          <form action={logout}>
            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white">
              <LogOut className="h-5 w-5" /> Logout
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
