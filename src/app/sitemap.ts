import type { MetadataRoute } from "next";
import { HIZMETLER, REFERANSLAR } from "@/site/icerik";
import { tamAdres } from "@/site/seo";

/** Derleme anı: her yayın yeni içerik getirir, son değişiklik tarihi odur. */
const SON_GUNCELLEME = new Date();

/** Bir referansın görselleri (site ekranları ya da mağaza görselleri), tam adresle. */
function referansGorselleri(kodlar: string[]) {
  return REFERANSLAR.filter((r) => kodlar.includes(r.kod)).flatMap((r) =>
    [r.masaustu?.src, r.telefon?.src, ...(r.uygulama?.ekranlar.map((e) => e.src) ?? [])]
      .filter((src): src is string => Boolean(src))
      .map(tamAdres),
  );
}

/** Site haritası: her sayfa, son değişiklik tarihi ve sayfadaki görseller (Google Görseller için). */
export default function sitemap(): MetadataRoute.Sitemap {
  const butunIsler = REFERANSLAR.map((r) => r.kod);
  const paylasimGorseli = tamAdres("/opengraph-image.png");

  const sayfalar: { yol: string; oncelik: number; gorseller: string[] }[] = [
    { yol: "/", oncelik: 1, gorseller: [paylasimGorseli, ...referansGorselleri(butunIsler)] },
    { yol: "/hizmetler", oncelik: 0.9, gorseller: [] },
    ...HIZMETLER.map((h) => ({
      yol: `/hizmetler/${h.adres}`,
      oncelik: 0.9,
      gorseller: referansGorselleri(h.referanslar ?? []),
    })),
    { yol: "/fiyatlar", oncelik: 0.9, gorseller: [] },
    { yol: "/isler", oncelik: 0.7, gorseller: referansGorselleri(butunIsler) },
    { yol: "/iletisim", oncelik: 0.6, gorseller: [] },
  ];

  return sayfalar.map((s) => ({
    url: tamAdres(s.yol),
    lastModified: SON_GUNCELLEME,
    changeFrequency: "monthly",
    priority: s.oncelik,
    ...(s.gorseller.length ? { images: s.gorseller } : {}),
  }));
}
