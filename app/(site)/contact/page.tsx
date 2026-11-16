import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { KeywordTags, PageHero } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { EnquiryForm } from "@/components/EnquiryForm";
import { getCourses, getSettings } from "@/lib/db";
import { pageMetadata } from "@/lib/seo";

const KEYWORDS = [
  "Goodwill Academy contact number",
  "Goodwill Academy Chandigarh address",
  "admission open in Chandigarh",
  "makeup course admission in Chandigarh",
  "fashion designing admission in Chandigarh",
  "computer course admission in Chandigarh",
  "sewing classes near me",
  "beauty academy near me",
  "computer institute near me",
  "fashion designing institute near me",
  "free career counselling Chandigarh",
];

export const metadata = pageMetadata({
  title: "Contact & Admission – Goodwill Academy Chandigarh",
  description:
    "Contact Goodwill Academy Chandigarh for admission in makeup, beauty, fashion designing, sewing and computer courses. Call, WhatsApp or fill the form for free counselling.",
  path: "/contact",
  keywords: KEYWORDS,
});

export default async function ContactPage() {
  const [settings, courses] = await Promise.all([getSettings(), getCourses()]);
  const cards = [
    { icon: Phone, title: "Call Us", value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` },
    { icon: Mail, title: "Email Us", value: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, title: "Visit Us", value: settings.address },
    { icon: Clock, title: "Timings", value: settings.hours },
  ];

  return (
    <>
      <PageHero
        title="Contact Goodwill Academy"
        subtitle="Admissions are open! Talk to our counsellor and find the right course for your career."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Stagger className="mb-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: I, title, value, href }) => {
            const body = (
              <>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-gold-500 text-white">
                  <I className="h-6 w-6" />
                </span>
                <h2 className="mt-4 font-display text-lg font-bold text-brand-950">{title}</h2>
                <p className="mt-1 text-sm break-words text-ink/70">{value}</p>
              </>
            );
            return (
              <StaggerItem key={title}>
                {href ? (
                  <a href={href} className="block h-full rounded-3xl bg-white p-6 ring-1 ring-brand-100 transition hover:-translate-y-1 hover:shadow-xl">
                    {body}
                  </a>
                ) : (
                  <div className="h-full rounded-3xl bg-white p-6 ring-1 ring-brand-100">{body}</div>
                )}
              </StaggerItem>
            );
          })}
        </Stagger>

        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <EnquiryForm courses={courses.map((c) => c.title)} title="Send Us an Enquiry" />
          </Reveal>
          <Reveal delay={0.1}>
            {settings.mapEmbedUrl.startsWith("https://www.google.com/maps/embed") ? (
              <iframe
                src={settings.mapEmbedUrl}
                title="Goodwill Academy location map"
                className="h-full min-h-[420px] w-full rounded-3xl ring-1 ring-brand-100"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="grid h-full min-h-[420px] place-items-center rounded-3xl bg-gradient-to-br from-brand-100 to-gold-300/40 p-10 text-center">
                <div>
                  <MapPin className="mx-auto h-14 w-14 text-brand-600" />
                  <p className="mt-4 font-display text-2xl font-bold text-brand-950">{settings.address}</p>
                  <p className="mt-2 text-sm text-ink/60">Add a Google Maps embed link from the admin panel to show the map here.</p>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <KeywordTags keywords={KEYWORDS} />
      </section>
    </>
  );
}
