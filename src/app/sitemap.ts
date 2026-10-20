import type { MetadataRoute } from "next";
import { SITE } from "@/site/ayarlar";
import { HIZMETLER } from "@/site/icerik";

export default function sitemap(): MetadataRoute.Sitemap {
  const tarih = new Date("2026-10-20");
  const sayfalar = [
    "",
    "/hizmetler",
    "/fiyatlar",
    "/isler",
    "/iletisim",
    ...HIZMETLER.map((h) => `/hizmetler/${h.adres}`),
  ];
  return sayfalar.map((yol) => ({
    url: `${SITE.adres}${yol}`,
    lastModified: tarih,
    changeFrequency: "monthly",
    priority: yol === "" ? 1 : 0.8,
  }));
}
