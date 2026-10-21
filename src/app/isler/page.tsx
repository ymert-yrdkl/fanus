import type { Metadata } from "next";
import CagriBandi from "@/bilesenler/CagriBandi";
import Isler from "@/bilesenler/Isler";
import SayfaBasi from "@/bilesenler/SayfaBasi";

export const metadata: Metadata = {
  title: "İşler",
  description:
    "Yayındaki işlerimiz: dijitalbaskimerkezim.com (e-ticaret), ayyildizrobotics.com (kurumsal site ve katalog), emrepide.com.tr (kurumsal site ve QR menü).",
  alternates: { canonical: "/isler" },
};

export default function IslerSayfasi() {
  return (
    <main id="icerik" data-zemin="acik">
      <SayfaBasi
        iz={[{ ad: "İşler" }]}
        baslik="Yayında olan işler."
        metin="Üçü de Düzce'den, üçü de bugün çalışıyor. Ekran görüntüleri sitelerin kendisinden; kaydırdıkça gezin, tıklayıp açın."
      />
      <Isler baslik={null} />
      <CagriBandi baslik="Sıradaki iş sizinki olsun." />
    </main>
  );
}
