import type { MetadataRoute } from "next";
import { SITE } from "@/site/ayarlar";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE.adres, lastModified: new Date("2026-10-20"), changeFrequency: "monthly", priority: 1 }];
}
