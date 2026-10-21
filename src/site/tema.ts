// Renk paletleri (21 Ekim 2026 denemesi): her biri gece (3B sahne) + gündüz (içerik) + vurgu rengi. Lacivert yok.
// Renkler src/app/globals.css › :root[data-tema="..."]. Seçici yalnız geliştirmede (sol alt "Tema").

export const TEMALAR = [
  {
    kod: "komur-kagit",
    ad: "Kömür + kâğıt",
    not: "Siyah, beyaz ve tek kırmızı. Tasarım ajanslarının sade, iddialı düzeni; müşteri işlerinin renkleri öne çıkar.",
    gece: "#0b0b0c",
    gunduz: "#fafaf9",
    vurgu: "#ff4a2b",
  },
  {
    kod: "siyah-beyaz",
    ad: "Saf siyah + beyaz",
    not: "En keskin karşıtlık; Apple'ın ürün sayfaları gibi. Alev en çok burada parlar.",
    gece: "#000000",
    gunduz: "#ffffff",
    vurgu: "#ff3d1f",
  },
  {
    kod: "antrasit-beyaz",
    ad: "Antrasit + beyaz",
    not: "Siyahtan bir ton açık koyu gri; daha yumuşak, göz yormayan kurumsal.",
    gece: "#1a1b1e",
    gunduz: "#f6f6f5",
    vurgu: "#ff4a2b",
  },
  {
    kod: "antrasit-turuncu",
    ad: "Antrasit + turuncu",
    not: "Vurgu kırmızı yerine alevin turuncusu; daha sıcak ve samimi.",
    gece: "#1a1b1e",
    gunduz: "#f6f6f5",
    vurgu: "#ff7a1a",
  },
  {
    kod: "siyah-beton",
    ad: "Siyah + beton",
    not: "Açık beton gri ve sinyal turuncusu. Teknik, endüstriyel, ürün tasarımı havası.",
    gece: "#0e0e0d",
    gunduz: "#e2e2de",
    vurgu: "#ff5b1f",
  },
  {
    kod: "grafit-kemik",
    ad: "Grafit + kemik",
    not: "Kırık beyaz (kemik) zemin; sıcak, el yapımı, butik his.",
    gece: "#141414",
    gunduz: "#f2efe9",
    vurgu: "#ff4a2b",
  },
  {
    kod: "siyah-amber",
    ad: "Siyah + amber",
    not: "Vurgu alevin sarısı; enerjik ve dikkat çekici. Gündüz bölümlerinde yanık turuncu.",
    gece: "#0b0b0c",
    gunduz: "#fafaf9",
    vurgu: "#ffb020",
  },
  {
    kod: "gece-yesili",
    ad: "Gece yeşili + amber",
    not: "Koyu yeşil zemin, amber vurgu. Büyüme ve para çağrışımı; sektörde az kullanılır, akılda kalır.",
    gece: "#04130e",
    gunduz: "#ecf2ee",
    vurgu: "#ffb020",
  },
  {
    kod: "petrol-mercan",
    ad: "Petrol + mercan",
    not: "Koyu camgöbeği ve mercan: birbirini tamamlayan iki renk. Taze, modern; sağlık ve turizmde sık.",
    gece: "#031417",
    gunduz: "#e9f2f2",
    vurgu: "#ff6a3d",
  },
  {
    kod: "murdum-mercan",
    ad: "Mürdüm + mercan",
    not: "Koyu mor zemin, mercan vurgu. Yaratıcı ajans, moda, güzellik; en 'sanatçı' duranı.",
    gece: "#12081a",
    gunduz: "#f3eff5",
    vurgu: "#ff5a4a",
  },
  {
    kod: "hep-siyah",
    ad: "Hep siyah",
    not: "Beyaz yok; baştan sona siyah, kartlar grafit.",
    gece: "#0b0b0c",
    gunduz: "#0b0b0c",
    vurgu: "#ff4a2b",
  },
  {
    kod: "hep-antrasit",
    ad: "Hep antrasit",
    not: "Beyaz yok; baştan sona siyahtan bir ton açık koyu gri.",
    gece: "#1a1b1e",
    gunduz: "#1a1b1e",
    vurgu: "#ff4a2b",
  },
] as const;

export type TemaKodu = (typeof TEMALAR)[number]["kod"];

/** Sitede kullanılan palet (seçici kapalıyken herkes bunu görür). */
export const VARSAYILAN_TEMA: TemaKodu = "komur-kagit";

/** Tema seçici yalnız geliştirmede ya da NEXT_PUBLIC_TEMA_SECICI=1 iken görünür. */
export const TEMA_SECICI_ACIK = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_TEMA_SECICI === "1";

export function temaGecerliMi(kod: string | null | undefined): kod is TemaKodu {
  return TEMALAR.some((t) => t.kod === kod);
}
