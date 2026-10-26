import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import CagriBandi from "@/bilesenler/CagriBandi";
import SayfaBasi from "@/bilesenler/SayfaBasi";
import { REHBER } from "@/site/rehber";
import { jsonLd, sayfaMetasi, sayfaVerisi, tamAdres } from "@/site/seo";

const SEO = {
  baslik: "Web Sitesi ve E-ticaret Rehberi",
  aciklama:
    "E-ticaret sitesi kurmak, QR menü, web sitesi fiyatları ve kurumsal site seçimi üzerine sade rehber yazıları: yaptırmadan önce bilinmesi gerekenler.",
  yol: "/rehber",
};

export const metadata: Metadata = sayfaMetasi(SEO);

const tarihBicimi = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" });

export default function RehberSayfasi() {
  const yapilandirilmisVeri = {
    "@context": "https://schema.org",
    "@graph": [
      sayfaVerisi({ ...SEO, tur: "CollectionPage" }),
      {
        "@type": "ItemList",
        name: "Rehber yazıları",
        itemListElement: REHBER.map((y, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: tamAdres(`/rehber/${y.adres}`),
          name: y.baslik,
        })),
      },
    ],
  };

  return (
    <main id="icerik" data-zemin="acik">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(yapilandirilmisVeri) }} />
      <SayfaBasi
        iz={[{ ad: "Rehber" }]}
        ustBaslik="Web sitesi ve e-ticaret rehberi"
        baslik="Yaptırmadan önce bilinmesi gerekenler."
        metin="E-ticaret, QR menü, kurumsal site ve fiyatlar üzerine kısa yazılar. Uydurma sayı yok; her biri vereceğiniz bir kararı kolaylaştırmak için."
      />
      <section aria-label="Yazılar" className="relative z-10 bg-gece px-4 pb-16 sm:px-6 md:pb-24 lg:px-10">
        <ul className="mx-auto grid max-w-[90rem] gap-5 md:grid-cols-2 md:gap-6">
          {REHBER.map((y, i) => (
            <li key={y.adres} data-belir data-gecikme={String((i % 2) * 0.08)}>
              <Link
                href={`/rehber/${y.adres}`}
                className="group flex h-full flex-col rounded-[1.25rem] border border-cizgi-guclu bg-gece-2 p-6 transition-[border-color,transform] duration-500 ease-yay hover:-translate-y-1 hover:border-vurgu sm:p-8"
              >
                <p className="etiket">
                  {y.okumaDakika} dakikalık okuma · <time dateTime={y.tarih}>{tarihBicimi.format(new Date(y.tarih))}</time>
                </p>
                <h2 className="ara-baslik mt-5">{y.baslik}</h2>
                <p className="mt-4 leading-relaxed text-soluk">{y.ozet}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 font-medium text-vurgu">
                  Yazıyı oku
                  <ArrowUpRight
                    size={16}
                    weight="bold"
                    aria-hidden="true"
                    className="transition-transform duration-500 ease-yay group-hover:rotate-45"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CagriBandi />
    </main>
  );
}
