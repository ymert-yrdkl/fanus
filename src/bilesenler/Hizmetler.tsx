"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "@phosphor-icons/react/dist/ssr";
import { gsap, GENIS, HAREKET_ACIK, ScrollTrigger, useGSAP } from "@/hareket/gsap";
import { HIZMETLER, hizmetFiyatEtiketi } from "@/site/icerik";
import HizmetDemosu from "./demolar/HizmetDemosu";

/**
 * Hizmetler sayfasındaki üst üste binen kartlar: solda anlatım, fiyat ve ayrıntı bağlantısı,
 * sağda o hizmetin canlı örneği.
 */
export default function Hizmetler({ qrSvg }: { qrSvg: string }) {
  const kok = useRef<HTMLElement>(null);

  // Kartlar üst üste biner: alttaki kart gelince öndeki küçülür ve kararır
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Ekrandan uzun kart yapışınca alt kısmı görünmez kalmasın: üst boşluğu karta göre küçült
      mm.add(GENIS, () => {
        const kartlar = gsap.utils.toArray<HTMLElement>("[data-hizmet-karti]");
        const ustAyarla = () =>
          kartlar.forEach((k) => {
            k.style.top = `${Math.min(88, window.innerHeight - k.offsetHeight - 16)}px`;
          });
        ustAyarla();
        ScrollTrigger.addEventListener("refreshInit", ustAyarla);
        return () => {
          ScrollTrigger.removeEventListener("refreshInit", ustAyarla);
          kartlar.forEach((k) => (k.style.top = ""));
        };
      });
      mm.add(`${HAREKET_ACIK} and ${GENIS}`, () => {
        const kartlar = gsap.utils.toArray<HTMLElement>("[data-hizmet-karti]");
        kartlar.forEach((kart, i) => {
          const sonraki = kartlar[i + 1];
          if (!sonraki) return;
          const zc = gsap.timeline({
            scrollTrigger: { trigger: sonraki, start: "top bottom", end: "top 12%", scrub: true },
          });
          zc.to(kart, { scale: 0.9, ease: "none" }, 0).to(
            kart.querySelector("[data-kart-perde]"),
            { opacity: 0.6, ease: "none" },
            0,
          );
        });
      });
    },
    { scope: kok },
  );

  return (
    <section
      ref={kok}
      aria-label="Hizmetlerin canlı örnekleri"
      className="relative z-10 bg-gece px-4 pb-10 sm:px-6 md:pb-14 lg:px-10"
    >
      <div className="mx-auto flex max-w-[90rem] flex-col gap-6 md:gap-10">
        {HIZMETLER.map((h) => (
          <article
            key={h.kod}
            data-hizmet-karti
            aria-labelledby={`hizmet-${h.kod}`}
            className="relative origin-top overflow-hidden rounded-[1.25rem] border border-cizgi-guclu bg-gece-2 md:sticky md:top-[5.5rem] md:min-h-[calc(100dvh-7rem)]"
          >
            <div className="grid gap-10 p-5 sm:p-8 md:h-full md:grid-cols-12 md:items-center md:gap-8 lg:p-10">
              <div className="md:col-span-5 lg:pr-6">
                <p className="etiket">{h.ad}</p>
                <h2
                  id={`hizmet-${h.kod}`}
                  className="mt-4 max-w-[16ch] font-baslik text-[clamp(1.75rem,2.8vw,2.75rem)] leading-[1.02] font-semibold tracking-[-0.03em] [font-variation-settings:'opsz'_96,'wdth'_90]"
                >
                  {h.baslik}
                </h2>
                <p className="mt-5 max-w-[30rem] leading-relaxed text-soluk">{h.metin}</p>
                <ul className="mt-8 grid gap-3">
                  {h.maddeler.map((madde) => (
                    <li key={madde} className="flex items-start gap-3 text-[0.9375rem]">
                      <Check size={18} weight="bold" className="mt-0.5 shrink-0 text-alev" aria-hidden="true" />
                      {madde}
                    </li>
                  ))}
                </ul>
                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-cizgi-guclu pt-6">
                  <p className="rakam text-xl text-alev">{hizmetFiyatEtiketi(h.adres)}</p>
                  <Link
                    href={`/hizmetler/${h.adres}`}
                    className="group inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium"
                  >
                    Ayrıntılar ve paketler
                    <ArrowRight
                      size={16}
                      weight="bold"
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
              <div className="min-w-0 md:col-span-7">
                <HizmetDemosu kod={h.kod} qrSvg={qrSvg} />
              </div>
            </div>
            <div
              data-kart-perde
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-cukur opacity-0"
            />
          </article>
        ))}
      </div>
    </section>
  );
}
