import type { MetadataRoute } from "next";
import { SITE } from "@/site/ayarlar";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.adres}/sitemap.xml`,
  };
}
