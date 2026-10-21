"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { gsap, HAREKET_ACIK, useGSAP } from "@/hareket/gsap";
import { dugmeSinifi } from "./dugme";
import { CizilenIsaret } from "./Logo";

/** Sayfa sonlarındaki çağrı: kaydırdıkça büyük fanus işareti çizilir, alev yanar. */
export default function CagriBandi({
  baslik = "Sıradaki fanus sizin olsun.",
  metin = "Ne istediğinizi kısaca yazın; kapsamı ve fiyatı birlikte netleştirelim.",
  ikinci = { ad: "Fiyatlar", adres: "/fiyatlar" },
}: {
  baslik?: string;
  metin?: string;
  ikinci?: { ad: string; adres: string };
}) {
  const kok = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(HAREKET_ACIK, () => {
        const zc = gsap.timeline({
          scrollTrigger: { trigger: kok.current, start: "top 75%", end: "center 45%", scrub: 1 },
        });
        zc.fromTo("[data-cagri-cizgi]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", stagger: 0.1 })
          .fromTo(
            "[data-cagri-alev]",
            { scale: 0, opacity: 0, transformOrigin: "50% 100%" },
            { scale: 1, opacity: 1, ease: "back.out(2)" },
            0.55,
          )
          .fromTo("[data-cagri-hale]", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, ease: "none" }, 0.5);
      });
    },
    { scope: kok },
  );

  return (
    <section
      ref={kok}
      aria-labelledby="cagri-baslik"
      className="relative z-10 overflow-hidden border-t border-cizgi bg-gece px-4 py-28 sm:px-6 md:py-40 lg:px-10"
    >
      <div className="mx-auto grid max-w-[90rem] items-center gap-14 md:grid-cols-12">
        <div className="md:col-span-7">
          <h2 id="cagri-baslik" data-bol className="dev-baslik max-w-[13ch]">
            {baslik}
          </h2>
          <p data-belir className="mt-7 max-w-[32rem] text-lg leading-relaxed text-soluk">
            {metin}
          </p>
          <div data-belir data-gecikme="0.1" className="mt-9 flex flex-wrap gap-3">
            <Link href="/iletisim" data-miknatis className={dugmeSinifi.alev}>
              Teklif al
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </Link>
            <Link href={ikinci.adres} className={dugmeSinifi.cerceve}>
              {ikinci.ad}
            </Link>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="relative mx-auto w-full max-w-[22rem] max-md:hidden md:col-span-5 md:max-w-[26rem]"
        >
          <div
            data-cagri-hale
            className="absolute top-[62%] left-1/2 size-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-alev)_30%,transparent),transparent_62%)]"
          />
          <CizilenIsaret
            cizgiAdi="data-cagri-cizgi"
            alevAdi="data-cagri-alev"
            kalinlik={0.35}
            className="relative w-full text-krem"
          />
        </div>
      </div>
    </section>
  );
}
