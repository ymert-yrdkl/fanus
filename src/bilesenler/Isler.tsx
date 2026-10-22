"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { gsap, GENIS, HAREKET_ACIK, useGSAP } from "@/hareket/gsap";
import { REFERANSLAR, type Referans } from "@/site/icerik";
import BolumBasi from "./BolumBasi";

/**
 * Yayındaki işlerin vitrini. Web sitesi: masaüstünde her iş ekrana sabitlenir, tarayıcı çerçevesinde sitenin gerçek
 * ekran görüntüsü kaydırmayla iner; küçük telefon çerçevesi önünde durur. Telefonda yana kaydırılan bir vitrin: her
 * işin telefon görünümü, ekranı kendi kendine yavaşça kayar (globals.css › telefon-kayar).
 * Mobil uygulama (`uygulama` alanı): mağaza ekran görüntüleri yan yana telefon çerçevelerinde, kaymaz.
 * `kodlar` verilirse yalnız o işler, `baslik` boşsa başlık bölümü olmadan.
 */
export default function Isler({
  kodlar,
  baslik = "Yayında olan işler.",
  metin = "Hepsi bugün çalışıyor. Ekran görüntüleri sitelerin ve mağazanın kendisinden; tıklayıp gezebilirsiniz.",
}: {
  kodlar?: string[];
  baslik?: string | null;
  metin?: string;
}) {
  const kok = useRef<HTMLElement>(null);
  const isler = kodlar ? REFERANSLAR.filter((r) => kodlar.includes(r.kod)) : REFERANSLAR;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${HAREKET_ACIK} and ${GENIS}`, () => {
        gsap.utils.toArray<HTMLElement>("[data-is]").forEach((is) => {
          const gorsel = is.querySelector<HTMLElement>("[data-gorsel]")!;
          gsap.fromTo(
            gorsel,
            { rotateX: 16, scale: 0.86, y: 90 },
            {
              rotateX: 0,
              scale: 1,
              y: 0,
              ease: "none",
              scrollTrigger: { trigger: is, start: "top bottom", end: "top top", scrub: 1 },
            },
          );

          // Yalnız web sitelerinde: sabitlenen iş boyunca ekran görüntüsü çerçevenin içinde aşağı kayar
          const cerceve = is.querySelector<HTMLElement>("[data-cerceve]");
          const ekran = is.querySelector<HTMLElement>("[data-masaustu-ekran]");
          const telefonCerceve = is.querySelector<HTMLElement>("[data-telefon-cerceve]");
          const telefonEkran = is.querySelector<HTMLElement>("[data-telefon-ekran]");
          if (!cerceve || !ekran || !telefonCerceve || !telefonEkran) return;
          const kaydirma = () => -(ekran.offsetHeight - cerceve.clientHeight);
          const telefonKaydirma = () => -(telefonEkran.offsetHeight - telefonCerceve.clientHeight);
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: is,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                invalidateOnRefresh: true,
              },
            })
            .to(ekran, { y: kaydirma }, 0)
            .to(telefonEkran, { y: telefonKaydirma }, 0)
            .to(telefonCerceve, { yPercent: -14 }, 0);
        });
      });
    },
    { scope: kok },
  );

  return (
    <section
      ref={kok}
      id="isler"
      aria-labelledby="isler-baslik"
      className={`relative z-10 bg-gece px-4 sm:px-6 lg:px-10 ${baslik ? "pt-10 md:pt-14" : ""}`}
    >
      {/* Başlık gösterilmese de başlık sırası bozulmasın (h1'den h3'e atlanmasın): yalnız ekran okuyucu için */}
      {!baslik && (
        <h2 id="isler-baslik" className="sr-only">
          Yayındaki işler
        </h2>
      )}
      {baslik && (
        <div className="mx-auto max-w-[90rem]">
          <BolumBasi id="isler-baslik" etiket="Yayında" baslik={baslik} metin={metin} />
        </div>
      )}

      {/* Telefonda yana kaydırılan vitrin (snap), masaüstünde alt alta sabitlenen işler */}
      <div className="kaydirma-gizli mx-auto max-w-[90rem] max-md:-mx-4 max-md:mt-10 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:gap-4 max-md:overflow-x-auto max-md:px-4 max-md:pb-2">
        {isler.map((r) => (
          <article
            key={r.kod}
            data-is
            aria-labelledby={`is-${r.kod}`}
            className="relative max-md:w-[80vw] max-md:max-w-[22rem] max-md:shrink-0 max-md:snap-center md:border-b md:border-cizgi md:last:border-b-0 [.hareket_&]:md:h-[230vh]"
          >
            <div className="md:grid md:grid-cols-12 md:items-center md:gap-8 md:py-20 [.hareket_&]:md:sticky [.hareket_&]:md:top-0 [.hareket_&]:md:h-dvh [.hareket_&]:md:py-0">
              <div className="relative md:order-2 md:col-span-7 md:col-start-6 lg:col-span-8 lg:col-start-5 [perspective:1600px]">
                {r.uygulama ? <UygulamaEkranlari r={r} /> : <SiteEkranlari r={r} />}
              </div>

              <div className="max-md:mt-6 md:order-1 md:col-span-5 lg:col-span-4 lg:pr-4">
                <p className="etiket">{r.sehir ? `${r.tur} · ${r.sehir}` : r.tur}</p>
                <h3
                  id={`is-${r.kod}`}
                  className="mt-3 font-baslik text-[clamp(1.75rem,3.4vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.03em] [font-variation-settings:'opsz'_96,'wdth'_90] md:mt-4"
                >
                  {r.ad}
                </h3>
                <p className="mt-4 leading-relaxed text-soluk max-md:line-clamp-3 md:mt-5">{r.ozet}</p>
                {r.sayi && (
                  <p className="mt-5 flex items-baseline gap-2.5 md:mt-7">
                    <span className="rakam text-4xl text-alev md:text-5xl">
                      <span data-sayac={r.sayi.deger}>{r.sayi.deger.toLocaleString("tr-TR")}</span>
                      {r.sayi.sonEk}
                    </span>
                    <span className="text-soluk">{r.sayi.aciklama}</span>
                  </p>
                )}
                <ul className="mt-7 hidden gap-2.5 md:grid">
                  {r.maddeler.map((m) => (
                    <li key={m} className="flex items-start gap-3 text-[0.9375rem]">
                      <Check size={16} weight="bold" className="mt-1 shrink-0 text-alev" aria-hidden="true" />
                      {m}
                    </li>
                  ))}
                </ul>
                <a
                  href={r.adres}
                  target="_blank"
                  rel="noopener"
                  className="group mt-6 inline-flex min-h-12 items-center gap-2 rounded-full border border-cizgi-guclu py-2 pr-2 pl-5 text-[0.9375rem] transition-colors duration-300 hover:border-alev md:mt-9"
                >
                  {r.gosterim ?? r.alanAdi}
                  <span className="flex size-9 items-center justify-center rounded-full bg-krem text-gece transition-transform duration-500 ease-yay group-hover:rotate-45 group-hover:bg-alev">
                    <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
                  </span>
                  <span className="sr-only">(yeni sekmede açılır)</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/** Web sitesi: tarayıcı çerçevesi (masaüstü) ve önünde telefon; telefonda yalnız telefon, ekranı kendi kayar. */
function SiteEkranlari({ r }: { r: Referans }) {
  if (!r.masaustu || !r.telefon) return null;
  return (
    <div data-gorsel className="relative md:pl-20">
      {/* Tarayıcı çerçevesi (masaüstü): çerçeve her zemin üstünde koyu gri (data-zemin="koyu") */}
      <a
        href={r.adres}
        target="_blank"
        rel="noopener"
        tabIndex={-1}
        aria-hidden="true"
        data-zemin="koyu"
        className="hidden overflow-hidden rounded-2xl border border-cizgi-guclu bg-gece-3 golge md:block"
      >
        <div className="flex items-center gap-3 border-b border-cizgi bg-gece-3 px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-gece-4" />
            <span className="size-2.5 rounded-full bg-gece-4" />
            <span className="size-2.5 rounded-full bg-gece-4" />
          </span>
          <span className="mx-auto truncate rounded-full bg-cukur px-4 py-1 font-mono text-xs text-soluk">
            {r.alanAdi}
          </span>
        </div>
        <div data-cerceve className="relative h-[min(62dvh,36rem)] overflow-hidden">
          <div data-masaustu-ekran className="will-change-transform">
            <Image
              src={r.masaustu.src}
              width={r.masaustu.genislik}
              height={r.masaustu.yukseklik}
              sizes="(min-width: 1024px) 58vw, (min-width: 768px) 55vw, 1px"
              alt={`${r.ad} web sitesinin ekran görüntüsü`}
              className="block h-auto w-full"
            />
          </div>
        </div>
      </a>

      {/* Telefon: telefonda vitrinin kendisi, masaüstünde çerçevenin önünde küçük */}
      <div
        data-telefon-cerceve
        data-zemin="koyu"
        className="overflow-hidden border-gece-4 bg-cukur golge max-md:rounded-[2rem] max-md:border-[6px] md:absolute md:-bottom-10 md:left-0 md:w-[11.5rem] md:rounded-[1.6rem] md:border-[5px]"
      >
        <div className="relative overflow-hidden max-md:aspect-[9/14] max-md:rounded-[1.6rem] md:aspect-[9/19] md:rounded-[1.25rem]">
          <div data-telefon-ekran className="will-change-transform">
            <Image
              src={r.telefon.src}
              width={r.telefon.genislik}
              height={r.telefon.yukseklik}
              sizes="(min-width: 768px) 12rem, 80vw"
              alt={r.telefon.aciklama}
              className="block h-auto w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mobil uygulama: mağaza ekran görüntüleri yan yana telefon çerçevelerinde; ortadaki önde ve büyük. */
function UygulamaEkranlari({ r }: { r: Referans }) {
  if (!r.uygulama) return null;
  const ekranlar = r.uygulama.ekranlar.slice(0, 3);
  return (
    <div data-gorsel className="relative flex items-end justify-center gap-3 max-md:aspect-[9/14] md:gap-5 md:py-6">
      {ekranlar.map((e, i) => {
        const orta = i === 1;
        return (
          <a
            key={e.src}
            href={r.adres}
            target="_blank"
            rel="noopener"
            tabIndex={-1}
            aria-hidden="true"
            data-zemin="koyu"
            className={`overflow-hidden rounded-[1.6rem] border-[5px] border-gece-4 bg-cukur golge md:rounded-[2rem] md:border-[7px] ${
              orta ? "w-[46%] md:w-[15.5rem]" : "w-[34%] md:w-[12.5rem] md:mb-8"
            } ${i === 2 ? "max-md:hidden" : ""}`}
          >
            <Image
              src={e.src}
              width={e.genislik}
              height={e.yukseklik}
              sizes="(min-width: 768px) 16rem, 40vw"
              alt={e.aciklama}
              className="block h-auto w-full"
            />
          </a>
        );
      })}
    </div>
  );
}
