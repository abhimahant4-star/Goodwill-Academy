import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, BadgeCheck, BarChart3, CheckCircle2, Clock, IndianRupee, Phone } from "lucide-react";
import { CourseCard, KeywordTags, PageHero } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Faq } from "@/components/Faq";
import { getCategory, getCourse, getCourses, getCoursesByCategory, getSettings } from "@/lib/db";
import { SITE_NAME, SITE_URL, jsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ category: string; course: string }> };

export async function generateStaticParams() {
  // If the database isn't reachable during the build, pages are rendered on first visit instead.
  try {
    return (await getCourses()).map((c) => ({ category: c.categorySlug, course: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { category, course: slug } = await params;
  const course = await getCourse(category, slug);
  if (!course) return {};
  return pageMetadata({
    title: `${course.title} in Tarn Taran – Fees, Duration & Certificate`,
    description: `Join the best ${course.title.toLowerCase()} in Tarn Taran at Goodwill Skills Academy. ${course.shortDescription} ${course.duration} course with ${course.certificates.join(" & ")}.`.slice(0, 160),
    path: `/courses/${category}/${course.slug}`,
    keywords: course.keywords,
    image: course.image,
  });
}

export default async function CoursePage({ params }: Props) {
  const { category, course: slug } = await params;
  const [cat, course, settings] = await Promise.all([getCategory(category), getCourse(category, slug), getSettings()]);
  if (!cat || !course) notFound();
  const related = (await getCoursesByCategory(cat.slug)).filter((c) => c.id !== course.id).slice(0, 3);

  const faqs = [
    {
      q: `What is the duration of the ${course.title}?`,
      a: `The ${course.title} at Goodwill Skills Academy, Tarn Taran is a ${course.duration} programme. Batch timings are flexible — contact us to pick a slot that suits you.`,
    },
    {
      q: `What are the ${course.title} fees in Tarn Taran?`,
      a: `${course.fee === "Contact for fees" ? "Fees depend on the batch and any combo offer you choose." : `The course fee is ${course.fee}.`} Call ${settings.phone} or fill the enquiry form for the latest fees and offers.`,
    },
    {
      q: `Will I get a certificate after the ${course.title}?`,
      a: `Yes. On successful completion you will receive the ${course.certificates.join(" and ")}.`,
    },
    {
      q: "Who can join this course?",
      a: `Anyone interested can join — students, homemakers, job seekers and working professionals. Level: ${course.level}.`,
    },
  ];

  const url = `${SITE_URL}/courses/${cat.slug}/${course.slug}`;
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: course.title,
      description: course.description,
      url,
      provider: { "@type": "EducationalOrganization", name: SITE_NAME, sameAs: SITE_URL },
      educationalCredentialAwarded: course.certificates.join(", "),
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "Onsite",
        location: { "@type": "Place", name: SITE_NAME, address: settings.address },
      },
      offers: { "@type": "Offer", category: "Paid", availability: "https://schema.org/InStock", url },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Courses", item: `${SITE_URL}/courses` },
        { "@type": "ListItem", position: 3, name: cat.name, item: `${SITE_URL}/courses/${cat.slug}` },
        { "@type": "ListItem", position: 4, name: course.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  const facts = [
    { icon: Clock, label: "Duration", value: course.duration },
    { icon: BarChart3, label: "Level", value: course.level },
    { icon: IndianRupee, label: "Fees", value: course.fee },
    { icon: Award, label: "Certificate", value: course.certificates[0] },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
      <PageHero
        title={`${course.title} in Tarn Taran`}
        subtitle={course.shortDescription}
        gradient={cat.gradient}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Courses", href: "/courses" },
          { name: cat.shortName, href: `/courses/${cat.slug}` },
          { name: course.title, href: `/courses/${cat.slug}/${course.slug}` },
        ]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          {course.certificates.map((c) => (
            <span key={c} className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium ring-1 ring-white/25 backdrop-blur">
              <BadgeCheck className="h-4 w-4 text-gold-300" /> {c}
            </span>
          ))}
        </div>
      </PageHero>

      <div className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6">
        <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {facts.map(({ icon: I, label, value }) => (
            <StaggerItem key={label} className="rounded-2xl bg-white p-5 shadow-xl shadow-brand-900/10 ring-1 ring-brand-100">
              <I className="h-6 w-6 text-brand-500" />
              <p className="mt-3 text-xs font-semibold tracking-wider text-ink/50 uppercase">{label}</p>
              <p className="mt-1 font-semibold text-brand-950">{value}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_420px]">
        <div className="space-y-14">
          <Reveal>
            <h2 className="mb-4 font-display text-3xl font-bold text-brand-950">About the {course.title}</h2>
            <p className="text-lg leading-relaxed text-ink/70">{course.description}</p>
            <p className="mt-4 leading-relaxed text-ink/70">
              Looking for the best {course.title.toLowerCase()} in Tarn Taran, Amritsar or Patti? Goodwill Skills Academy
              combines expert trainers, practical sessions and recognised certification so you can start earning with
              confidence.
            </p>
          </Reveal>

          <div>
            <Reveal>
              <h2 className="mb-6 font-display text-3xl font-bold text-brand-950">What You Will Learn</h2>
            </Reveal>
            <Stagger className="grid gap-4 sm:grid-cols-2">
              {course.topics.map((t, i) => (
                <StaggerItem key={t}>
                  <div className="group flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-brand-100 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-900/10">
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${cat.gradient} font-display text-lg font-bold text-white`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-semibold text-brand-950">{t}</h3>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Reveal>
            <h2 className="mb-6 font-display text-3xl font-bold text-brand-950">Course Highlights</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                ...course.certificates,
                "Practical training with live demos",
                "Expert & experienced trainers",
                "Flexible batch timings",
                "Career & business guidance",
              ].map((h) => (
                <li key={h} className="flex items-start gap-3 text-ink/75">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" /> {h}
                </li>
              ))}
            </ul>
          </Reveal>

          <div>
            <Reveal>
              <h2 className="mb-6 font-display text-3xl font-bold text-brand-950">FAQs</h2>
            </Reveal>
            <Faq items={faqs} />
          </div>

          <KeywordTags keywords={course.keywords} />
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Reveal delay={0.15}>
            <EnquiryForm courses={[course.title]} defaultCourse={course.title} title={`Enrol in ${course.title}`} />
            <a
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
              className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-brand-950 px-6 py-4 font-semibold text-white transition hover:bg-brand-800"
            >
              <Phone className="h-5 w-5 text-gold-400" /> Call {settings.phone}
            </a>
          </Reveal>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="bg-gradient-to-b from-brand-50 to-cream py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-3xl font-bold text-brand-950">Related {cat.shortName} Courses</h2>
              <Link href={`/courses/${cat.slug}`} className="font-semibold text-brand-600 hover:text-brand-800">
                View all →
              </Link>
            </Reveal>
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <StaggerItem key={c.id} className="h-full">
                  <CourseCard course={c} category={cat} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}
    </>
  );
}
