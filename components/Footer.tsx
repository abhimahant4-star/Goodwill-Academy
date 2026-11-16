import Link from "next/link";
import { Clock, GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import type { Category, Settings } from "@/lib/types";

export function Footer({ settings, categories }: { settings: Settings; categories: Category[] }) {
  const socials = [
    { href: settings.instagram, label: "Instagram" },
    { href: settings.facebook, label: "Facebook" },
    { href: settings.youtube, label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <footer className="relative overflow-hidden bg-brand-950 text-white/80">
      <div className="grain absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="mb-4 flex items-center gap-2.5">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-gold-500 text-white">
              <GraduationCap className="h-6 w-6" />
            </span>
            <span className="font-display text-2xl font-bold text-white">Goodwill Academy</span>
          </Link>
          <p className="text-sm leading-relaxed">
            Best academy in {settings.city} for makeup, beauty, fashion designing, sewing and computer courses with
            International Certificate and Salon Certificate.
          </p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 px-3 py-1.5 text-xs transition hover:border-gold-400 hover:text-gold-300"
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg font-semibold text-white">Course Categories</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/courses/${c.slug}`} className="transition hover:text-gold-300">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg font-semibold text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/courses" className="hover:text-gold-300">All Courses</Link></li>
            <li><Link href="/about" className="hover:text-gold-300">About Us</Link></li>
            <li><Link href="/certificate" className="hover:text-gold-300">Certificate Verification</Link></li>
            <li><Link href="/contact" className="hover:text-gold-300">Contact &amp; Admission</Link></li>
            <li><Link href="/courses/beauty-makeup-courses/professional-makeup-course" className="hover:text-gold-300">Makeup Course in {settings.city}</Link></li>
            <li><Link href="/courses/fashion-designing-courses" className="hover:text-gold-300">Fashion Designing in {settings.city}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg font-semibold text-white">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-gold-400" />{settings.address}</li>
            <li className="flex gap-3">
              <Phone className="h-5 w-5 shrink-0 text-gold-400" />
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-gold-300">{settings.phone}</a>
            </li>
            <li className="flex gap-3">
              <Mail className="h-5 w-5 shrink-0 text-gold-400" />
              <a href={`mailto:${settings.email}`} className="hover:text-gold-300">{settings.email}</a>
            </li>
            <li className="flex gap-3"><Clock className="h-5 w-5 shrink-0 text-gold-400" />{settings.hours}</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Goodwill Academy, {settings.city}. All rights reserved.
      </div>
    </footer>
  );
}
