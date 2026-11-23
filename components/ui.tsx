import Link from "next/link";
import { ArrowRight, Award, ChevronRight, Clock } from "lucide-react";
import type { Category, Course } from "@/lib/types";
import { Icon } from "./Icon";
import { Reveal, TiltCard } from "./motion";
import { sized } from "@/lib/images";

export function SectionHeading({
  eyebrow,
  title,
  text,
  center = true,
  light,
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <Reveal className={`mb-12 max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <span className="mb-3 inline-block rounded-full bg-gold-400/15 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-gold-600 uppercase">
        {eyebrow}
      </span>
      <h2 className={`font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl ${light ? "text-white" : "text-brand-950"}`}>
        {title}
      </h2>
      {text && <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? "text-white/70" : "text-ink/65"}`}>{text}</p>}
    </Reveal>
  );
}

export function CourseCard({ course, category }: { course: Course; category: Category }) {
  return (
    <TiltCard className="h-full">
      <Link
        href={`/courses/${category.slug}/${course.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg shadow-brand-900/5 ring-1 ring-brand-100 transition hover:shadow-2xl hover:shadow-brand-900/15"
      >
        <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${category.gradient}`}>
          {course.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sized(course.image, 640)}
              alt={course.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />
          ) : (
            <>
              <div className="grain absolute inset-0" aria-hidden />
              <Icon
                name={course.icon}
                className="absolute -right-6 -bottom-6 h-40 w-40 text-white/15 transition duration-700 group-hover:rotate-12 group-hover:scale-110"
                aria-hidden
              />
              <span className="absolute left-6 top-6 grid h-14 w-14 place-items-center rounded-2xl bg-white/20 text-white backdrop-blur-md ring-1 ring-white/30">
                <Icon name={course.icon} className="h-7 w-7" />
              </span>
            </>
          )}
          <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-800">
            <Clock className="h-3.5 w-3.5" /> {course.duration}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <span className="mb-1 text-xs font-semibold tracking-wider text-gold-600 uppercase">{category.shortName}</span>
          <h3 className="font-display text-xl font-bold text-brand-950 transition group-hover:text-brand-600">{course.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/65">{course.shortDescription}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {course.topics.slice(0, 3).map((t) => (
              <span key={t} className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-700">
                {t}
              </span>
            ))}
            {course.topics.length > 3 && (
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-700">
                +{course.topics.length - 3} more
              </span>
            )}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-brand-50 pt-4">
            <span className="flex items-center gap-1.5 text-xs font-medium text-ink/60">
              <Award className="h-4 w-4 text-gold-500" /> {course.certificates[0]}
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-white transition group-hover:translate-x-1 group-hover:bg-gold-500">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}

export type Crumb = { name: string; href: string };

export function PageHero({
  title,
  subtitle,
  crumbs,
  gradient = "from-brand-900 via-brand-800 to-brand-600",
  image,
  children,
}: {
  title: string;
  subtitle?: string;
  crumbs: Crumb[];
  gradient?: string;
  /** Optional background photo, tinted with the gradient so text stays readable */
  image?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={`relative overflow-clip bg-gradient-to-br ${gradient} pt-36 pb-20 text-white`}>
      {image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sized(image, 1600)} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden />
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.82]`} aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/30" aria-hidden />
        </>
      )}
      <div className="grain absolute inset-0" aria-hidden />
      <div className="absolute -right-24 -top-24 h-96 w-96 animate-float rounded-full bg-white/10 blur-3xl" aria-hidden />
      <div className="absolute -bottom-32 -left-16 h-80 w-80 animate-float rounded-full bg-gold-400/20 blur-3xl [animation-delay:2s]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-white/70">
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-4 w-4" />}
                  {i === crumbs.length - 1 ? (
                    <span className="text-white" aria-current="page">{c.name}</span>
                  ) : (
                    <Link href={c.href} className="hover:text-gold-300">{c.name}</Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="max-w-4xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{title}</h1>
          {subtitle && <p className="mt-5 max-w-2xl text-lg text-white/80">{subtitle}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}

/** Visible "popular searches" block — keeps target keywords in on-page content, not only meta tags. */
export function KeywordTags({ keywords, title = "Popular Searches" }: { keywords: string[]; title?: string }) {
  return (
    <div className="rounded-3xl bg-white p-6 ring-1 ring-brand-100">
      <h2 className="mb-4 font-display text-lg font-semibold text-brand-900">{title}</h2>
      <ul className="flex flex-wrap gap-2">
        {keywords.map((k) => (
          <li key={k} className="rounded-full border border-brand-100 bg-cream px-3 py-1.5 text-xs text-ink/70 capitalize">
            {k}
          </li>
        ))}
      </ul>
    </div>
  );
}
