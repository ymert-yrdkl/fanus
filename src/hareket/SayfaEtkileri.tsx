"use client";

import { usePathname } from "next/navigation";
import EkrandaOynat from "./EkrandaOynat";
import SahneYonetmeni from "./SahneYonetmeni";

/**
 * Genel kaydırma efektleri ve "yalnız ekrandayken oynat" gözcüsü her sayfa değişiminde yeni sayfanın öğeleri için
 * yeniden kurulur.
 */
export default function SayfaEtkileri() {
  const yol = usePathname();
  return (
    <>
      <SahneYonetmeni key={yol} />
      <EkrandaOynat key={`oynat-${yol}`} />
    </>
  );
}
