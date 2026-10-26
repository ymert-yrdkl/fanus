import Link from "next/link";
import type { ReactNode } from "react";
import { SITE } from "@/site/ayarlar";
import { jsonLd } from "@/site/seo";

type Iz = { ad: string; adres?: string };

/**
 * Alt sayfaların üst bölümü: kırıntı yolu, afiş gibi büyük başlık, kısa metin ve sağda isteğe bağlı bir yuva
 * (fiyat kutusu, ad girişi...). Süs yok: kâğıt, mürekkep, ince çizgi.
 */
export default function SayfaBasi({
  iz,
  ustBaslik,
  baslik,
  uzunBaslik = false,
  metin,
  children,
}: {
  iz: Iz[];
  /** H1'in küçük ilk satırı: sayfanın aranan kelimesi (ör. "E-ticaret sitesi yaptırma"). Büyük satır slogan.
   *  Rehber yazılarında yok: başlığın kendisi aranan cümledir. */
  ustBaslik?: string;
  baslik: string;
  /** Uzun başlık (rehber yazısı): afiş boyu yerine bölüm başlığı boyu */
  uzunBaslik?: boolean;
  metin: string;
  children?: ReactNode;
}) {
  // Görünen yolda yalnız üst sayfalar: bulunulan sayfayı H1'in ilk satırı söyler (Google'a giden yol eksiksiz)
  const ustSayfalar = iz.filter((i) => i.adres);
  // Google için sayfa yolu: Ana sayfa > Hizmetler > E-ticaret sitesi
  const yol = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ ad: "Ana sayfa", adres: "/" }, ...iz].map((i, sira) => ({
      "@type": "ListItem",
      position: sira + 1,
      name: i.ad,
      ...(i.adres ? { item: `${SITE.adres}${i.adres === "/" ? "" : i.adres}` } : {}),
    })),
  };

  return (
    <section
      data-sayfa-basi
      className="relative z-10 bg-gece px-4 pt-[calc(var(--ust-yukseklik)+2.5rem)] pb-14 sm:px-6 md:pt-[calc(var(--ust-yukseklik)+5rem)] md:pb-20 lg:px-10"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(yol) }} />
      <div className="relative mx-auto max-w-[90rem]">
        <nav aria-label="Konum" data-belir className="flex items-center gap-3">
          <span className="h-px w-8 bg-cizgi-guclu" aria-hidden="true" />
          <ol className="etiket flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-krem">
                fanussoft
              </Link>
            </li>
            {ustSayfalar.map((i) => (
              <li key={i.ad} className="flex items-center gap-2">
                <span aria-hidden="true" className="text-silik">
                  /
                </span>
                <Link href={i.adres!} className="transition-colors hover:text-krem">
                  {i.ad}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-5 grid gap-10 md:mt-7 md:grid-cols-12 md:items-end md:gap-8">
          <div className={children ? "md:col-span-7" : "md:col-span-10"}>
            <h1>
              {ustBaslik && (
                <span data-belir className="etiket mb-5 block text-krem md:mb-6">
                  {ustBaslik}
                </span>
              )}
              <span
                data-bol
                className={uzunBaslik ? "bolum-baslik block max-w-[22ch]" : "dev-baslik block max-w-[14ch]"}
              >
                {baslik}
              </span>
            </h1>
            <p
              data-belir
              data-gecikme="0.1"
              className="mt-6 max-w-[38rem] text-lg leading-relaxed text-soluk md:mt-8 md:text-xl"
            >
              {metin}
            </p>
          </div>
          {children && (
            <div data-belir data-gecikme="0.2" className="md:col-span-5 lg:col-span-4 lg:col-start-9">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
