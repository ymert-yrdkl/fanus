"use client";

import { useRef } from "react";
import { gsap, GENIS, HAREKET_ACIK, SplitText, useGSAP } from "@/hareket/gsap";
import { sahneDurumu } from "@/sahne/durum";

const CUMLELER = [
  "Her işletmenin bir ışığı var: ustanın elindeki lezzet, atölyedeki hassasiyet, tezgâhtaki emek.",
  "İnternet rüzgârlı bir yer. Yavaş açılan sayfa, bulunmayan ürün, cevapsız kalan mesaj; ışık kolayca söner.",
  "fanus o ışığın camıdır. Korur, büyütür ve uzaktan görünür kılar.",
];

/** Fanusun ekrandaki yerleri: masaüstünde sağda, telefonda üstte/altta. */
const POZLAR = {
  genis: {
    giris: { x: 0.22, y: 0.06, boy: 0.62 },
    manifesto: { x: 0.235, y: 0.05, boy: 0.76 },
  },
  dar: {
    giris: { x: 0, y: 0.28, boy: 0.37 },
    manifesto: { x: 0, y: -0.12, boy: 0.42 },
  },
};

/**
 * Giriş + manifesto boyunca tek bir kaydırma zaman çizelgesi (1 birim = 1 ekran boyu):
 * 0-1 giriş kayar, fanus yerine geçer · 1-2 ilk cümle · 2-3 cam kalkar, alev rüzgârda titrer ·
 * 3-4 cam iner, ışık büyür · 4.2-5.2 kamera ışığa dalar ve sahne kararır.
 * Tek çizelge kullanılır ki sahne değerleri iki ayrı tetikte çakışmasın.
 */
export default function Manifesto() {
  const kok = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ genis: GENIS, hareket: HAREKET_ACIK }, (baglam) => {
        const { genis, hareket } = baglam.conditions as { genis: boolean; hareket: boolean };
        const P = genis ? POZLAR.genis : POZLAR.dar;
        const A = sahneDurumu.akis;
        gsap.set(A, { ...P.giris, kapak: 0, isik: 1, gorunur: 1 });
        sahneDurumu.ruzgar = 0.15;
        if (!hareket) return;

        const cumleler = gsap.utils.toArray<HTMLElement>("[data-cumle]");
        const bolumler = cumleler.map((c) => SplitText.create(c, { type: "words" }));
        gsap.set(cumleler, { autoAlpha: 0 });
        bolumler.forEach((b) => gsap.set(b.words, { opacity: 0.13 }));

        const zc = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: document.getElementById("ust"),
            start: "top top",
            endTrigger: kok.current,
            end: "bottom bottom",
            scrub: 1,
          },
        });

        // Giriş kayarken fanus manifestodaki yerine geçer
        zc.to(A, { ...P.manifesto, duration: 1, ease: "power1.inOut" }, 0);

        // Birinci cümle
        zc.to(cumleler[0], { autoAlpha: 1, duration: 0.12 }, 0.9)
          .to(bolumler[0].words, { opacity: 1, duration: 0.12, stagger: 0.7 / bolumler[0].words.length }, 1.0)
          .to(cumleler[0], { autoAlpha: 0, y: -40, duration: 0.18 }, 1.85);

        // İkinci cümle: cam kalkar, rüzgâr esmeye başlar
        zc.to(A, { kapak: 1, y: P.manifesto.y + 0.12, duration: 0.5, ease: "power2.inOut" }, 1.95)
          .to(sahneDurumu, { ruzgar: 1.1, duration: 0.4 }, 2.05)
          .fromTo(cumleler[1], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.18 }, 2.0)
          .to(bolumler[1].words, { opacity: 1, duration: 0.12, stagger: 0.75 / bolumler[1].words.length }, 2.15)
          .fromTo("[data-ruzgar-ipucu]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 2.3)
          .to("[data-ruzgar-ipucu]", { autoAlpha: 0, duration: 0.15 }, 2.95)
          .to(cumleler[1], { autoAlpha: 0, y: -40, duration: 0.18 }, 2.95);

        // Üçüncü cümle: cam yerine iner, ışık büyür
        zc.to(A, { kapak: 0, y: P.manifesto.y, duration: 0.45, ease: "power3.in" }, 3.05)
          .to(sahneDurumu, { ruzgar: 0.1, duration: 0.3 }, 3.2)
          .to(A, { isik: 2.3, boy: P.manifesto.boy * 1.12, duration: 0.6, ease: "power2.out" }, 3.45)
          .fromTo(cumleler[2], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.18 }, 3.1)
          .to(bolumler[2].words, { opacity: 1, duration: 0.12, stagger: 0.6 / bolumler[2].words.length }, 3.25)
          .to(cumleler[2], { autoAlpha: 0, y: -40, duration: 0.2 }, 4.25);

        // Işığa dalış
        zc.to(A, { x: 0, y: -0.03, boy: 5.5, isik: 3.4, duration: 0.85, ease: "power2.in" }, 4.3)
          .fromTo("[data-isik-perde]", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.in" }, 4.5)
          .to(A, { gorunur: 0, duration: 0.12 }, 5.05)
          .to({}, { duration: 0.05 }, 5.15);

        return () => bolumler.forEach((b) => b.revert());
      });
    },
    { scope: kok },
  );

  return (
    <section
      ref={kok}
      id="manifesto"
      aria-label="fanus ne demek"
      className="relative z-10 bg-gece/85 [.hareket_&]:h-[520vh] [.hareket_&]:bg-transparent"
    >
      <div className="relative overflow-hidden [.hareket_&]:sticky [.hareket_&]:top-0 [.hareket_&]:h-svh">
        <div className="mx-auto grid h-full max-w-[90rem] px-4 py-24 sm:px-6 md:items-center lg:px-10 [.hareket_&]:py-0">
          <div className="relative flex flex-col gap-10 md:max-w-[44rem] [.hareket_&]:h-full [.hareket_&]:max-md:justify-end [.hareket_&]:max-md:pb-[12svh] lg:max-w-[48rem]">
            {CUMLELER.map((cumle, i) => (
              <p
                key={i}
                data-cumle
                className="font-baslik text-[clamp(1.75rem,3.4vw,3.25rem)] leading-[1.14] font-medium tracking-[-0.02em] text-krem [.hareket_&]:absolute [.hareket_&]:inset-x-0 [.hareket_&]:max-md:bottom-[12svh] [.hareket_&]:md:top-1/2 [.hareket_&]:md:-translate-y-1/2"
              >
                {cumle}
              </p>
            ))}
          </div>
        </div>

        <p
          data-ruzgar-ipucu
          className="pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 rounded-full border border-cizgi bg-gece/60 px-4 py-2 font-mono text-xs tracking-wide text-soluk opacity-0 backdrop-blur [@media(pointer:fine)]:block"
        >
          Fareyi hızlıca gezdirin: rüzgâr sizsiniz
        </p>

        {/* Işığa dalışın sonu: alev ekranı doldurunca sahne düz gece rengine kapanır (degrade yok) */}
        <div data-isik-perde aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gece opacity-0" />
      </div>
    </section>
  );
}
