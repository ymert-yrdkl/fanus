// Renk paletleri (21 Ekim 2026 denemesi): her biri gece (3B sahne) + gündüz (içerik) + vurgu rengi.
// Renkler src/app/globals.css › :root[data-tema="..."]. Seçici yalnız geliştirmede (sol alt "Tema").

export const TEMALAR = [
  {
    kod: "lacivert-beyaz",
    ad: "Lacivert + beyaz",
    not: "Şimdiki deneme. Klasik kurumsal; beyaz biraz sade kalıyor.",
    gece: "#050d1e",
    gunduz: "#f5f6f8",
    vurgu: "#ff4a2b",
  },
  {
    kod: "lacivert-buz",
    ad: "Lacivert + buz",
    not: "Beyaz yerine laciverte akraba mavimsi gri. Banka, sigorta, yazılım: güven veren kurumsal.",
    gece: "#050d1e",
    gunduz: "#e4eaf3",
    vurgu: "#ff4a2b",
  },
  {
    kod: "lacivert-fildisi",
    ad: "Lacivert + fildişi",
    not: "Kırık beyaz zemin, lacivert yazı. Dergi ve butik markalar gibi sıcak ama ciddi.",
    gece: "#050d1e",
    gunduz: "#f3f0e8",
    vurgu: "#ff4a2b",
  },
  {
    kod: "lacivert-elektrik",
    ad: "Lacivert + elektrik mavisi",
    not: "Vurgu mavi, alev turuncu kalır. En 'yazılım şirketi' duranı (Stripe, Intercom çizgisi).",
    gece: "#050b1a",
    gunduz: "#f3f6fb",
    vurgu: "#5b86ff",
  },
  {
    kod: "lacivert-altin",
    ad: "Lacivert + altın",
    not: "Gecede altın vurgu, gündüzde lacivert düğmeler. Hukuk, finans, kuyumcu gibi prestij işleri.",
    gece: "#050d1e",
    gunduz: "#f6f6f3",
    vurgu: "#ffb547",
  },
  {
    kod: "komur-kagit",
    ad: "Kömür + kâğıt",
    not: "Siyah, beyaz ve tek kırmızı. Tasarım ajanslarının en sık kullandığı sade, iddialı düzen.",
    gece: "#0b0b0c",
    gunduz: "#fafaf9",
    vurgu: "#ff4a2b",
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
    kod: "hep-gece",
    ad: "Hep gece",
    not: "Beyaz yok; baştan sona lacivert, kartlar grafit (yayındaki site).",
    gece: "#050d1e",
    gunduz: "#050d1e",
    vurgu: "#ff4a2b",
  },
] as const;

export type TemaKodu = (typeof TEMALAR)[number]["kod"];

/** Sitede kullanılan palet (seçici kapalıyken herkes bunu görür). */
export const VARSAYILAN_TEMA: TemaKodu = "lacivert-beyaz";

/** Tema seçici yalnız geliştirmede ya da NEXT_PUBLIC_TEMA_SECICI=1 iken görünür. */
export const TEMA_SECICI_ACIK = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_TEMA_SECICI === "1";

export function temaGecerliMi(kod: string | null | undefined): kod is TemaKodu {
  return TEMALAR.some((t) => t.kod === kod);
}
