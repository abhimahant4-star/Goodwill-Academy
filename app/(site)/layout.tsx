import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getCategories, getCourses, getSettings } from "@/lib/db";
import { SITE_NAME, SITE_URL, jsonLd } from "@/lib/seo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories, courses] = await Promise.all([getSettings(), getCategories(), getCourses()]);

  const nav = categories.map((cat) => ({
    slug: cat.slug,
    shortName: cat.shortName,
    courses: courses.filter((c) => c.categorySlug === cat.slug).map((c) => ({ slug: c.slug, title: c.title })),
  }));

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: settings.city,
      addressRegion: "Punjab",
      postalCode: "143401",
      addressCountry: "IN",
    },
    sameAs: [settings.instagram, settings.facebook, settings.youtube].filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(orgSchema)} />
      <Header categories={nav} phone={settings.phone} />
      <main>{children}</main>
      <Footer settings={settings} categories={categories} />
      <WhatsAppButton number={settings.whatsapp} />
    </>
  );
}
