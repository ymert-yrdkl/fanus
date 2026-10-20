"use client";

import { Fragment, useRef } from "react";
import { gsap, HAREKET_ACIK, ScrollTrigger, useGSAP } from "@/hareket/gsap";
import { FanusIsareti } from "./Logo";

const OGELER = ["E-ticaret", "Kurumsal site", "Web otomasyonu", "QR menü", "Yönetim paneli", "Entegrasyon"];

/** Sayfadaki tek kayan şerit: kaydırma hızıyla hızlanır, yön değiştirir ve eğilir. */
export default function Serit() {
  const kok = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(HAREKET_ACIK, () => {
        const dongu = gsap.to("[data-serit-ic]", { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
        const egik = gsap.quickTo("[data-serit-ic]", "skewX", { duration: 0.5, ease: "power3.out" });
        let yon = 1;
        const tetik = ScrollTrigger.create({
          trigger: kok.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (t) => {
            const hiz = t.getVelocity();
            if (t.direction !== yon) yon = t.direction;
            gsap.to(dongu, {
              timeScale: yon * (1 + Math.min(Math.abs(hiz) / 260, 7)),
              duration: 0.25,
              overwrite: true,
            });
            gsap.to(dongu, { timeScale: yon, duration: 1.4, delay: 0.25, ease: "power2.out" });
            egik(gsap.utils.clamp(-8, 8, -hiz / 240));
          },
          onToggle: (t) => (t.isActive ? dongu.play() : dongu.pause()),
        });
        return () => tetik.kill();
      });
    },
    { scope: kok },
  );

  return (
    <section
      ref={kok}
      aria-label="Yaptığımız işler"
      className="relative z-10 overflow-hidden border-y border-cizgi bg-gece py-8 md:py-12"
    >
      <div data-serit-ic className="flex w-max will-change-transform">
        {[0, 1].map((kopya) => (
          <div
            key={kopya}
            aria-hidden={kopya === 1}
            className="flex shrink-0 items-center gap-8 pr-8 md:gap-14 md:pr-14"
          >
            {OGELER.map((oge, i) => (
              <Fragment key={oge}>
                <span
                  className={`font-baslik text-[clamp(2.75rem,7.5vw,7rem)] leading-none font-semibold tracking-[-0.04em] whitespace-nowrap ${i % 2 === 1 ? "cizgi-yazi" : "text-krem"}`}
                >
                  {oge}
                </span>
                <FanusIsareti className="size-10 shrink-0 text-soluk md:size-14" />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
