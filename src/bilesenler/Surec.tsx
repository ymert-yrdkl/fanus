"use client";

import { useRef } from "react";
import { ChatsCircle, PencilRuler, Code, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { gsap, GENIS, HAREKET_ACIK, useGSAP } from "@/hareket/gsap";
import { SUREC } from "@/site/icerik";

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
      className="relative z-10 bg-gece pt-28 pb-24 md:pt-0 md:pb-0 [.hareket_&]:md:h-[340vh]"
    >
      <div className="flex flex-col justify-center overflow-hidden md:py-32 [.hareket_&]:md:sticky [.hareket_&]:md:top-0 [.hareket_&]:md:h-dvh [.hareket_&]:md:py-0">
        <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-10">
          <h2 id="surec-baslik" data-bol className="bolum-baslik max-w-[15ch]">
            Fikirden yayına, adım adım.
          </h2>
          <p data-belir className="mt-6 max-w-[34rem] text-lg leading-relaxed text-soluk">
            Her adımın sonunda elinizde somut bir şey olur. Nerede olduğumuzu tahmin etmek zorunda kalmazsınız.
          </p>
        </div>

        <div className="relative mt-14 md:mt-20">
          <div
            data-ray
            className="relative flex flex-col gap-5 px-4 sm:px-6 md:w-max md:flex-row md:gap-6 md:pr-[10vw] md:pl-[max(2.5rem,calc((100vw-90rem)/2+2.5rem))]"
          >
            {/* Işık çizgisi: masaüstünde kartların üstünde yatay, telefonda solda dikey */}
            <div
              aria-hidden="true"
              className="absolute top-0 right-[10vw] left-[max(2.5rem,calc((100vw-90rem)/2+2.5rem))] hidden h-px bg-cizgi md:block"
            >
              <div
                data-dolum
                className="h-full origin-left bg-alev shadow-[0_0_12px_color-mix(in_srgb,var(--color-alev)_80%,transparent)]"
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-[2.2rem] w-px bg-cizgi sm:left-[2.7rem] md:hidden"
            >
              <div data-dolum-dikey className="h-full w-full origin-top bg-alev" />
            </div>

            {SUREC.map((adim, i) => {
              const Ikon = IKONLAR[i]!;
              return (
                <article
                  key={adim.fiil}
                  data-adim
                  className="group/adim relative pl-14 md:w-[min(30rem,38vw)] md:pt-12 md:pl-0"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-7 left-[1.2rem] size-3 -translate-x-1/2 rounded-full border border-cizgi-guclu bg-gece transition-[background-color,border-color,box-shadow] duration-500 group-data-aktif/adim:border-alev group-data-aktif/adim:bg-alev group-data-aktif/adim:shadow-[0_0_16px_4px_color-mix(in_srgb,var(--color-alev)_60%,transparent)] md:top-0 md:left-8 md:-translate-y-1/2"
                  />
                  <div className="h-full rounded-[1.75rem] border border-cizgi bg-gece-2 p-6 transition-[border-color,background-color] duration-700 group-data-aktif/adim:border-alev/40 group-data-aktif/adim:bg-gece-3 md:p-9">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-gece-4 text-soluk transition-colors duration-700 group-data-aktif/adim:bg-alev group-data-aktif/adim:text-gece">
                      <Ikon size={24} aria-hidden="true" />
                    </span>
                    <h3 className="mt-8 font-baslik text-[clamp(1.75rem,2.6vw,2.5rem)] leading-none font-semibold tracking-[-0.03em] text-soluk transition-colors duration-700 group-data-aktif/adim:text-krem">
                      {adim.fiil}
                    </h3>
                    <p className="mt-4 leading-relaxed text-soluk">{adim.metin}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
