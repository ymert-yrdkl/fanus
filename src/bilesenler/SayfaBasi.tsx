import Link from "next/link";
import type { ReactNode } from "react";
import { SITE } from "@/site/ayarlar";

type Iz = { ad: string; adres?: string };

/**
 * Alt sayfaların üst bölümü: kırıntı yolu, büyük başlık, kısa metin ve sağda isteğe bağlı bir yuva
 * (fiyat kutusu, ad girişi...). Arkada yavaşça dolaşan sıcak ışık.
 */
export default function SayfaBasi({
  iz,
  baslik,
  metin,
  children,
}: {
  iz: Iz[];
  baslik: string;
  metin: string;
  children?: ReactNode;
}) {
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
    <section className="relative z-10 overflow-hidden bg-gece px-4 pt-[calc(var(--ust-yukseklik)+4rem)] pb-16 sm:px-6 md:pt-[calc(var(--ust-yukseklik)+6.5rem)] md:pb-24 lg:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(yol).replace(/</g, "\\u003c") }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="sayfa-isigi absolute -top-[30%] right-[-10%] size-[70vmax] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-alev)_16%,transparent),transparent_62%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-cizgi)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-cizgi)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_70%_0%,black,transparent_70%)] bg-[size:5rem_5rem] opacity-40" />
      </div>
      <div className="relative mx-auto grid max-w-[90rem] gap-12 md:grid-cols-12 md:items-end md:gap-8">
        <div className={children ? "md:col-span-7" : "md:col-span-10"}>
          <nav aria-label="Konum" data-belir>
            <ol className="flex flex-wrap items-center gap-2 font-mono text-[0.8125rem] tracking-wide text-soluk uppercase">
              <li>
                <Link href="/" className="transition-colors hover:text-krem">
                  fanus
                </Link>
              </li>
              {iz.map((i) => (
                <li key={i.ad} className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-silik">
                    /
                  </span>
                  {i.adres ? (
                    <Link href={i.adres} className="transition-colors hover:text-krem">
                      {i.ad}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-krem">
                      {i.ad}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <h1 data-bol className="dev-baslik mt-6 max-w-[16ch]">
            {baslik}
          </h1>
          <p data-belir data-gecikme="0.1" className="mt-7 max-w-[38rem] text-lg leading-relaxed text-soluk md:text-xl">
            {metin}
          </p>
        </div>
        {children && (
          <div data-belir data-gecikme="0.2" className="md:col-span-5">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
