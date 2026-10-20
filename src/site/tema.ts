// Renk temaları. Seçilen (20 Ekim 2026): D, koyu lacivert zemin + kor kırmızısı, nötr grafit kartlar.
// Diğerleri yalnız geliştirmedeki seçicide karşılaştırma için durur.

export const TEMALAR = [
  { kod: "eski", ad: "Eski (kahve)", zemin: "#0d0c0b", vurgu: "#eba04e" },
  { kod: "kor", ad: "A · Kor", zemin: "#0b0b0c", vurgu: "#ff4a2b" },
  { kod: "gece", ad: "B · Gece", zemin: "#070b16", vurgu: "#ff5a36" },
  { kod: "lacivert", ad: "C · Lacivert", zemin: "#08142b", vurgu: "#4c8dff" },
  { kod: "lacivert-kor", ad: "D · Koyu lacivert + kor", zemin: "#050d1e", vurgu: "#ff4a2b" },
] as const;

export type TemaKodu = (typeof TEMALAR)[number]["kod"];

/** Sitede kullanılan tema (seçici kapalıyken herkes bunu görür). */
export const VARSAYILAN_TEMA: TemaKodu = "lacivert-kor";

/** Tema seçici yalnız geliştirmede ya da NEXT_PUBLIC_TEMA_SECICI=1 iken görünür. */
export const TEMA_SECICI_ACIK = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_TEMA_SECICI === "1";

export function temaGecerliMi(kod: string | null | undefined): kod is TemaKodu {
  return TEMALAR.some((t) => t.kod === kod);
}
