import type { Metadata } from "next";
import AdGirisi from "@/bilesenler/AdGirisi";
import CagriBandi from "@/bilesenler/CagriBandi";
import Hizmetler from "@/bilesenler/Hizmetler";
import SayfaBasi from "@/bilesenler/SayfaBasi";
import Surec from "@/bilesenler/Surec";
import { qrSvgUret } from "@/site/qr";
import { jsonLd, sayfaMetasi, sayfaVerisi } from "@/site/seo";

const SEO = {
  baslik: "Web Tasarım ve Yazılım Hizmetleri",
  aciklama:
    "Kurumsal web sitesi, e-ticaret, QR menü, mobil uygulama, özel yazılım ve otomasyon: her hizmetin canlı örneği, özellikleri ve fiyatı kendi sayfasında.",
  yol: "/hizmetler",
};

export const metadata: Metadata = sayfaMetasi(SEO);

export default async function HizmetlerSayfasi() {
  const qrSvg = await qrSvgUret();
  return (
    <main id="icerik" data-zemin="acik">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({ "@context": "https://schema.org", ...sayfaVerisi({ ...SEO, tur: "CollectionPage" }) }),
        }}
      />
      <SayfaBasi
        iz={[{ ad: "Hizmetler" }]}
        ustBaslik="Web tasarım ve yazılım hizmetleri"
        baslik="Beş hizmet, beş canlı örnek."
        metin="İşletmenizin adını yazın; aşağıdaki örnekler sizin adınızla çalışsın. Her kartın sonunda fiyatı ve ayrıntıları var."
      >
        <AdGirisi />
      </SayfaBasi>
      <Hizmetler qrSvg={qrSvg} />
      <Surec />
      <CagriBandi />
    </main>
  );
}
