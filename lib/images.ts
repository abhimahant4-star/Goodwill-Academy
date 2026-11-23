/**
 * Default course and category photos (free Unsplash License — https://unsplash.com/license).
 * The academy can replace any of them with its own photo from Admin → Courses.
 */
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

export const CATEGORY_PHOTOS: Record<string, string> = {
  "beauty-makeup-courses": unsplash("1709477542149-f4e0e21d590b"),
  "fashion-designing-courses": unsplash("1753162658653-d33c53910d9e"),
  "computer-courses": unsplash("1778489769184-45868633c527"),
  "sewing-courses": unsplash("1641320197434-6ae0ca235048"),
};

export const COURSE_PHOTOS: Record<string, string> = {
  "professional-makeup-course": unsplash("1610173827043-9db50e0d8ef9"),
  "hair-course": unsplash("1580618672591-eb180b1a973f"),
  "skin-and-beauty-course": unsplash("1570172619644-dfd03ed5d881"),
  "nail-art-course": unsplash("1632345031435-8727f6897d53"),
  "fashion-designing-sketching": unsplash("1557777586-f6682739fcf3"),
  "cutting-and-pattern-making": unsplash("1718184021018-d2158af6b321"),
  "stitching-and-tailoring": unsplash("1606501126768-b78d4569d3f9"),
  "embroidery-and-suit-designing": unsplash("1771479452306-6dad4a9fbec0"),
  "fabric-and-colour-knowledge": unsplash("1630920501459-f3e99320c4a5"),
  "advanced-dress-designing": unsplash("1767955694884-d4bf352c23c2"),
  "basic-computer-course": unsplash("1719159381981-1327b22aff9b"),
  "ms-office-course": unsplash("1633114127408-af671c774b39"),
  "tally-with-gst-course": unsplash("1626266061368-46a8f578ddd6"),
  "typing-course": unsplash("1461773518188-b3e86f98242f"),
  "advanced-excel-course": unsplash("1783115259399-3a5a3e0e4592"),
  "sewing-course": unsplash("1630930678172-63343537a00a"),
};

/** Requests a smaller version of Unsplash photos (other URLs are returned unchanged). */
export function sized(url: string | undefined, width: number) {
  if (!url) return undefined;
  if (!url.startsWith("https://images.unsplash.com/")) return url;
  const u = new URL(url);
  u.searchParams.set("w", String(width));
  return u.toString();
}
