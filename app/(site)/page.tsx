import Link from "next/link";
import { ArrowRight, Award, BadgeCheck, Briefcase, Clock, Globe, HeartHandshake, Scissors, Users } from "lucide-react";
import { HomeHero } from "@/components/HomeHero";
import { Counter, Reveal, Stagger, StaggerItem, TiltCard } from "@/components/motion";
import { CourseCard, KeywordTags, SectionHeading } from "@/components/ui";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Faq } from "@/components/Faq";
import { Icon } from "@/components/Icon";
import { getCategories, getCourses } from "@/lib/db";
import { jsonLd, pageMetadata } from "@/lib/seo";

const HOME_KEYWORDS = [
  "best makeup academy in Chandigarh",
  "best fashion designing course in Chandigarh",
  "best computer institute in Chandigarh",
  "beautician course in Chandigarh",
  "bridal makeup course in Chandigarh",
  "sewing and tailoring course in Chandigarh",
  "Tally with GST course in Chandigarh",
  "hair styling course in Chandigarh",
  "nail art course in Chandigarh",
  "salon course with international certificate",
  "fashion designing institute in Mohali",
  "makeup course in Panchkula",
  "Goodwill Academy Chandigarh",
];

export const metadata = pageMetadata({
  title: "Goodwill Academy | Best Makeup, Fashion Designing & Computer Institute in Chandigarh",
  description:
    "Goodwill Academy Chandigarh offers professional makeup, hair, skin, nail art, fashion designing, sewing and computer courses (Tally, MS Office, Excel) with International & Salon Certificate. Enrol today!",
  path: "/",
  keywords: HOME_KEYWORDS,
  absoluteTitle: true,
});

const faqs = [
  {
    q: "Which is the best makeup and beauty academy in Chandigarh?",
    a: "Goodwill Academy is one of the best makeup academies in Chandigarh, offering professional makeup, hair, skin & beauty and nail art courses with both an International Certificate and a Salon Certificate, taught through hands-on practice on real models.",
  },
  {
    q: "Do you offer a fashion designing course in Chandigarh with certificate?",
    a: "Yes. Our fashion designing courses cover sketching, cutting & pattern making, stitching & tailoring, embroidery, fabric & colour knowledge and advanced lehenga and bridal dress designing — all with an International Certificate.",
  },
  {
    q: "Which computer courses are available at Goodwill Academy?",
    a: "We offer a Basic Computer Course, MS Office, Tally with GST, English/Hindi/Punjabi typing and Advanced Excel — practical, job-oriented computer courses for students, homemakers and job seekers in Chandigarh, Mohali and Panchkula.",
  },
  {
    q: "What certificates will I get after completing a course?",
    a: "All students receive an International Certificate. Beauty, makeup, hair, skin and nail art students also receive a Salon Certificate, which helps you get jobs in salons or start your own parlour.",
  },
  {
    q: "Can I join if I am a complete beginner?",
    a: "Absolutely. Every course starts from the basics and moves step by step to advanced level, with small batches and personal attention from trainers.",
  },
];

const whyUs = [
  { icon: Globe, title: "International Certificate", text: "Globally recognised certification that adds weight to your CV and portfolio." },
  { icon: Award, title: "Salon Certificate", text: "Industry certificate for beauty & salon students to start working with confidence." },
  { icon: Scissors, title: "100% Practical Training", text: "Hands-on practice on real models, real fabrics and real software from day one." },
  { icon: Users, title: "Small Batches", text: "Personal attention from experienced trainers in every class." },
  { icon: Clock, title: "Flexible Timings", text: "Morning, afternoon and evening batches for students, homemakers and professionals." },
  { icon: Briefcase, title: "Career Guidance", text: "Help with jobs, freelancing and starting your own parlour, boutique or business." },
];

