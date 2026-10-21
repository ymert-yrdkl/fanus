// Renk paletleri (21 Ekim 2026 denemesi): her biri gece (3B sahne) + gündüz (içerik) + vurgu rengi. Lacivert yok.
// Renkler src/app/globals.css › :root[data-tema="..."]. Seçici yalnız geliştirmede (sol alt "Tema").

export const TEMALAR = [
  {
    kod: "discord-gri",
    ad: "Discord grisi + açık gri",
    not: "Yumuşak koyu gri (#313338) ve mercan vurgu; göz yormaz, alev ve cam en net burada görünür.",
    gece: "#313338",
    gunduz: "#f2f3f5",
    vurgu: "#ff8266",
  },
  {
    kod: "koyu-discord",
    ad: "Koyu Discord grisi + açık gri",
    not: "Bir ton koyusu (#2b2d31); gri ile siyah arası, biraz daha ciddi.",
    gece: "#2b2d31",
    gunduz: "#f2f3f5",
    vurgu: "#ff7a5c",
  },
  {
    kod: "yumusak-siyah",
    ad: "Yumuşak siyah + açık gri",
    not: "Discord'un en koyusu (#1e1f22): siyah gibi ama kömür kadar sert değil.",
    gece: "#1e1f22",
    gunduz: "#f2f3f5",
    vurgu: "#ff6145",
  },
  {
    kod: "hep-discord",
    ad: "Hep Discord grisi",
    not: "Beyaz yok; baştan sona yumuşak koyu gri, kartlar bir ton açık.",
    gece: "#313338",
    gunduz: "#313338",
    vurgu: "#ff8266",
  },
  {
    kod: "hep-yumusak-siyah",
    ad: "Hep yumuşak siyah",
    not: "Beyaz yok; baştan sona #1e1f22, kartlar Discord grisi.",
    gece: "#1e1f22",
    gunduz: "#1e1f22",
    vurgu: "#ff6145",
  },
  {
    kod: "komur-kagit",
    ad: "Kömür + kâğıt (önceki)",
    not: "Karşılaştırma için: saf siyaha yakın zemin, kâğıt beyazı, kor kırmızısı.",
    gece: "#0b0b0c",
    gunduz: "#fafaf9",
    vurgu: "#ff4a2b",
  },
] as const;

export type TemaKodu = (typeof TEMALAR)[number]["kod"];

/** Sitede kullanılan palet (seçici kapalıyken herkes bunu görür). */
export const VARSAYILAN_TEMA: TemaKodu = "discord-gri";

/** Tema seçici yalnız geliştirmede ya da NEXT_PUBLIC_TEMA_SECICI=1 iken görünür. */
export const TEMA_SECICI_ACIK = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_TEMA_SECICI === "1";

export function temaGecerliMi(kod: string | null | undefined): kod is TemaKodu {
  return TEMALAR.some((t) => t.kod === kod);
}
