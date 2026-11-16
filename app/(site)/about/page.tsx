import Link from "next/link";
import { ArrowRight, Globe, Heart, Lightbulb, Target } from "lucide-react";
import { KeywordTags, PageHero, SectionHeading } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Icon } from "@/components/Icon";
import { getCategories } from "@/lib/db";
import { pageMetadata } from "@/lib/seo";

const KEYWORDS = [
  "about Goodwill Academy Chandigarh",
  "best skill academy in Chandigarh",
  "best makeup academy in Chandigarh",
  "best fashion designing institute in Chandigarh",
  "best computer institute in Chandigarh",
  "sewing institute in Chandigarh",
  "international certificate courses in Chandigarh",
  "salon certificate course in Chandigarh",
  "vocational training institute in Chandigarh",
  "skill courses for women in Chandigarh",
  "beauty academy in Mohali",
  "training institute in Panchkula",
];

export const metadata = pageMetadata({
  title: "About Us – Best Skill Academy in Chandigarh",
  description:
    "Goodwill Academy is a Chandigarh skill academy offering certified beauty, makeup, fashion designing, sewing and computer courses with International & Salon Certificates and 100% practical training.",
  path: "/about",
  keywords: KEYWORDS,
});

export default async function AboutPage() {
  const categories = await getCategories();
  return (
    <>
      <PageHero
        title="About Goodwill Academy"
        subtitle="Empowering students in Chandigarh with practical, certified skills that turn passion into a profession."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <h2 className="font-display text-4xl font-bold text-brand-950">
            A Trusted Skill Academy in <span className="text-gradient">Chandigarh</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink/70">
            Goodwill Academy is a career-focused training institute in Chandigarh offering professional courses in
            beauty &amp; makeup, fashion designing, sewing &amp; tailoring and computers. Our mission is simple: give every
            student practical, job-ready skills and a certificate they can be proud of.
          </p>
          <p className="mt-4 leading-relaxed text-ink/70">
            Students from Chandigarh, Mohali, Panchkula and Zirakpur learn with us through small batches, hands-on
            practice and supportive trainers. Every course is backed by an International Certificate, and our beauty
            students also earn a Salon Certificate.
          </p>
          <Link
            href="/courses"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand-600/30 hover:bg-brand-700"
          >
            Explore Courses <ArrowRight className="h-5 w-5" />
          </Link>
        </Reveal>
        <Stagger className="grid grid-cols-2 gap-4">
          {categories.map((cat) => (
            <StaggerItem key={cat.slug}>
              <Link
                href={`/courses/${cat.slug}`}
                className={`group relative flex aspect-square flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br ${cat.gradient} p-5 text-white shadow-xl`}
              >
                <Icon name={cat.icon} className="absolute right-4 top-4 h-12 w-12 text-white/70 transition group-hover:scale-125" />
                <span className="font-display text-xl font-bold">{cat.shortName}</span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="bg-brand-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading light eyebrow="Our Values" title="What Drives Us" />
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Target, t: "Our Mission", d: "Make quality skill education affordable and accessible for everyone." },
              { icon: Lightbulb, t: "Practical Learning", d: "Learning by doing — every concept is practised, not just taught." },
              { icon: Globe, t: "Recognised Certification", d: "International and Salon Certificates that add real value." },
              { icon: Heart, t: "Student First", d: "Personal attention, flexible timings and lifelong guidance." },
            ].map(({ icon: I, t, d }) => (
              <StaggerItem key={t}>
                <div className="h-full rounded-3xl bg-white/5 p-7 ring-1 ring-white/10 transition hover:bg-white/10">
                  <I className="h-10 w-10 text-gold-400" />
                  <h3 className="mt-4 font-display text-xl font-bold">{t}</h3>
                  <p className="mt-2 text-sm text-white/70">{d}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <KeywordTags keywords={KEYWORDS} />
      </section>
    </>
  );
}
