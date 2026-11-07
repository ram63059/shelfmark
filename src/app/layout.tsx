import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Shelfmark — AI Shopping Readiness Score for Shopify Stores",
    template: "%s | Shelfmark",
  },
  description:
    "See your Shopify store the way AI shopping assistants do. Get a free readiness score and a prioritized fix list in under a minute.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://shelfmark.app"
  ),
  openGraph: {
    type: "website",
    siteName: "Shelfmark",
    title: "Shelfmark — AI Shopping Readiness Score for Shopify Stores",
    description:
      "See your Shopify store the way AI shopping assistants do. Get a free readiness score and a prioritized fix list in under a minute.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shelfmark — AI Shopping Readiness Score for Shopify Stores",
    description:
      "See your Shopify store the way AI shopping assistants do. Get a free readiness score and a prioritized fix list in under a minute.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${hankenGrotesk.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased bg-paper text-ink">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
