import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const SITE_NAME = "Goodwill Academy";
export const CITY = "Chandigarh";
export const NEARBY = ["Mohali", "Panchkula", "Zirakpur", "Kharar"];

/**
 * Builds a local-SEO keyword set for a course focus phrase,
 * e.g. focus = "bridal makeup" -> "best bridal makeup course in Chandigarh", ...
 */
export function localKeywords(focus: string, extra: string[] = []): string[] {
  const f = focus.toLowerCase();
  const base = [
    `best ${f} course in ${CITY}`,
    `${f} course in ${CITY}`,
    `${f} institute in ${CITY}`,
    `${f} classes in ${CITY}`,
    `${f} training in ${CITY}`,
    `${f} course near me`,
    `${f} course in ${NEARBY[0]}`,
    `${f} course in ${NEARBY[1]}`,
    `${f} course in ${NEARBY[2]}`,
    `${f} course with certificate`,
    `${f} course fees in ${CITY}`,
    `top ${f} academy in ${CITY}`,
  ];
  return dedupe([...extra.map((k) => k.toLowerCase()), ...base]);
}

export function dedupe(list: string[]): string[] {
  const seen = new Set<string>();
  return list
    .map((k) => k.trim())
    .filter((k) => {
      const key = k.toLowerCase();
      if (!k || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  keywords: string[];
  image?: string;
  /** Skip the "| Goodwill Academy Chandigarh" title suffix (used on the homepage). */
  absoluteTitle?: boolean;
};

export function pageMetadata({ title, description, path, keywords, image, absoluteTitle }: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: dedupe(keywords),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: SITE_NAME,
      locale: "en_IN",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
