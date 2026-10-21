"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { gsap, GENIS, HAREKET_ACIK, useGSAP } from "@/hareket/gsap";
import { REFERANSLAR } from "@/site/icerik";

/**
 * Yayındaki işlerin vitrini: her iş ekrana sabitlenir, tarayıcı çerçevesinde sitenin gerçek ekran
 * görüntüsü kayar. `kodlar` verilirse yalnız o işler, `baslik` boşsa başlık bölümü olmadan.
 */
export default function Isler({
  kodlar,
  baslik = "Yayında olan işler.",
  metin = "Üçü de Düzce'den, üçü de bugün çalışıyor. Ekran görüntüleri sitelerin kendisinden; tıklayıp gezebilirsiniz.",
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
      mm.add({ genis: GENIS, hareket: HAREKET_ACIK }, (baglam) => {
        const { genis, hareket } = baglam.conditions as { genis: boolean; hareket: boolean };
        if (!hareket) return;

        gsap.utils.toArray<HTMLElement>("[data-is]").forEach((is) => {
          const cerceve = is.querySelector<HTMLElement>("[data-cerceve]")!;
          const ekran = is.querySelector<HTMLElement>("[data-masaustu-ekran]")!;
          const telefonCerceve = is.querySelector<HTMLElement>("[data-telefon-cerceve]")!;
          const telefonEkran = is.querySelector<HTMLElement>("[data-telefon-ekran]")!;
          const gorsel = is.querySelector<HTMLElement>("[data-gorsel]")!;
          const kaydirma = () => -(ekran.offsetHeight - cerceve.clientHeight);
          const telefonKaydirma = () => -(telefonEkran.offsetHeight - telefonCerceve.clientHeight);

          if (genis) {
            // Sabitlenen iş boyunca sitenin ekran görüntüsü çerçevenin içinde aşağı kayar
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
          } else {
            gsap
              .timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: cerceve,
                  start: "top 85%",
                  end: "bottom 15%",
                  scrub: 1,
                  invalidateOnRefresh: true,
                },
              })
              .to(ekran, { y: kaydirma }, 0)
              .to(telefonEkran, { y: telefonKaydirma }, 0);
          }
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
      className={`relative z-10 bg-gece px-4 sm:px-6 lg:px-10 ${baslik ? "pt-28 md:pt-36" : ""}`}
    >
      {/* Başlık gösterilmese de başlık sırası bozulmasın (h1'den h3'e atlanmasın): yalnız ekran okuyucu için */}
      {!baslik && (
        <h2 id="isler-baslik" className="sr-only">
          Yayındaki işler
        </h2>
      )}
      {baslik && (
        <div className="mx-auto max-w-[90rem]">
          <h2 id="isler-baslik" data-bol className="bolum-baslik max-w-[16ch]">
            {baslik}
          </h2>
          <p data-belir className="mt-6 max-w-[36rem] text-lg leading-relaxed text-soluk">
            {metin}
          </p>
        </div>
      )}

      <div className="mx-auto max-w-[90rem]">
        {isler.map((r) => (
          <article
            key={r.kod}
            data-is
            aria-labelledby={`is-${r.kod}`}
            className="relative border-b border-cizgi py-16 last:border-b-0 md:py-0 [.hareket_&]:md:h-[230vh]"
          >
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center md:gap-8 [.hareket_&]:md:sticky [.hareket_&]:md:top-0 [.hareket_&]:md:h-dvh md:py-20 [.hareket_&]:md:py-0">
              <div className="md:col-span-5 lg:col-span-4 lg:pr-4">
                <p className="etiket">
                  {r.tur} · {r.sehir}
                </p>
                <h3
                  id={`is-${r.kod}`}
                  className="mt-4 font-baslik text-[clamp(2rem,3.4vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.03em]"
                >
                  {r.ad}
                </h3>
                <p className="mt-5 leading-relaxed text-soluk">{r.ozet}</p>
                {r.sayi && (
                  <p className="mt-7 flex items-baseline gap-2.5">
                    <span className="font-baslik text-5xl font-semibold tracking-tight text-alev tabular-nums">
                      <span data-sayac={r.sayi.deger}>{r.sayi.deger.toLocaleString("tr-TR")}</span>
                      {r.sayi.sonEk}
                    </span>
                    <span className="text-soluk">{r.sayi.aciklama}</span>
                  </p>
                )}
                <ul className="mt-7 grid gap-2.5">
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
                  className="group mt-9 inline-flex min-h-12 items-center gap-2 rounded-full border border-cizgi-guclu py-2 pr-2 pl-5 text-[0.9375rem] transition-colors duration-300 hover:border-alev"
                >
                  {r.alanAdi}
                  <span className="flex size-9 items-center justify-center rounded-full bg-krem text-gece transition-transform duration-500 ease-yay group-hover:rotate-45 group-hover:bg-alev">
                    <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
                  </span>
                  <span className="sr-only">(yeni sekmede açılır)</span>
                </a>
              </div>

              <div className="relative md:col-span-7 md:col-start-6 lg:col-span-8 lg:col-start-5 [perspective:1600px]">
                <div data-gorsel className="relative pb-10 pl-6 sm:pl-14 md:pb-0 md:pl-20">
                  {/* Tarayıcı çerçevesi */}
                  <a
                    href={r.adres}
                    target="_blank"
                    rel="noopener"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="block overflow-hidden rounded-2xl border border-cizgi-guclu bg-gece-3 golge"
                  >
                    <div className="flex items-center gap-3 border-b border-cizgi px-4 py-2.5">
                      <span className="flex gap-1.5">
                        <span className="size-2.5 rounded-full bg-gece-4" />
                        <span className="size-2.5 rounded-full bg-gece-4" />
                        <span className="size-2.5 rounded-full bg-gece-4" />
                      </span>
                      <span className="mx-auto truncate rounded-full bg-cukur px-4 py-1 font-mono text-xs text-soluk">
                        {r.alanAdi}
                      </span>
                    </div>
                    <div
                      data-cerceve
                      className="relative h-[22rem] overflow-hidden sm:h-[26rem] md:h-[min(62dvh,36rem)]"
                    >
                      <div data-masaustu-ekran className="will-change-transform">
                        <Image
                          src={r.masaustu.src}
                          width={r.masaustu.genislik}
                          height={r.masaustu.yukseklik}
                          sizes="(min-width: 1024px) 58vw, (min-width: 768px) 55vw, 92vw"
                          alt={`${r.ad} web sitesinin ekran görüntüsü`}
                          className="block h-auto w-full"
                        />
                      </div>
                    </div>
                  </a>

                  {/* Telefon */}
                  <div
                    data-telefon-cerceve
                    className="absolute bottom-0 left-0 w-[8.5rem] overflow-hidden rounded-[1.6rem] border-[5px] border-gece-4 bg-cukur golge sm:w-[10rem] md:-bottom-10 md:w-[11.5rem]"
                  >
                    <div className="relative aspect-[9/19] overflow-hidden rounded-[1.25rem]">
                      <div data-telefon-ekran className="will-change-transform">
                        <Image
                          src={r.telefon.src}
                          width={r.telefon.genislik}
                          height={r.telefon.yukseklik}
                          sizes="12rem"
                          alt={r.telefon.aciklama}
                          className="block h-auto w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
