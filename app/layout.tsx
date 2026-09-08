import type { Metadata, Viewport } from "next";
import "./globals.css";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { LiveBar } from "@/components/ui";
import { getMatches, getSettings, getSponsors } from "@/lib/queries";
import { SITE_URL } from "@/lib/supabase/env";
import { fallbackSettings } from "@/lib/fallback";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings().catch(() => fallbackSettings);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: settings.event_name,
      template: `%s · ${settings.event_short}`,
    },
    description: `${settings.tagline} ณ ${settings.venue_name}`,
    keywords: ["อีสปอร์ต", "esports", "สพฐ", "OBEC", "เบญจมราชูทิศ", "RoV", "จันทบุรี"],
    openGraph: {
      type: "website",
      locale: "th_TH",
      siteName: settings.event_short,
      title: settings.event_name,
      description: settings.tagline,
      url: SITE_URL,
    },
    twitter: { card: "summary_large_image", title: settings.event_name, description: settings.tagline },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#14265C",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, sponsors, matches] = await Promise.all([
    getSettings(),
    getSponsors(),
    getMatches(),
  ]);

  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chonburi&family=Anuphan:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a className="skip" href="#main">
          ข้ามไปยังเนื้อหาหลัก
        </a>
        <SiteHeader eventShort={settings.event_short} logoUrl={settings.logo_url || undefined} />
        <LiveBar matches={matches} />
        <main id="main">{children}</main>
        <SiteFooter settings={settings} sponsors={sponsors} />
      </body>
    </html>
  );
}
