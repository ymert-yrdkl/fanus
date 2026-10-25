import CagriBandi from "@/bilesenler/CagriBandi";
import FiyatListesi from "@/bilesenler/FiyatListesi";
import Giris from "@/bilesenler/Giris";
import HizmetVitrini from "@/bilesenler/HizmetVitrini";
import Isler from "@/bilesenler/Isler";
import Manifesto from "@/bilesenler/Manifesto";
import Serit from "@/bilesenler/Serit";
import FanusSahnesi from "@/sahne/FanusSahnesi";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { SITE } from "@/site/ayarlar";
import { REFERANSLAR } from "@/site/icerik";
import { qrSvgUret } from "@/site/qr";
import { jsonLd, sayfaMetasi, sayfaVerisi } from "@/site/seo";

export const metadata: Metadata = sayfaMetasi({
  baslik: SITE.baslik,
  aciklama: SITE.aciklama,
  yol: "/",
  tamBaslik: true,
});

/**
 * Telefonda ekranın en büyük öğesi fanusun sabit görseli (yaklaşık 10 KB). Ayrı istenince JavaScript çalışırken
 * çizimi saniyelerce gecikiyordu (Lighthouse: LCP 4,7 sn, 4 sn'si çizim gecikmesi); HTML'e gömülünce metinle
 * birlikte çizilir. Derleme anında okunur (sayfa durağan); görsel `npm run poster` ile yenilenir.
 */
const POSTER = `data:image/webp;base64,${readFileSync(join(process.cwd(), "public/fanus-telefon.webp")).toString("base64")}`;

export default async function AnaSayfa() {
  const qrSvg = await qrSvgUret();

  const yapilandirilmisVeri = {
    "@context": "https://schema.org",
    "@graph": [
      sayfaVerisi({ yol: "/", baslik: SITE.baslik, aciklama: SITE.aciklama }),
      {
        "@type": "ItemList",
        "@id": `${SITE.adres}/#isler`,
        name: "Yayındaki işler",
        itemListElement: REFERANSLAR.map((r, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: r.adres,
          name: r.ad,
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(yapilandirilmisVeri) }} />
      <FanusSahnesi poster={POSTER} />
      {/* Bütün sayfa kâğıt üstünde (3B sahne dahil); tek koyu blok fiyat tahtası (kendi data-zemin="koyu"su) */}
      <main id="icerik" data-zemin="acik">
        <Giris />
        <Manifesto />
        <Serit />
        <HizmetVitrini qrSvg={qrSvg} />
        <Isler />
        <FiyatListesi />
        <CagriBandi />
      </main>
    </>
  );
}
