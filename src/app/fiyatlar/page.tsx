import type { Metadata } from "next";
import { ArrowsClockwise, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import CagriBandi from "@/bilesenler/CagriBandi";
import FiyatKarti from "@/bilesenler/FiyatKarti";
import SayfaBasi from "@/bilesenler/SayfaBasi";
import Sss from "@/bilesenler/Sss";
import { SITE } from "@/site/ayarlar";
import { fiyatYaz, KDV_NOTU, PAKETLER, SSS, YENILEMEYE_DAHIL, YILLIK_YENILEME } from "@/site/icerik";

export const metadata: Metadata = {
  title: "Fiyatlar",
  description: `Tek sayfa site ₺9.999, kurumsal tam paket ₺45.000, e-ticaret sitesi ₺65.000, QR menü ₺9.999'dan başlayan; yıllık yenileme ₺2.399. ${KDV_NOTU}`,
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
        metin={`Her paketin fiyatı ve içeriği aşağıda yazılı. ${KDV_NOTU} Site yayına girdikten sonra her yıl ${fiyatYaz(YILLIK_YENILEME)} yenileme ödersiniz; sunucu, SSL, güncelleme ve yedek buna dahildir.`}
      />
      <section aria-labelledby="paketler-baslik" className="relative z-10 bg-gece px-4 pb-20 sm:px-6 md:pb-28 lg:px-10">
        <h2 id="paketler-baslik" className="sr-only">
          Paketler ve fiyatlar
        </h2>
        <div className="mx-auto grid max-w-[90rem] gap-5 md:grid-cols-2">
          {fiyatliPaketler.map((p, i) => (
            <FiyatKarti key={p.kod} paket={p} gecikme={(i % 2) * 0.08} />
          ))}
        </div>
        <div className="mx-auto mt-5 max-w-[90rem]">
          {teklifli.map((p) => (
            <FiyatKarti key={p.kod} paket={p} />
          ))}
        </div>
      </section>

      {/* Yıllık yenileme */}
      <section aria-labelledby="yenileme-baslik" className="relative z-10 bg-gece px-4 py-20 sm:px-6 md:py-28 lg:px-10">
        <div className="mx-auto grid max-w-[90rem] gap-10 rounded-[2rem] border border-cizgi bg-gece-2 p-6 sm:p-10 md:grid-cols-12 md:items-center lg:p-14">
          <div className="md:col-span-5">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-alev text-gece">
              <ArrowsClockwise size={26} weight="bold" aria-hidden="true" />
            </span>
            <h2 id="yenileme-baslik" data-bol className="bolum-baslik mt-8 max-w-[12ch]">
              Yıllık yenileme {fiyatYaz(YILLIK_YENILEME)}.
            </h2>
            <p data-belir className="mt-5 max-w-[28rem] leading-relaxed text-soluk">
              Bütün paketlerde aynı tutar, KDV hariç. Siteniz yayında kaldığı sürece çalışır, güncel ve güvende kalır.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 md:col-span-7">
            {YENILEMEYE_DAHIL.map((m, i) => (
              <li
                key={m}
                data-belir
                data-gecikme={String(i * 0.05)}
                className="flex items-start gap-3 rounded-2xl border border-cizgi bg-cukur p-4 text-[0.9375rem]"
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
