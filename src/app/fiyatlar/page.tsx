import type { Metadata } from "next";
import { ArrowsClockwise, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import CagriBandi from "@/bilesenler/CagriBandi";
import FiyatKarti from "@/bilesenler/FiyatKarti";
import SayfaBasi from "@/bilesenler/SayfaBasi";
import Sss from "@/bilesenler/Sss";
import { SITE } from "@/site/ayarlar";
import { kdvHaricYaz, PAKETLER, SSS, YENILEMEYE_DAHIL, YILLIK_YENILEME } from "@/site/icerik";

export const metadata: Metadata = {
  title: "Fiyatlar",
  description:
    "Tek sayfa site ₺9.999 +KDV, kurumsal tam paket ₺45.000 +KDV, e-ticaret sitesi ₺65.000 +KDV, QR menü ₺9.999 +KDV'den başlayan; yenileme ₺2.399 +KDV / yıl.",
  alternates: { canonical: "/fiyatlar" },
};

export default function FiyatlarSayfasi() {
  const fiyatliPaketler = PAKETLER.filter((p) => p.fiyat !== null);
  const teklifli = PAKETLER.filter((p) => p.fiyat === null);
  const fiyatSorulari = SSS.filter((s) => /Fiyat|yenileme|süre|güncelleyebilir/i.test(s.soru));

  const yapilandirilmisVeri = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "fanussoft paketleri",
    url: `${SITE.adres}/fiyatlar`,
    itemListElement: fiyatliPaketler.map((p) => ({
      "@type": "Offer",
      name: p.ad,
      description: p.ozet,
      price: p.fiyat,
      priceCurrency: "TRY",
      priceSpecification: {
        "@type": "PriceSpecification",
        price: p.fiyat,
        priceCurrency: "TRY",
        valueAddedTaxIncluded: false,
      },
      url: `${SITE.adres}/hizmetler/${p.hizmet}`,
    })),
  };

  return (
    <main id="icerik" data-zemin="acik">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(yapilandirilmisVeri).replace(/</g, "\\u003c") }}
      />
      <SayfaBasi
        iz={[{ ad: "Fiyatlar" }]}
        baslik="Fiyatı baştan söylüyoruz."
        metin={`Her paketin fiyatı ve içeriği aşağıda yazılı. Site yayına girdikten sonra her yıl ${kdvHaricYaz(YILLIK_YENILEME)} yenileme ödersiniz; sunucu, SSL, güncelleme ve yedek buna dahildir.`}
      />
      <section aria-labelledby="paketler-baslik" className="relative z-10 bg-gece px-4 pb-16 sm:px-6 md:pb-24 lg:px-10">
        <h2 id="paketler-baslik" className="sr-only">
          Paketler ve fiyatlar
        </h2>
        <div className="mx-auto grid max-w-[90rem] gap-5 md:grid-cols-2 md:gap-6">
          {fiyatliPaketler.map((p, i) => (
            <FiyatKarti key={p.kod} paket={p} gecikme={(i % 2) * 0.08} />
          ))}
        </div>
        <div className="mx-auto mt-5 max-w-[90rem] md:mt-6">
          {teklifli.map((p) => (
            <FiyatKarti key={p.kod} paket={p} />
          ))}
        </div>
      </section>

      {/* Yıllık yenileme: koyu tahta */}
      <section
        data-zemin="koyu"
        aria-labelledby="yenileme-baslik"
        className="relative z-10 bg-gece px-4 py-20 sm:px-6 md:py-28 lg:px-10"
      >
        <div className="mx-auto grid max-w-[90rem] gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <span className="flex size-12 items-center justify-center rounded-full bg-alev text-gece">
              <ArrowsClockwise size={22} weight="bold" aria-hidden="true" />
            </span>
            <h2 id="yenileme-baslik" data-bol className="bolum-baslik mt-8 max-w-[12ch]">
              Yıllık yenileme {kdvHaricYaz(YILLIK_YENILEME)}.
            </h2>
            <p data-belir className="mt-5 max-w-[28rem] leading-relaxed text-soluk">
              Bütün paketlerde aynı. Siteniz yayında kaldığı sürece çalışır, güncel ve güvende kalır.
            </p>
          </div>
          <ul className="border-t border-cizgi-guclu md:col-span-7">
            {YENILEMEYE_DAHIL.map((m, i) => (
              <li
                key={m}
                data-belir
                data-gecikme={String(i * 0.05)}
                className="flex items-start gap-3 border-b border-cizgi-guclu py-4 text-[0.9375rem] md:text-base"
              >
                <CheckCircle size={20} weight="fill" className="mt-0.5 shrink-0 text-alev" aria-hidden="true" />
                {m}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Sss sorular={fiyatSorulari} baslik="Fiyatla ilgili sorular." />
      <CagriBandi ikinci={{ ad: "Hizmetler", adres: "/hizmetler" }} />
    </main>
  );
}
