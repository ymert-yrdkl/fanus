"use client";

import { usePathname } from "next/navigation";
import SahneYonetmeni from "./SahneYonetmeni";

/** Genel kaydırma efektleri her sayfa değişiminde yeni sayfanın öğeleri için yeniden kurulur. */
export default function SayfaEtkileri() {
  const yol = usePathname();
  return <SahneYonetmeni key={yol} />;
}
