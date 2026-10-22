"use client";

import { Fragment, useRef } from "react";
import { gsap, HAREKET_ACIK, ScrollTrigger, useGSAP } from "@/hareket/gsap";

const OGELER = [
  "E-ticaret",
  "Kurumsal site",
  "QR menü",
  "NFC kart",
  "Özel yazılım",
  "Üretim otomasyonu",
  "Yönetim paneli",
  "Entegrasyon",
];

/** Sayfadaki tek kayan şerit: ince çizgiler arasında, kaydırma hızıyla hızlanır, yön değiştirir ve eğilir. */
export default function Serit() {
  const kok = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(HAREKET_ACIK, () => {
        const dongu = gsap.to("[data-serit-ic]", { xPercent: -50, duration: 42, ease: "none", repeat: -1 });
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
            egik(gsap.utils.clamp(-6, 6, -hiz / 240));
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
      className="relative z-10 overflow-hidden border-y border-cizgi-guclu bg-gece py-5 md:py-7"
    >
      <div data-serit-ic className="flex w-max will-change-transform">
        {[0, 1].map((kopya) => (
          <div
            key={kopya}
            aria-hidden={kopya === 1}
            className="flex shrink-0 items-center gap-6 pr-6 md:gap-10 md:pr-10"
          >
            {OGELER.map((oge) => (
              <Fragment key={oge}>
                <span className="font-baslik text-[clamp(1.75rem,3.6vw,3.25rem)] leading-none font-semibold tracking-[-0.035em] whitespace-nowrap [font-variation-settings:'opsz'_96,'wdth'_88]">
                  {oge}
                </span>
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-alev md:size-2.5" />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
