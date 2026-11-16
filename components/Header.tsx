"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, GraduationCap, Menu, Phone, X } from "lucide-react";

type NavCategory = { slug: string; shortName: string; courses: { slug: string; title: string }[] };

export function Header({ categories, phone }: { categories: NavCategory[]; phone: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/certificate", label: "Certificate" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/85 shadow-lg shadow-brand-900/5 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Goodwill Academy home">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-gold-500 text-white shadow-lg shadow-brand-600/30">
            <GraduationCap className="h-6 w-6" />
          </span>
          <span className="leading-tight">
            <span className={`block font-display text-xl font-bold transition ${scrolled ? "text-brand-900" : "text-white"}`}>Goodwill</span>
            <span className={`block text-[11px] font-medium tracking-[0.25em] uppercase ${scrolled ? "text-gold-600" : "text-gold-300"}`}>Academy</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          <NavLink href="/" active={pathname === "/"} light={!scrolled}>Home</NavLink>
          <div className="relative" onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
            <Link
              href="/courses"
              className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                pathname.startsWith("/courses")
                  ? scrolled ? "text-brand-700" : "text-gold-300"
                  : scrolled ? "text-ink/80 hover:text-brand-700" : "text-white/85 hover:text-white"
              }`}
              aria-expanded={megaOpen}
            >
              Courses <ChevronDown className={`h-4 w-4 transition ${megaOpen ? "rotate-180" : ""}`} />
            </Link>
            <AnimatePresence>
              {megaOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 top-full w-[760px] -translate-x-1/2 pt-3"
                >
                  <div className="grid grid-cols-4 gap-6 rounded-3xl border border-brand-100 bg-white p-6 shadow-2xl shadow-brand-900/10">
                    {categories.map((cat) => (
                      <div key={cat.slug}>
                        <Link
                          href={`/courses/${cat.slug}`}
                          className="mb-2 block font-display text-base font-semibold text-brand-800 hover:text-brand-600"
                        >
                          {cat.shortName}
                        </Link>
                        <ul className="space-y-1.5">
                          {cat.courses.map((c) => (
                            <li key={c.slug}>
                              <Link
                                href={`/courses/${cat.slug}/${c.slug}`}
                                className="block text-sm text-ink/70 transition hover:translate-x-1 hover:text-brand-600"
                              >
                                {c.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {links.slice(1).map((l) => (
            <NavLink key={l.href} href={l.href} active={pathname === l.href || pathname.startsWith(`${l.href}/`)} light={!scrolled}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:shadow-brand-600/50 sm:flex"
          >
            <Phone className="h-4 w-4" /> Call Now
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-brand-800 shadow-md lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-brand-100 bg-white lg:hidden"
            aria-label="Mobile"
          >
            <div className="max-h-[75vh] space-y-1 overflow-y-auto px-4 py-4">
              <Link href="/" className="block rounded-xl px-4 py-3 font-medium hover:bg-brand-50">Home</Link>
              <Link href="/courses" className="block rounded-xl px-4 py-3 font-medium hover:bg-brand-50">All Courses</Link>
              {categories.map((cat) => (
                <details key={cat.slug} className="group rounded-xl">
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-4 py-3 font-medium text-brand-800 hover:bg-brand-50">
                    {cat.shortName}
                    <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                  </summary>
                  <div className="ml-4 border-l-2 border-brand-100 pl-3">
                    <Link href={`/courses/${cat.slug}`} className="block px-3 py-2 text-sm font-semibold text-brand-600">
                      View all {cat.shortName} courses
                    </Link>
                    {cat.courses.map((c) => (
                      <Link key={c.slug} href={`/courses/${cat.slug}/${c.slug}`} className="block px-3 py-2 text-sm text-ink/70">
                        {c.title}
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
              {links.slice(1).map((l) => (
                <Link key={l.href} href={l.href} className="block rounded-xl px-4 py-3 font-medium hover:bg-brand-50">
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function NavLink({ href, active, light, children }: { href: string; active: boolean; light: boolean; children: React.ReactNode }) {
  const color = light
    ? active ? "text-gold-300" : "text-white/85 hover:text-white"
    : active ? "text-brand-700" : "text-ink/80 hover:text-brand-700";
  return (
    <Link
      href={href}
      className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${color}`}
    >
      {children}
      {active && (
        <motion.span layoutId="nav-dot" className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-gold-500" />
      )}
    </Link>
  );
}
