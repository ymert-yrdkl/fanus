"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { gsap, HAREKET_ACIK, useGSAP } from "@/hareket/gsap";
import { dugmeSinifi } from "./dugme";

/** Sayfa sonlarındaki çağrı: kaydırdıkça büyük fanus çizilir, alev yanar. */
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
          .fromTo("[data-cagri-alev]", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, ease: "back.out(2)" }, 0.55)
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
        <div aria-hidden="true" className="relative mx-auto w-full max-w-[22rem] md:col-span-5 md:max-w-[26rem]">
          <div
            data-cagri-hale
            className="absolute top-[62%] left-1/2 size-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(235_160_78/0.3),transparent_62%)]"
          />
          <svg viewBox="0 0 32 32" fill="none" className="relative w-full text-krem">
            <path
              data-cagri-cizgi
              pathLength={1}
              strokeDasharray="1"
              d="M8.5 27V14.5a7.5 7.5 0 0 1 15 0V27"
              stroke="currentColor"
              strokeWidth="0.35"
              strokeLinecap="round"
            />
            <circle
              data-cagri-cizgi
              pathLength={1}
              strokeDasharray="1"
              cx="16"
              cy="5"
              r="1.4"
              stroke="currentColor"
              strokeWidth="0.35"
            />
            <path
              data-cagri-cizgi
              pathLength={1}
              strokeDasharray="1"
              d="M5 27.5h22"
              stroke="currentColor"
              strokeWidth="0.45"
              strokeLinecap="round"
            />
            <path
              data-cagri-alev
              className="origin-[16px_21px] fill-alev"
              d="M16 13.2c2.3 2.7 3.4 4.7 3.4 6.6a3.4 3.4 0 0 1-6.8 0c0-1.9 1.1-3.9 3.4-6.6Z"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
