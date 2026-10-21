import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowsClockwise, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import AdGirisi from "@/bilesenler/AdGirisi";
import CagriBandi from "@/bilesenler/CagriBandi";
import DigerHizmetler from "@/bilesenler/DigerHizmetler";
import FiyatKarti from "@/bilesenler/FiyatKarti";
import HizmetDemosu from "@/bilesenler/demolar/HizmetDemosu";
import Isler from "@/bilesenler/Isler";
import SayfaBasi from "@/bilesenler/SayfaBasi";
import Sss from "@/bilesenler/Sss";
import { dugmeSinifi } from "@/bilesenler/dugme";
import { SITE } from "@/site/ayarlar";
import { fiyatYaz, HIZMETLER, hizmetBul, paketBul, YENILEMEYE_DAHIL, YILLIK_YENILEME } from "@/site/icerik";
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
          .map((p) => ({ "@type": "Offer", name: p.ad, price: p.fiyat, priceCurrency: "TRY" })),
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
    <main id="icerik" key={h.adres}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(yapilandirilmisVeri).replace(/</g, "\\u003c") }}
      />
      <SayfaBasi
        iz={[{ ad: "Hizmetler", adres: "/hizmetler" }, { ad: h.ad }]}
        baslik={h.sayfaBasligi}
        metin={h.sayfaMetni}
      >
        {/* Kısa fiyat kutusu: paketler ve teklif bağlantısı */}
        <div className="grid gap-3">
          {paketler.map((p) => (
            <div
              key={p.kod}
              className="flex flex-wrap items-end justify-between gap-4 rounded-[1.5rem] border border-cizgi-guclu bg-gece-2/80 p-5 backdrop-blur"
            >
              <div>
                <p className="text-sm text-soluk">{p.ad}</p>
                <p className="mt-1 font-baslik text-3xl font-semibold tracking-tight tabular-nums">
                  {p.fiyat !== null ? fiyatYaz(p.fiyat) : "Teklif üzerine"}
                  {p.baslangic && <span className="text-base font-normal text-soluk">&apos;dan başlayan</span>}
                </p>
                {p.yenileme !== null && (
                  <p className="mt-1 text-sm text-soluk">
                    Yıllık yenileme <span className="text-alev">{fiyatYaz(p.yenileme)}</span>
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
      <section aria-labelledby="canli-ornek" className="relative z-10 bg-gece px-4 py-20 sm:px-6 md:py-28 lg:px-10">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <h2 id="canli-ornek" data-bol className="bolum-baslik max-w-[14ch]">
                Deneyin, sizin adınızla çalışsın.
              </h2>
              <p data-belir className="mt-6 max-w-[34rem] text-lg leading-relaxed text-soluk">
                Aşağıdaki örnek gerçek bir bileşen. Adınızı yazın, düğmelere basın; teslim edeceğimiz sitenin nasıl
                davrandığını görün.
              </p>
            </div>
            <div data-belir data-gecikme="0.1" className="md:col-span-5">
              <AdGirisi kimlik="hizmet-isletme-adi" />
            </div>
          </div>
          <div data-belir className="mt-12 rounded-[2rem] border border-cizgi bg-gece-2 p-4 sm:p-8 lg:p-12">
            <HizmetDemosu kod={h.kod} qrSvg={qrSvg} />
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section aria-labelledby="ozellikler" className="relative z-10 bg-gece px-4 py-20 sm:px-6 md:py-28 lg:px-10">
        <div className="mx-auto max-w-[90rem]">
          <h2 id="ozellikler" data-bol className="bolum-baslik max-w-[14ch]">
            Neler dahil?
          </h2>
          <ul
            className={`mt-12 grid gap-4 sm:grid-cols-2 ${h.ozellikler.length === 4 ? "xl:grid-cols-4" : "lg:grid-cols-3"}`}
          >
            {h.ozellikler.map((g, i) => (
              <li
                key={g.baslik}
                data-belir
                data-gecikme={String(i * 0.07)}
                data-isik
                className="relative overflow-hidden rounded-[1.75rem] border border-cizgi bg-gece-2 p-6 sm:p-7"
              >
                <span className="isik-katmani" aria-hidden="true" />
                <h3 className="relative font-baslik text-xl font-semibold">{g.baslik}</h3>
                <ul className="relative mt-5 grid gap-3">
                  {g.maddeler.map((m) => (
                    <li key={m} className="flex items-start gap-3 text-[0.9375rem] text-krem/90">
                      <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-alev" aria-hidden="true" />
                      {m}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div data-belir className="mt-12 flex flex-wrap items-center gap-3">
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
      <section aria-labelledby="paketler" className="relative z-10 bg-gece px-4 py-20 sm:px-6 md:py-28 lg:px-10">
        <div className="mx-auto max-w-[90rem]">
          <h2 id="paketler" data-bol className="bolum-baslik max-w-[14ch]">
            {paketler.length > 1 ? "Paketler ve fiyatlar." : "Paket ve fiyat."}
          </h2>
          <div
            className={`mt-12 grid gap-5 ${paketler.length > 1 || paketler[0]!.yenileme !== null ? "lg:grid-cols-2" : "max-w-[44rem]"}`}
          >
            {paketler.map((p, i) => (
              <FiyatKarti key={p.kod} paket={p} detayLinki={false} gecikme={i * 0.08} />
            ))}
            {/* Tek paketli hizmette yanında yıllık yenilemenin içeriği */}
            {paketler.length === 1 && paketler[0]!.yenileme !== null && (
              <div
                data-belir
                data-gecikme="0.1"
                className="flex flex-col rounded-[2rem] border border-cizgi bg-gece-3/50 p-6 sm:p-8"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-alev text-gece">
                  <ArrowsClockwise size={22} weight="bold" aria-hidden="true" />
                </span>
                <h3 className="ara-baslik mt-6">Yıllık yenileme {fiyatYaz(YILLIK_YENILEME)}</h3>
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

      {h.referans && (
        <Isler
          kodlar={[h.referans]}
          baslik="Bu işi yaptığımız bir site."
          metin="Yayında, bugün çalışıyor. Ekran görüntüleri sitenin kendisinden; tıklayıp gezebilirsiniz."
        />
      )}
      <Sss sorular={h.sss} baslik="Bu hizmetle ilgili sorular." />
      <DigerHizmetler simdiki={h.adres} />
      <CagriBandi />
    </main>
  );
}