export default async function HomePage() {
  const [categories, courses] = await Promise.all([getCategories(), getCourses()]);
  const featured = courses.filter((c) => c.featured).slice(0, 6);
  const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema)} />
      <HomeHero />

      {/* Marquee */}
      <div className="relative -mt-px overflow-hidden border-y border-gold-400/30 bg-brand-950 py-4">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...courses, ...courses].map((c, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-lg text-white/80">
              {c.title}
              <span className="text-gold-400">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { n: courses.length, s: "+", label: "Professional Courses" },
            { n: categories.length, s: "", label: "Career Streams" },
            { n: 2, s: "", label: "Certificates (International & Salon)" },
            { n: 100, s: "%", label: "Practical Training" },
          ].map((st) => (
            <StaggerItem key={st.label} className="rounded-3xl bg-white p-6 text-center shadow-lg shadow-brand-900/5 ring-1 ring-brand-100">
              <p className="font-display text-4xl font-bold text-brand-600 sm:text-5xl">
                <Counter to={st.n} suffix={st.s} />
              </p>
              <p className="mt-2 text-sm text-ink/60">{st.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <SectionHeading
          eyebrow="Our Course Categories"
          title={<>Choose Your <span className="text-gradient">Career Path</span></>}
          text="From makeup and fashion designing to sewing and computer courses — Goodwill Academy is your one-stop skill academy in Chandigarh."
        />
        <Stagger className="grid gap-6 md:grid-cols-2">
          {categories.map((cat) => {
            const count = courses.filter((c) => c.categorySlug === cat.slug).length;
            return (
              <StaggerItem key={cat.slug}>
                <TiltCard>
                  <Link
                    href={`/courses/${cat.slug}`}
                    className={`group relative flex min-h-64 flex-col justify-end overflow-hidden rounded-[2rem] bg-gradient-to-br ${cat.gradient} p-8 text-white shadow-xl`}
                  >
                    <div className="grain absolute inset-0" aria-hidden />
                    <Icon
                      name={cat.icon}
                      className="absolute -right-8 -top-8 h-56 w-56 text-white/15 transition duration-700 group-hover:rotate-12 group-hover:scale-110"
                      aria-hidden
                    />
                    <span className="relative mb-auto inline-flex w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                      {count} {count === 1 ? "Course" : "Courses"}
                    </span>
                    <h3 className="relative mt-10 font-display text-3xl font-bold">{cat.name}</h3>
                    <p className="relative mt-2 max-w-md text-white/85">{cat.tagline}</p>
                    <span className="relative mt-5 inline-flex items-center gap-2 font-semibold">
                      Explore courses <ArrowRight className="h-5 w-5 transition group-hover:translate-x-2" />
                    </span>
                  </Link>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* Certificates */}
      <section className="relative overflow-clip bg-brand-950 py-24 text-white">
        <div className="grain absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <SectionHeading
              light
              center={false}
              eyebrow="Certification"
              title={<>Get Certified with <span className="text-gradient">International &amp; Salon</span> Certificates</>}
              text="Every Goodwill Academy course ends with a recognised certificate, so your skills are trusted by salons, boutiques, offices and clients."
            />
          </div>
          <Stagger className="grid gap-5 sm:grid-cols-2">
            {[
              { title: "International Certificate", text: "Awarded on all courses — beauty, fashion designing, sewing and computer.", icon: Globe },
              { title: "Salon Certificate", text: "For makeup, hair, skin & nail art students — your passport to salon jobs.", icon: BadgeCheck },
            ].map(({ title, text, icon: I }) => (
              <StaggerItem key={title}>
                <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 p-8 ring-1 ring-gold-400/30 backdrop-blur">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold-400/20 blur-2xl" />
                  <I className="h-12 w-12 text-gold-400" />
                  <h3 className="mt-5 font-display text-2xl font-bold">{title}</h3>
                  <p className="mt-2 text-sm text-white/70">{text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Featured courses */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionHeading
          eyebrow="Popular Courses"
          title={<>Most Loved <span className="text-gradient">Courses</span> in Chandigarh</>}
          text="Hand-picked courses our students join the most — each with practical training and certification."
        />
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => (
            <StaggerItem key={c.id} className="h-full">
              <CourseCard course={c} category={catBySlug[c.categorySlug]} />
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-12 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-4 font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700"
          >
            View All Courses <ArrowRight className="h-5 w-5" />
          </Link>
        </Reveal>
      </section>

      {/* Why us */}
      <section className="bg-gradient-to-b from-brand-50 to-cream py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Why Goodwill Academy"
            title={<>Why Students Choose <span className="text-gradient">Goodwill</span></>}
          />
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map(({ icon: I, title, text }) => (
              <StaggerItem key={title}>
                <div className="group h-full rounded-3xl bg-white p-7 ring-1 ring-brand-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/10">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-gold-500 text-white shadow-lg transition group-hover:rotate-6">
                    <I className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-brand-950">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* FAQ + enquiry */}
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2">
        <div>
          <SectionHeading center={false} eyebrow="FAQs" title="Frequently Asked Questions" />
          <Faq items={faqs} />
        </div>
        <Reveal delay={0.1} className="lg:pt-24">
          <EnquiryForm courses={courses.map((c) => c.title)} />
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white p-4 text-sm text-ink/70 ring-1 ring-brand-100">
            <HeartHandshake className="h-6 w-6 shrink-0 text-brand-500" />
            Not sure which course is right for you? Our counsellors will guide you for free.
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <KeywordTags keywords={HOME_KEYWORDS} />
      </section>
    </>
  );
}
