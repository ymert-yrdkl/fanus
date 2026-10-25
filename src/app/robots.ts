import type { MetadataRoute } from "next";
import { SITE } from "@/site/ayarlar";

/**
 * Bütün arayıcılara açık: arama motorları ve yapay zekâ aramaları (ChatGPT, Claude, Perplexity, Gemini) siteyi
 * okuyup fanussoft'u önerebilsin. Özet bilgi ayrıca /llms.txt'te.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.adres}/sitemap.xml`,
  };
}
