import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowsClockwise, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import AdGirisi from "@/bilesenler/AdGirisi";
import BolumBasi from "@/bilesenler/BolumBasi";
import CagriBandi from "@/bilesenler/CagriBandi";
import DigerHizmetler from "@/bilesenler/DigerHizmetler";
import FiyatKarti from "@/bilesenler/FiyatKarti";
import HizmetDemosu from "@/bilesenler/demolar/HizmetDemosu";
import Isler from "@/bilesenler/Isler";
import SayfaBasi from "@/bilesenler/SayfaBasi";
import Sss from "@/bilesenler/Sss";
import { dugmeSinifi } from "@/bilesenler/dugme";
import { SITE } from "@/site/ayarlar";
import {
  fiyatYaz,
  HIZMETLER,
  hizmetBul,
  KDV_EKI,
  kdvEki,
  kdvHaricYaz,
  paketBul,
  YENILEMEYE_DAHIL,
  YILLIK_YENILEME,
} from "@/site/icerik";
import { qrSvgUret } from "@/site/qr";

export const dynamicParams = false;

export function generateStaticParams() {
  return HIZMETLER.map((h) => ({ hizmet: h.adres }));
}

export async function generateMetadata({ params }: PageProps<"/hizmetler/[hizmet]">): Promise<Metadata> {
  const { hizmet } = await params;
  const h = hizmetBul(hizmet);
  if (!h) return {};
  return {
    title: h.seoBasligi,
    description: h.seoAciklamasi,
    alternates: { canonical: `/hizmetler/${h.adres}` },
  };
}

