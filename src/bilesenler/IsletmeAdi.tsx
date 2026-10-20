"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/** Ziyaretçinin yazdığı işletme adı: hizmet örnekleri ve teklif mesajı bu adla çalışır. */
const IsletmeAdiBaglami = createContext<{ ad: string; setAd: (ad: string) => void } | null>(null);

export const VARSAYILAN_AD = "İşletmeniz";
export const AD_SINIRI = 32;

export function IsletmeAdiSaglayici({ children }: { children: ReactNode }) {
  const [ad, setAd] = useState("");
  return <IsletmeAdiBaglami.Provider value={{ ad, setAd }}>{children}</IsletmeAdiBaglami.Provider>;
}

export function useIsletmeAdi() {
  const baglam = useContext(IsletmeAdiBaglami);
  if (!baglam) throw new Error("useIsletmeAdi, IsletmeAdiSaglayici içinde kullanılmalı");
  const gorunen = baglam.ad.trim() || VARSAYILAN_AD;
  return { ...baglam, gorunen };
}

/** "Yıldız Fırın" → "yildizfirin" (alan adı önizlemesi için). */
export function adresAdi(ad: string) {
  const harfler: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", â: "a", î: "i", û: "u" };
  const sade = ad
    .toLocaleLowerCase("tr")
    .replace(/[çğıöşüâîû]/g, (h) => harfler[h] ?? h)
    .replace(/[^a-z0-9]/g, "");
  return sade || "isletmeniz";
}

/** "Yıldız Fırın" → "YF" (logo yerine baş harfler). */
export function basHarfler(ad: string) {
  return ad
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((k) => k[0]!.toLocaleUpperCase("tr"))
    .join("");
}
