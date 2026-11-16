import type { Metadata, Viewport } from "next";
import { Great_Vibes, Playfair_Display, Poppins } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-poppins", display: "swap" });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-great-vibes", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Best Makeup, Fashion Designing & Computer Institute in Tarn Taran`,
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  formatDetection: { telephone: true },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#8f1d56",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${playfair.variable} ${poppins.variable} ${greatVibes.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
