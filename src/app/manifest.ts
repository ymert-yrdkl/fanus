import type { MetadataRoute } from "next";
import { SITE } from "@/site/ayarlar";
import { MARKA } from "@/site/seo";

/** Uygulama bildirimi: ana ekrana eklenince ad, renk ve simge. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.baslik,
    short_name: MARKA,
    description: SITE.aciklama,
    lang: "tr",
    start_url: "/",
    display: "browser",
    background_color: "#f4f3ee",
    theme_color: "#f4f3ee",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
  };
}
