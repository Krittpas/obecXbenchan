import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/queries";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSettings();
  return {
    name: settings.event_name,
    short_name: settings.event_short,
    description: settings.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#E7E9F0",
    theme_color: "#14265C",
    lang: "th",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
