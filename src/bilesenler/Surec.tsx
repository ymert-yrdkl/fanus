"use client";

import { useRef } from "react";
import { ChatsCircle, PencilRuler, Code, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { gsap, GENIS, HAREKET_ACIK, useGSAP } from "@/hareket/gsap";
import { SUREC } from "@/site/icerik";
import BolumBasi from "./BolumBasi";

const IKONLAR = [ChatsCircle, PencilRuler, Code, ShieldCheck];

/** Masaüstünde yatay kayan şerit (sabitlenir), telefonda dikey zaman çizgisi; ışık adım adım ilerler. */
export default function Surec() {
  const kok = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ genis: GENIS, hareket: HAREKET_ACIK }, (baglam) => {
        const { genis, hareket } = baglam.conditions as { genis: boolean; hareket: boolean };
        const kartlar = gsap.utils.toArray<HTMLElement>("[data-adim]");
        const isaretle = (ilerleme: number) => {
          kartlar.forEach((k, i) =>
            k.toggleAttribute("data-aktif", ilerleme >= i / kartlar.length + 0.02 || ilerleme >= 0.98),
          );
        };
        if (!hareket) {
          kartlar.forEach((k) => k.setAttribute("data-aktif", ""));
          return;
        }

        if (genis) {
          const ray = kok.current!.querySelector<HTMLElement>("[data-ray]")!;
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: kok.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                invalidateOnRefresh: true,
                onUpdate: (t) => isaretle(t.progress),
              },
            })
            .to(ray, { x: () => -(ray.scrollWidth - window.innerWidth) }, 0)
            .fromTo("[data-dolum]", { scaleX: 0 }, { scaleX: 1 }, 0);
        } else {
          gsap.fromTo(
            "[data-dolum-dikey]",
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: "[data-ray]",
                start: "top 70%",
                end: "bottom 60%",
                scrub: 1,
                onUpdate: (t) => isaretle(t.progress),
              },
            },
          );
        }
      });
    },
    { scope: kok },
  );

  return (
    <section
      ref={kok}
      id="surec"
      aria-labelledby="surec-baslik"
      className="relative z-10 bg-gece pt-10 pb-16 md:pt-0 md:pb-0 [.hareket_&]:md:h-[340vh]"
    >
      {/* Sabitlenirken içerik ekranın üstüne yakın durur (ortalanınca bölüm başında boş bir ekran kalıyordu) */}
      <div className="flex flex-col overflow-hidden md:py-24 [.hareket_&]:md:sticky [.hareket_&]:md:top-0 [.hareket_&]:md:h-dvh [.hareket_&]:md:pt-24 [.hareket_&]:md:pb-0">
        <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-10">
          <BolumBasi
            id="surec-baslik"
            etiket="Süreç"
            baslik="Fikirden yayına, adım adım."
            metin="Her adımın sonunda elinizde somut bir şey olur. Nerede olduğumuzu tahmin etmek zorunda kalmazsınız."
          />
        </div>

        <div className="relative mt-12 md:mt-20">
          <div
            data-ray
            className="relative flex flex-col gap-8 px-4 sm:px-6 md:w-max md:flex-row md:gap-10 md:pr-[10vw] md:pl-[max(2.5rem,calc((100vw-90rem)/2+2.5rem))]"
          >
            {/* Işık çizgisi: masaüstünde adımların üstünde yatay, telefonda solda dikey */}
            <div
              aria-hidden="true"
              className="absolute top-0 right-[10vw] left-[max(2.5rem,calc((100vw-90rem)/2+2.5rem))] hidden h-px bg-cizgi-guclu md:block"
            >
              <div
                data-dolum
                className="h-full origin-left bg-alev shadow-[0_0_12px_color-mix(in_srgb,var(--color-alev)_80%,transparent)]"
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-[1.45rem] w-px bg-cizgi-guclu sm:left-[1.95rem] md:hidden"
            >
              <div data-dolum-dikey className="h-full w-full origin-top bg-alev" />
            </div>

            {SUREC.map((adim, i) => {
              const Ikon = IKONLAR[i]!;
              return (
                <article
                  key={adim.fiil}
                  data-adim
                  className="group/adim relative pl-10 md:w-[min(26rem,34vw)] md:pt-10 md:pl-0"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-3 left-[1.45rem] size-3 -translate-x-1/2 rounded-full border border-cizgi-guclu bg-gece transition-[background-color,border-color,box-shadow] duration-500 group-data-aktif/adim:border-alev group-data-aktif/adim:bg-alev group-data-aktif/adim:shadow-[0_0_16px_4px_color-mix(in_srgb,var(--color-alev)_60%,transparent)] sm:left-[1.95rem] md:top-0 md:left-6 md:-translate-y-1/2"
                  />
                  <span className="flex size-11 items-center justify-center rounded-full border border-cizgi-guclu text-soluk transition-[background-color,border-color,color] duration-700 group-data-aktif/adim:border-alev group-data-aktif/adim:bg-alev group-data-aktif/adim:text-gece">
                    <Ikon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 font-baslik text-[clamp(2rem,3.2vw,3rem)] leading-none font-semibold tracking-[-0.035em] text-soluk transition-colors duration-700 [font-variation-settings:'opsz'_96,'wdth'_88] group-data-aktif/adim:text-krem md:mt-8">
                    {adim.fiil}
                  </h3>
                  <p className="mt-4 max-w-[26rem] leading-relaxed text-soluk">{adim.metin}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
