import GecisBandi from "@/bilesenler/GecisBandi";
import CagriBandi from "@/bilesenler/CagriBandi";
import FiyatListesi from "@/bilesenler/FiyatListesi";
import Giris from "@/bilesenler/Giris";
import HizmetVitrini from "@/bilesenler/HizmetVitrini";
import Isler from "@/bilesenler/Isler";
import Manifesto from "@/bilesenler/Manifesto";
import Serit from "@/bilesenler/Serit";
import FanusSahnesi from "@/sahne/FanusSahnesi";
import { SITE } from "@/site/ayarlar";
import { REFERANSLAR } from "@/site/icerik";
import { qrSvgUret } from "@/site/qr";

export default async function AnaSayfa() {
  const qrSvg = await qrSvgUret();

  const yapilandirilmisVeri = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${SITE.adres}/#isletme`,
        name: "fanus",
        url: SITE.adres,
        description: SITE.aciklama,
        areaServed: { "@type": "Country", name: "Türkiye" },
        ...(SITE.eposta ? { email: SITE.eposta } : {}),
        ...(SITE.telefon ? { telephone: SITE.telefon } : {}),
        knowsAbout: [
          "E-ticaret sitesi",
          "Kurumsal web sitesi",
          "QR menü",
          "NFC kart sistemleri",
          "Özel yazılım",
          "Web ve üretim otomasyonu",
        ],
      },
      {
        "@type": "ItemList",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(yapilandirilmisVeri).replace(/</g, "\\u003c") }}
      />
      {/* Telefonda en büyük öğe fanusun sabit görseli: HTML gelir gelmez istensin (LCP) */}
      <link rel="preload" as="image" href="/fanus-telefon.webp" media="(max-width: 767px)" fetchPriority="high" />
      <FanusSahnesi />
      <main id="icerik">
        <Giris />
        <Manifesto />
        <GecisBandi />
        <div data-zemin="acik">
          <Serit />
          <HizmetVitrini qrSvg={qrSvg} />
          <Isler />
        </div>
        {/* Fiyat tahtası koyu: gündüz sayfasının ortasında tek koyu blok (menü de üstünde koyuya döner) */}
        <FiyatListesi />
        <div data-zemin="acik">
          <CagriBandi />
        </div>
      </main>
    </>
  );
}
