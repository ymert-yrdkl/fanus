import CagriBandi from "@/bilesenler/CagriBandi";
import FiyatListesi from "@/bilesenler/FiyatListesi";
import Giris from "@/bilesenler/Giris";
import HizmetVitrini from "@/bilesenler/HizmetVitrini";
import Isler from "@/bilesenler/Isler";
import Manifesto from "@/bilesenler/Manifesto";
import Serit from "@/bilesenler/Serit";
import FanusSahnesi from "@/sahne/FanusSahnesi";
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
      {/* Telefonda en büyük öğe fanusun sabit görseli: HTML gelir gelmez istensin (LCP). HTML'e gömmek denendi:
          Next görseli sayfa verisinde ikinci kez yazdığı için HTML ~19 KB büyüyor, ölçüme faydası çıkmadı */}
      <link rel="preload" as="image" href="/fanus-telefon.webp" media="(max-width: 767px)" fetchPriority="high" />
      <FanusSahnesi />
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
