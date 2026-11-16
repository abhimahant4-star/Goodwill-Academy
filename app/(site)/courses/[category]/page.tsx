import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { CourseCard, KeywordTags, PageHero } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Faq } from "@/components/Faq";
import { getCategories, getCategory, getCoursesByCategory } from "@/lib/db";
import { SITE_URL, jsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  // If the database isn't reachable during the build, pages are rendered on first visit instead.
  try {
    return (await getCategories()).map((c) => ({ category: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const cat = await getCategory(category);
  if (!cat) return {};
  return pageMetadata({
    title: `${cat.name} in Tarn Taran – Certified ${cat.shortName} Training`,
    description: cat.description.slice(0, 158),
    path: `/courses/${cat.slug}`,
    keywords: cat.keywords,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = await getCategory(category);
  if (!cat) notFound();
  const courses = await getCoursesByCategory(cat.slug);

  const faqs = [
    {
      q: `Which is the best institute for ${cat.shortName.toLowerCase()} courses in Tarn Taran?`,
      a: `Goodwill Skills Academy is among the best institutes for ${cat.shortName.toLowerCase()} courses in Tarn Taran, with practical training, experienced trainers and an International Certificate${cat.slug === "beauty-makeup-courses" ? " plus Salon Certificate" : ""}.`,
    },
    {
      q: `How many ${cat.shortName.toLowerCase()} courses does Goodwill Skills Academy offer?`,
      a: `We currently offer ${courses.length} ${cat.shortName.toLowerCase()} course${courses.length === 1 ? "" : "s"}: ${courses.map((c) => c.title).join(", ")}.`,
    },
    {
      q: "Are students from Amritsar, Patti and Goindwal Sahib welcome?",
      a: "Yes, students from Tarn Taran, Amritsar, Patti, Goindwal Sahib, Bhikhiwind and nearby areas join our courses. Flexible batch timings make it easy to attend.",
    },
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: cat.name,
      itemListElement: courses.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/courses/${cat.slug}/${c.slug}`,
        name: c.title,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Courses", item: `${SITE_URL}/courses` },
        { "@type": "ListItem", position: 3, name: cat.name, item: `${SITE_URL}/courses/${cat.slug}` },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
      <PageHero
        title={`${cat.name} in Tarn Taran`}
        subtitle={cat.tagline}
        gradient={cat.gradient}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Courses", href: "/courses" },
          { name: cat.shortName, href: `/courses/${cat.slug}` },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal className="mx-auto mb-14 max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-ink/70">{cat.description}</p>
        </Reveal>
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <StaggerItem key={c.id} className="h-full">
              <CourseCard course={c} category={cat} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="bg-gradient-to-b from-brand-50 to-cream py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <Reveal>
              <h2 className="mb-6 font-display text-3xl font-bold text-brand-950">
                Why join our {cat.shortName} course in Tarn Taran?
              </h2>
              <ul className="mb-10 space-y-3">
                {[
                  "Practical, hands-on training from day one",
                  `International Certificate${cat.slug === "beauty-makeup-courses" ? " & Salon Certificate" : ""}`,
                  "Experienced and friendly trainers",
                  "Small batches with personal attention",
                  "Flexible morning & evening batches",
                  "Guidance for jobs and starting your own business",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-3 text-ink/75">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" /> {p}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Faq items={faqs} />
          </div>
          <Reveal delay={0.1}>
            <EnquiryForm courses={courses.map((c) => c.title)} title={`Enquire about ${cat.shortName} Courses`} />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <KeywordTags keywords={cat.keywords} />
      </section>
    </>
  );
}
