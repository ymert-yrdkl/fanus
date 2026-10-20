import GecisBandi from "@/bilesenler/GecisBandi";
import type { Metadata } from "next";
import AdGirisi from "@/bilesenler/AdGirisi";
import CagriBandi from "@/bilesenler/CagriBandi";
import Hizmetler from "@/bilesenler/Hizmetler";
import SayfaBasi from "@/bilesenler/SayfaBasi";
import Surec from "@/bilesenler/Surec";
import { qrSvgUret } from "@/site/qr";

export const metadata: Metadata = {
  title: "Hizmetler",
  description:
    "E-ticaret sitesi, kurumsal web sitesi, QR menü ve web otomasyonu: her birinin canlı örneği, özellikleri ve fiyatı.",
  alternates: { canonical: "/hizmetler" },
};

export default async function HizmetlerSayfasi() {
  const qrSvg = await qrSvgUret();
  return (
    <main id="icerik">
      <SayfaBasi
        iz={[{ ad: "Hizmetler" }]}
        baslik="Dört hizmet, dört canlı örnek."
        metin="İşletmenizin adını yazın; aşağıdaki örnekler sizin adınızla çalışsın. Her kartın sonunda fiyatı ve ayrıntıları var."
      >
        <AdGirisi />
      </SayfaBasi>
      <GecisBandi yon="safak" boy="kisa" />
      <div data-zemin="acik">
        <Hizmetler qrSvg={qrSvg} />
        <Surec />
      </div>
      <GecisBandi yon="aksam" boy="kisa" />
      <CagriBandi />
    </main>
  );
}
