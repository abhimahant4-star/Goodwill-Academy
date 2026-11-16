"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, CalendarCheck, ClipboardCheck, LogOut, Menu, X } from "lucide-react";
import { teacherLogout } from "@/app/teacher/actions";

const items = [
  { href: "/teacher", label: "Mark Attendance", icon: CalendarCheck },
  { href: "/teacher/report", label: "Attendance Report", icon: BarChart3 },
];

export function TeacherSidebar({ name, courses }: { name: string; courses: string[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between bg-slate-950 px-4 py-3 text-white lg:hidden print:hidden">
        <span className="font-display text-lg font-bold">Teacher Panel</span>
        <button onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
      </div>

      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 text-white transition-transform lg:translate-x-0 print:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <Link href="/teacher" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
              <ClipboardCheck className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold">Teacher Panel</span>
              <span className="block text-[11px] text-white/50">Goodwill Skills Academy</span>
            </span>
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
        </div>

        <div className="mx-3 mb-4 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
          <p className="text-xs text-white/50">Signed in as</p>
          <p className="font-semibold">{name}</p>
          <p className="mt-2 text-xs text-white/50">Courses</p>
          <ul className="mt-1 space-y-0.5 text-xs text-emerald-300">
            {courses.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {items.map(({ href, label, icon: I }) => {
            const active = href === "/teacher" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active ? "text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {active && <motion.span layoutId="teacher-active" className="absolute inset-0 rounded-xl bg-white/10 ring-1 ring-white/10" />}
                <I className="relative h-5 w-5" />
                <span className="relative">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <form action={teacherLogout}>
            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white">
              <LogOut className="h-5 w-5" /> Logout
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
