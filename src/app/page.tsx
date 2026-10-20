import QRCode from "qrcode";
import Acilis from "@/bilesenler/Acilis";
import Alt from "@/bilesenler/Alt";
import Giris from "@/bilesenler/Giris";
import Hizmetler from "@/bilesenler/Hizmetler";
import { IsletmeAdiSaglayici } from "@/bilesenler/IsletmeAdi";
import Isler from "@/bilesenler/Isler";
import Manifesto from "@/bilesenler/Manifesto";
import Serit from "@/bilesenler/Serit";
import Sss from "@/bilesenler/Sss";
import Surec from "@/bilesenler/Surec";
import Teklif from "@/bilesenler/Teklif";
import UstMenu from "@/bilesenler/UstMenu";
import SahneYonetmeni from "@/hareket/SahneYonetmeni";
import FanusSahnesi from "@/sahne/FanusSahnesi";
import { SITE } from "@/site/ayarlar";
import { REFERANSLAR, SSS } from "@/site/icerik";

// Emre Pide'nin gerçek QR menüsüne giden kod (derleme anında SVG olarak üretilir)
const QR_MENU_ADRESI = "https://menu.emrepide.com.tr";

export default async function AnaSayfa() {
  const qrSvg = await QRCode.toString(QR_MENU_ADRESI, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#0d0c0b", light: "#00000000" },
  });

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
        knowsAbout: ["E-ticaret sitesi", "Kurumsal web sitesi", "Web otomasyonu", "QR menü"],
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
      {
        "@type": "FAQPage",
        mainEntity: SSS.map((s) => ({
          "@type": "Question",
          name: s.soru,
          acceptedAnswer: { "@type": "Answer", text: s.cevap },
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
      <Acilis />
      <UstMenu />
      <FanusSahnesi />
      <main id="icerik">
        <Giris />
        <Manifesto />
        <Serit />
        <IsletmeAdiSaglayici>
          <Hizmetler qrSvg={qrSvg} />
          <Isler />
          <Surec />
          <Sss />
          <Teklif />
        </IsletmeAdiSaglayici>
      </main>
      <Alt />
      <SahneYonetmeni />
    </>
  );
}
