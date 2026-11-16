import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CourseCard, KeywordTags, PageHero } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Icon } from "@/components/Icon";
import { getCategories, getCourses } from "@/lib/db";
import { pageMetadata } from "@/lib/seo";

const KEYWORDS = [
  "courses in Chandigarh",
  "best courses after 12th in Chandigarh",
  "short term courses in Chandigarh",
  "job oriented courses in Chandigarh",
  "makeup course in Chandigarh",
  "best fashion designing course in Chandigarh",
  "computer course in Chandigarh",
  "sewing course in Chandigarh",
  "certificate courses for girls in Chandigarh",
  "professional courses with international certificate",
  "skill development courses in Mohali",
  "courses in Panchkula",
];

export const metadata = pageMetadata({
  title: "All Courses – Makeup, Fashion Designing, Sewing & Computer Courses in Chandigarh",
  description:
    "Explore all certified courses at Goodwill Academy Chandigarh: makeup, hair, skin & nail art, fashion designing, sewing & tailoring, basic computer, MS Office, Tally with GST, typing and advanced Excel.",
  path: "/courses",
  keywords: KEYWORDS,
});

export default async function CoursesPage() {
  const [categories, courses] = await Promise.all([getCategories(), getCourses()]);

  return (
    <>
      <PageHero
        title="All Courses at Goodwill Academy, Chandigarh"
        subtitle="Job-oriented certificate courses in beauty & makeup, fashion designing, sewing and computers — choose a category to get started."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Courses", href: "/courses" },
        ]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <a
              key={cat.slug}
              href={`#${cat.slug}`}
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20"
            >
              <Icon name={cat.icon} className="h-4 w-4" /> {cat.shortName}
            </a>
          ))}
        </div>
      </PageHero>

      <div className="mx-auto max-w-7xl space-y-24 px-4 py-20 sm:px-6">
        {categories.map((cat) => {
          const list = courses.filter((c) => c.categorySlug === cat.slug);
          if (!list.length) return null;
          return (
            <section key={cat.slug} id={cat.slug} className="scroll-mt-28">
              <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${cat.gradient} text-white shadow-lg`}>
                    <Icon name={cat.icon} className="h-7 w-7" />
                  </span>
                  <div>
                    <h2 className="font-display text-3xl font-bold text-brand-950">{cat.name}</h2>
                    <p className="text-sm text-ink/60">{cat.tagline}</p>
                  </div>
                </div>
                <Link href={`/courses/${cat.slug}`} className="flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-800">
                  View category <ArrowRight className="h-4 w-4" />
                </Link>
              </Reveal>
              <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((c) => (
                  <StaggerItem key={c.id} className="h-full">
                    <CourseCard course={c} category={cat} />
                  </StaggerItem>
                ))}
              </Stagger>
            </section>
          );
        })}
        <KeywordTags keywords={KEYWORDS} />
      </div>
    </>
  );
}
