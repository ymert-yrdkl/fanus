// Arama motorları, yapay zekâ aramaları ve paylaşım önizlemeleri için sayfa bilgileri ve yapılandırılmış veri
// (schema.org), tek yerde. Anahtar kelime planı ve gerekçesi: docs/seo.md.
//
// Kurallar: başlık 25-60 karakter (sonuna " | fanussoft" eklenir), açıklama 70-160 karakter; ikisi de sayfada
// gerçekten yazan şeyi söyler, uydurma iddia yok. Fiyatlar PAKETLER'den okunur, elle yazılmaz.

import type { Metadata } from "next";
import { SITE } from "./ayarlar";
import { HIZMETLER, PAKETLER } from "./icerik";

/** Aramada ve paylaşımda görünen marka adı. */
export const MARKA = "fanussoft";
/** Stüdyonun bulunduğu şehir (yerel arama: "Düzce web tasarım"). */
export const SEHIR = "Düzce";

/** Tam adres: "/hizmetler" → "https://fanussoft.com/hizmetler". */
export const tamAdres = (yol: string) => `${SITE.adres}${yol === "/" ? "" : yol}`;

/**
 * Sayfanın başlığı, açıklaması, kanonik adresi ve paylaşım etiketleri (Open Graph, X).
 * Next bu alanları sayfa sayfa birleştirmez: paylaşım etiketi her sayfada ayrıca yazılmazsa ana sayfanınki
 * kullanılır (iç sayfa paylaşılınca ana sayfa başlığı çıkıyordu). Bu yüzden her sayfa bunu kullanır.
 */
export function sayfaMetasi({
  baslik,
  aciklama,
  yol,
  tamBaslik = false,
}: {
  baslik: string;
  aciklama: string;
  yol: string;
  /** true: başlığa " | fanussoft" eklenmez (ana sayfa). */
  tamBaslik?: boolean;
}): Metadata {
  const gorunen = tamBaslik ? baslik : `${baslik} | ${MARKA}`;
  // Kök klasördeki paylaşım görseli, sayfa kendi openGraph'ını yazınca devralınmıyor: her sayfaya açıkça eklenir
  const gorsel = { url: "/opengraph-image.png", width: 1200, height: 630, alt: gorunen, type: "image/png" };
  return {
    title: tamBaslik ? { absolute: baslik } : baslik,
    description: aciklama,
    // Tek dil: Türkçe sürüm aynı adres (x-default da)
    alternates: { canonical: yol, languages: { "tr-TR": yol, "x-default": yol } },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: MARKA,
      url: yol,
      title: gorunen,
      description: aciklama,
      images: [gorsel],
    },
    twitter: { card: "summary_large_image", title: gorunen, description: aciklama, images: [gorsel] },
  };
}

const ISLETME_ID = `${SITE.adres}/#isletme`;
const SITE_ID = `${SITE.adres}/#site`;
/** Başka düğümlerin işletmeye bağlanması için (ör. hizmetin sağlayıcısı). */
export const ISLETME = { "@id": ISLETME_ID };

const fiyatlar = PAKETLER.flatMap((p) => (p.fiyat === null ? [] : [p.fiyat]));
const tl = (n: number) => `₺${n.toLocaleString("tr-TR")}`;

/**
 * Bütün sayfalarda bulunan çekirdek: işletme (yerel hizmet işletmesi) ve web sitesi. Arama motorları ve yapay zekâ
 * aramaları "fanussoft kim, nerede, ne yapar, kaç para" sorularının cevabını buradan okur.
 */
export function cekirdekVeri() {
  const sosyal = SITE.instagram ? [`https://www.instagram.com/${SITE.instagram}`] : [];
  return [
    {
      "@type": "ProfessionalService",
      "@id": ISLETME_ID,
      name: MARKA,
      alternateName: ["fanus", SITE.alanAdi],
      url: SITE.adres,
      logo: { "@type": "ImageObject", url: `${SITE.adres}/logo.png`, width: 512, height: 512 },
      image: `${SITE.adres}/opengraph-image.png`,
      description: SITE.aciklama,
      slogan: "Web'den üretime, işinizi yürüten yazılım.",
      address: { "@type": "PostalAddress", addressLocality: SEHIR, addressRegion: SEHIR, addressCountry: "TR" },
      areaServed: [
        { "@type": "City", name: SEHIR },
        { "@type": "Country", name: "Türkiye" },
      ],
      priceRange: `${tl(Math.min(...fiyatlar))} - ${tl(Math.max(...fiyatlar))}`,
      currenciesAccepted: "TRY",
      ...(SITE.eposta ? { email: SITE.eposta } : {}),
      ...(SITE.telefon ? { telephone: SITE.telefon } : {}),
      ...(sosyal.length ? { sameAs: sosyal } : {}),
      knowsAbout: [
        "Web tasarım",
        "Kurumsal web sitesi",
        "E-ticaret sitesi",
        "QR menü",
        "NFC kart sistemleri",
        "Mobil uygulama geliştirme",
        "Özel yazılım",
        "İş ve üretim otomasyonu",
        "SEO",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Hizmetler",
        itemListElement: HIZMETLER.map((h) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: h.ad, url: tamAdres(`/hizmetler/${h.adres}`) },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      url: SITE.adres,
      name: MARKA,
      alternateName: ["fanus", SITE.alanAdi],
      inLanguage: "tr-TR",
      publisher: ISLETME,
    },
  ];
}

/** Sayfanın kendisi: sitenin parçası, işletmeyi anlatır. */
export function sayfaVerisi({
  yol,
  baslik,
  aciklama,
  tur = "WebPage",
}: {
  yol: string;
  baslik: string;
  aciklama: string;
  /** schema.org sayfa türü: WebPage, CollectionPage, ContactPage, AboutPage... */
  tur?: string;
}) {
  return {
    "@type": tur,
    "@id": `${tamAdres(yol)}#sayfa`,
    url: tamAdres(yol),
    name: baslik,
    description: aciklama,
    inLanguage: "tr-TR",
    isPartOf: { "@id": SITE_ID },
    about: ISLETME,
    primaryImageOfPage: `${SITE.adres}/opengraph-image.png`,
  };
}

/** Yapılandırılmış veriyi <script type="application/ld+json"> içine güvenle yazmak için. */
export const jsonLd = (veri: unknown) => JSON.stringify(veri).replace(/</g, "\\u003c");