export default async function HizmetSayfasi({ params }: PageProps<"/hizmetler/[hizmet]">) {
  const { hizmet } = await params;
  const h = hizmetBul(hizmet);
  if (!h) notFound();
  const paketler = h.paketler.map(paketBul);
  const qrSvg = h.kod === "qrmenu" ? await qrSvgUret() : "";

  const yapilandirilmisVeri = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: h.ad,
        description: h.seoAciklamasi,
        url: `${SITE.adres}/hizmetler/${h.adres}`,
        areaServed: { "@type": "Country", name: "Türkiye" },
        provider: { "@type": "ProfessionalService", name: "fanus", url: SITE.adres },
        offers: paketler
          .filter((p) => p.fiyat !== null)
          .map((p) => ({
            "@type": "Offer",
            name: p.ad,
            price: p.fiyat,
            priceCurrency: "TRY",
            priceSpecification: {
              "@type": "PriceSpecification",
              price: p.fiyat,
              priceCurrency: "TRY",
              valueAddedTaxIncluded: false,
            },
          })),
      },
      {
        "@type": "FAQPage",
        mainEntity: h.sss.map((s) => ({
          "@type": "Question",
          name: s.soru,
          acceptedAnswer: { "@type": "Answer", text: s.cevap },
        })),
      },
    ],
  };

  return (
    <main id="icerik" key={h.adres} data-zemin="acik">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(yapilandirilmisVeri).replace(/</g, "\\u003c") }}
      />
      <SayfaBasi
        iz={[{ ad: "Hizmetler", adres: "/hizmetler" }, { ad: h.ad }]}
        baslik={h.sayfaBasligi}
        metin={h.sayfaMetni}
      >
        {/* Kısa fiyat tahtası: paketler ve teklif bağlantısı, koyu zeminde */}
        <div data-zemin="koyu" className="rounded-[1.25rem] p-5 sm:p-6">
          {paketler.map((p, i) => (
            <div
              key={p.kod}
              className={`flex flex-wrap items-end justify-between gap-4 ${i > 0 ? "mt-5 border-t border-cizgi-guclu pt-5" : ""}`}
            >
              <div>
                <p className="etiket">{p.ad}</p>
                <p className="rakam mt-2 text-[clamp(1.875rem,3vw,2.75rem)] leading-none">
                  {p.fiyat !== null ? fiyatYaz(p.fiyat) : "Teklifle"}
                  {p.fiyat !== null && (
                    <span className="ml-1.5 text-base font-normal tracking-normal text-soluk">
                      {kdvEki(p.baslangic)}
                      {p.baslangic && " başlayan"}
                    </span>
                  )}
                </p>
                {p.yenileme !== null && (
                  <p className="mt-2 text-sm text-soluk">
                    Yıllık yenileme <span className="text-alev">{fiyatYaz(p.yenileme)}</span> {KDV_EKI}
                  </p>
                )}
              </div>
              <Link href={`/iletisim?paket=${p.kod}`} className={`${dugmeSinifi.alev} min-h-11 px-5`}>
                Teklif al
              </Link>
            </div>
          ))}
        </div>
      </SayfaBasi>

      {/* Canlı örnek */}
      <section
        aria-labelledby="canli-ornek"
        className="relative z-10 bg-gece px-4 pt-10 pb-16 sm:px-6 md:pt-14 md:pb-24 lg:px-10"
      >
        <div className="mx-auto max-w-[90rem]">
          <BolumBasi
            id="canli-ornek"
            etiket="Canlı örnek"
            baslik="Deneyin, sizin adınızla çalışsın."
            metin="Aşağıdaki örnek gerçek bir bileşen. Adınızı yazın, düğmelere basın; teslim edeceğimiz sitenin nasıl davrandığını görün."
          >
            <div data-belir data-gecikme="0.1" className="mt-8 max-w-[28rem]">
              <AdGirisi kimlik="hizmet-isletme-adi" />
            </div>
          </BolumBasi>
          <div data-belir className="mt-10 rounded-[1.25rem] border border-cizgi-guclu p-4 sm:p-8 md:mt-14 lg:p-10">
            <HizmetDemosu kod={h.kod} qrSvg={qrSvg} />
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section
        aria-labelledby="ozellikler"
        className="relative z-10 bg-gece px-4 pt-10 pb-16 sm:px-6 md:pt-14 md:pb-24 lg:px-10"
      >
        <div className="mx-auto max-w-[90rem]">
          <BolumBasi id="ozellikler" etiket="Kapsam" baslik="Neler dahil?" />
          <ul
            className={`mt-10 grid gap-x-8 gap-y-8 border-t border-cizgi-guclu pt-8 sm:grid-cols-2 md:mt-14 ${h.ozellikler.length === 4 ? "xl:grid-cols-4" : "lg:grid-cols-3"}`}
          >
            {h.ozellikler.map((g, i) => (
              <li key={g.baslik} data-belir data-gecikme={String(i * 0.07)}>
                <h3 className="font-baslik text-xl font-semibold tracking-[-0.015em]">{g.baslik}</h3>
                <ul className="mt-4 grid gap-2.5">
                  {g.maddeler.map((m) => (
                    <li key={m} className="flex items-start gap-3 text-[0.9375rem]">
                      <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-alev" aria-hidden="true" />
                      {m}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div data-belir className="mt-10 flex flex-wrap items-center gap-3 border-t border-cizgi-guclu pt-6">
            <span className="etiket mr-2">Kimler için</span>
            {h.kimlerIcin.map((k) => (
              <span key={k} className="rounded-full border border-cizgi-guclu px-4 py-2 text-sm">
                {k}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Paketler */}
      <section
        aria-labelledby="paketler"
        className="relative z-10 bg-gece px-4 pt-10 pb-16 sm:px-6 md:pt-14 md:pb-24 lg:px-10"
      >
        <div className="mx-auto max-w-[90rem]">
          <BolumBasi
            id="paketler"
            etiket="Fiyat"
            baslik={paketler.length > 1 ? "Paketler ve fiyatlar." : "Paket ve fiyat."}
          />
          <div
            className={`mt-10 grid gap-5 md:mt-14 ${paketler.length > 1 || paketler[0]!.yenileme !== null ? "lg:grid-cols-2" : "max-w-[44rem]"}`}
          >
            {paketler.map((p, i) => (
              <FiyatKarti key={p.kod} paket={p} detayLinki={false} gecikme={i * 0.08} />
            ))}
            {/* Tek paketli hizmette yanında yıllık yenilemenin içeriği */}
            {paketler.length === 1 && paketler[0]!.yenileme !== null && (
              <div
                data-belir
                data-gecikme="0.1"
                className="flex flex-col rounded-[1.25rem] border border-cizgi-guclu p-6 sm:p-8"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-alev text-gece">
                  <ArrowsClockwise size={22} weight="bold" aria-hidden="true" />
                </span>
                <h3 className="ara-baslik mt-6">Yıllık yenileme {kdvHaricYaz(YILLIK_YENILEME)}</h3>
                <p className="mt-3 leading-relaxed text-soluk">
                  Site yayına girdikten sonra her yıl ödenir. Siteniz çalışır, güncel ve güvende kalır.
                </p>
                <ul className="mt-6 grid gap-3">
                  {YENILEMEYE_DAHIL.map((m) => (
                    <li key={m} className="flex items-start gap-3 text-[0.9375rem]">
                      <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-alev" aria-hidden="true" />
                      {m}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/fiyatlar"
                  className="mt-auto inline-flex min-h-12 items-center pt-6 text-[0.9375rem] font-medium text-alev"
                >
                  Bütün paketleri karşılaştırın
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {h.referanslar && (
        <Isler
          kodlar={h.referanslar}
          baslik={
            h.kod === "mobil"
              ? "Bu işi yaptığımız bir uygulama."
              : h.referanslar.length > 1
                ? "Bu işi yaptığımız siteler."
                : "Bu işi yaptığımız bir site."
          }
          metin={
            h.kod === "mobil"
              ? "App Store'da yayında, bugün kullanılıyor. Ekran görüntüleri mağaza sayfasından; tıklayıp indirebilirsiniz."
              : "Yayında, bugün çalışıyor. Ekran görüntüleri sitelerin kendisinden; tıklayıp gezebilirsiniz."
          }
        />
      )}
      <Sss sorular={h.sss} baslik="Bu hizmetle ilgili sorular." />
      <DigerHizmetler simdiki={h.adres} />
      <CagriBandi />
    </main>
  );
}
