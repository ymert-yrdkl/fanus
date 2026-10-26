import type { Metadata } from "next";
import CagriBandi from "@/bilesenler/CagriBandi";
import Isler from "@/bilesenler/Isler";
import SayfaBasi from "@/bilesenler/SayfaBasi";
import { REFERANSLAR } from "@/site/icerik";
import { jsonLd, sayfaMetasi, sayfaVerisi } from "@/site/seo";

const adlar = REFERANSLAR.map((r) => r.ad);
const SEO = {
  baslik: "Referanslar: Yayındaki Siteler ve Uygulamalar",
  aciklama: `Yayındaki işlerimiz: ${adlar.slice(0, -1).join(", ")} ve ${adlar.at(-1)}. Görüntüler sitelerin ve mağazanın kendisinden.`,
  yol: "/isler",
};

export const metadata: Metadata = sayfaMetasi(SEO);

/** Her iş bir yaratıcı çalışma: adı, türü, adresi; yapan fanussoft. */
const yapilandirilmisVeri = {
  "@context": "https://schema.org",
  "@graph": [
    sayfaVerisi({ ...SEO, tur: "CollectionPage" }),
    {
      "@type": "ItemList",
      name: "Yayındaki işler",
      itemListElement: REFERANSLAR.map((r, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": r.uygulama ? "MobileApplication" : "WebSite",
          name: r.ad,
          url: r.adres,
          description: r.ozet,
          genre: r.tur,
          ...(r.uygulama ? { operatingSystem: "iOS", applicationCategory: "LifestyleApplication" } : {}),
        },
      })),
    },
  ],
};

export default function IslerSayfasi() {
  return (
    <main id="icerik" data-zemin="acik">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(yapilandirilmisVeri) }} />
      <SayfaBasi
        iz={[{ ad: "İşler" }]}
        ustBaslik="Referanslar"
        baslik="Yayında olan işler."
        metin="Hepsi bugün çalışıyor. Ekran görüntüleri sitelerin ve mağazanın kendisinden; kaydırdıkça gezin, tıklayıp açın."
      />
      <Isler baslik={null} />
      <CagriBandi baslik="Sıradaki iş sizinki olsun." />
    </main>
  );
}
