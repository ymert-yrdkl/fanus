import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import CagriBandi from "@/bilesenler/CagriBandi";
import RehberMetni from "@/bilesenler/RehberMetni";
import SayfaBasi from "@/bilesenler/SayfaBasi";
import Sss from "@/bilesenler/Sss";
import { dugmeSinifi } from "@/bilesenler/dugme";
import { hizmetBul, hizmetFiyatEtiketi } from "@/site/icerik";
import { REHBER, rehberBul } from "@/site/rehber";
import { ISLETME, jsonLd, sayfaMetasi, sayfaVerisi, tamAdres } from "@/site/seo";

export function generateStaticParams() {
  return REHBER.map((y) => ({ yazi: y.adres }));
}

export async function generateMetadata({ params }: PageProps<"/rehber/[yazi]">): Promise<Metadata> {
  const { yazi } = await params;
  const y = rehberBul(yazi);
  if (!y) return {};
  const meta = sayfaMetasi({ baslik: y.seoBasligi, aciklama: y.aciklama, yol: `/rehber/${y.adres}` });
  return {
    ...meta,
    openGraph: { ...meta.openGraph, type: "article", publishedTime: y.tarih, modifiedTime: y.tarih },
  };
}

const tarihBicimi = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" });

export default async function RehberYazisiSayfasi({ params }: PageProps<"/rehber/[yazi]">) {
  const { yazi } = await params;
  const y = rehberBul(yazi);
  if (!y) notFound();
  const hizmet = hizmetBul(y.ilgiliHizmet);
  const yol = `/rehber/${y.adres}`;
  const digerleri = REHBER.filter((d) => d.adres !== y.adres);

  const yapilandirilmisVeri = {
    "@context": "https://schema.org",
    "@graph": [
      sayfaVerisi({ yol, baslik: y.seoBasligi, aciklama: y.aciklama }),
      {
        "@type": "Article",
        "@id": `${tamAdres(yol)}#yazi`,
        headline: y.baslik,
        description: y.aciklama,
        datePublished: y.tarih,
        dateModified: y.tarih,
        inLanguage: "tr-TR",
        author: ISLETME,
        publisher: ISLETME,
        mainEntityOfPage: { "@id": `${tamAdres(yol)}#sayfa` },
        image: tamAdres("/opengraph-image.png"),
        ...(hizmet ? { about: { "@type": "Service", name: hizmet.ad, url: tamAdres(`/hizmetler/${hizmet.adres}`) } } : {}),
      },
      {
        "@type": "FAQPage",
        mainEntity: y.sss.map((s) => ({
          "@type": "Question",
          name: s.soru,
          acceptedAnswer: { "@type": "Answer", text: s.cevap },
        })),
      },
    ],
  };

  return (
    <main id="icerik" data-zemin="acik">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(yapilandirilmisVeri) }} />
      <SayfaBasi iz={[{ ad: "Rehber", adres: "/rehber" }, { ad: y.baslik }]} baslik={y.baslik} uzunBaslik metin={y.ozet}>
        <p className="etiket">
          <time dateTime={y.tarih}>{tarihBicimi.format(new Date(y.tarih))}</time> · {y.okumaDakika} dakikalık okuma
        </p>
      </SayfaBasi>

      <article className="relative z-10 bg-gece px-4 pb-16 sm:px-6 md:pb-24 lg:px-10">
        <div className="mx-auto grid max-w-[90rem] gap-12 border-t border-cizgi-guclu pt-10 md:grid-cols-12 md:gap-8 md:pt-14">
          <div className="md:col-span-8 lg:col-span-7">
            <RehberMetni bolumler={y.bolumler} />
          </div>
          {hizmet && (
            <aside aria-label="İlgili hizmet" className="md:col-span-4 lg:col-span-4 lg:col-start-9">
              <div className="rounded-[1.25rem] border border-cizgi-guclu bg-gece-2 p-6 md:sticky md:top-[calc(var(--ust-yukseklik)+1.5rem)]">
                <p className="etiket">İlgili hizmet</p>
                <p className="ara-baslik mt-4">{hizmet.ad}</p>
                <p className="mt-3 leading-relaxed text-soluk">{hizmet.baslik}</p>
                <p className="rakam mt-5 border-t border-cizgi-guclu pt-4">{hizmetFiyatEtiketi(hizmet.adres)}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`/hizmetler/${hizmet.adres}`} className={`${dugmeSinifi.alev} min-h-11 px-5`}>
                    Ayrıntılar
                  </Link>
                  <Link href="/iletisim" className={`${dugmeSinifi.cerceve} min-h-11 px-5`}>
                    Teklif al
                  </Link>
                </div>
              </div>
            </aside>
          )}
        </div>
      </article>

      <Sss sorular={y.sss} baslik="Bu yazıyla ilgili sorular." />

      <section aria-labelledby="diger-yazilar" className="relative z-10 bg-gece px-4 pb-16 sm:px-6 md:pb-24 lg:px-10">
        <div className="mx-auto max-w-[90rem] border-t border-cizgi-guclu pt-8">
          <h2 id="diger-yazilar" className="etiket">
            Diğer yazılar
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {digerleri.map((d) => (
              <li key={d.adres}>
                <Link
                  href={`/rehber/${d.adres}`}
                  className="group flex h-full items-start justify-between gap-4 rounded-[1.25rem] border border-cizgi-guclu bg-gece-2 p-5 transition-colors hover:border-vurgu"
                >
                  <span className="font-semibold leading-snug">{d.baslik}</span>
                  <ArrowUpRight
                    size={18}
                    weight="bold"
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 transition-transform duration-500 ease-yay group-hover:rotate-45"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CagriBandi />
    </main>
  );
}
