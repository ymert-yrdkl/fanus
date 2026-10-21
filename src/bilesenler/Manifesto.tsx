"use client";

import { useRef } from "react";
import { gsap, GENIS, HAREKET_ACIK, ScrollTrigger, SplitText, useGSAP } from "@/hareket/gsap";
import { sahneDurumu } from "@/sahne/durum";

const CUMLELER = [
  "Her işletmenin bir ışığı var: ustanın elindeki lezzet, atölyedeki hassasiyet, tezgâhtaki emek.",
  "İnternet rüzgârlı bir yer. Yavaş açılan sayfa, bulunmayan ürün, cevapsız kalan mesaj; ışık kolayca söner.",
  "fanus o ışığın camıdır. Korur, büyütür ve uzaktan görünür kılar.",
];

/** Fanusun ekrandaki yerleri: masaüstünde sağda, telefonda başlığın altında. */
const POZLAR = {
  genis: {
    giris: { x: 0.27, y: 0.04, boy: 0.64 },
    manifesto: { x: 0.235, y: 0.05, boy: 0.76 },
  },
  dar: {
    giris: { x: 0, y: 0.31, boy: 0.38 },
    manifesto: { x: 0, y: -0.12, boy: 0.42 },
  },
};

/**
 * Giriş + manifesto boyunca tek bir kaydırma zaman çizelgesi (1 birim = 1 ekran boyu):
 * 0-1 giriş kayar, fanus yerine geçer · 1-2 ilk cümle · 2-3 cam parçaları açılır, rüzgâr çıkar, alev titrer ·
 * 3-4 cam kapanır, ışık büyür · 4.1-4.6 alev son kez parlar. Bölüm bitince gündüz sayfası
 * doğrudan sahnenin üstüne biner; arada boş koyu ekran yok. Sahne, gündüz ekranı tamamen örtünce gizlenir.
 * Konum ve ışık tek çizelgede kalır ki sahne değerleri iki ayrı tetikte çakışmasın; görünürlüğü yalnız ayrı tetik yazar.
 * Telefonda (dar ekran) sabitleme ve çizelge yoktur: üç cümle alt alta, ekrana girince belirir.
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

        if (!genis) {
          // Telefon: sahne yalnız girişte; cümleler normal akışta, ekrana girince belirir
          gsap.utils.toArray<HTMLElement>("[data-cumle]").forEach((c) =>
            gsap.fromTo(
              c,
              { opacity: 0, y: 16 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: { trigger: c, start: "top 85%", once: true },
              },
            ),
          );
          // Giriş ekrandan çıkınca sahne çizimi durur (pil ve işlemci)
          ScrollTrigger.create({
            trigger: document.getElementById("ust"),
            start: "bottom top",
            onEnter: () => gsap.set(A, { gorunur: 0 }),
            onLeaveBack: () => gsap.set(A, { gorunur: 1 }),
          });
          return;
        }

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

        // İkinci cümle: cam parçaları açılır, rüzgâr çıkar, korumasız alev titrer, kıvılcımlar savrulur
        zc.to(A, { kapak: 1, y: P.manifesto.y + 0.1, duration: 0.5, ease: "power2.inOut" }, 1.95)
          .to(sahneDurumu, { ruzgar: 1.15, duration: 0.4 }, 2.05)
          .fromTo(cumleler[1], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.18 }, 2.0)
          .to(bolumler[1].words, { opacity: 1, duration: 0.12, stagger: 0.75 / bolumler[1].words.length }, 2.15)
          .fromTo("[data-ruzgar-ipucu]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 2.3)
          .to("[data-ruzgar-ipucu]", { autoAlpha: 0, duration: 0.15 }, 2.95)
          .to(cumleler[1], { autoAlpha: 0, y: -40, duration: 0.18 }, 2.95);

        // Üçüncü cümle: cam kapanır, rüzgâr kesilir, ışık büyür
        zc.to(A, { kapak: 0, y: P.manifesto.y, duration: 0.45, ease: "power3.in" }, 3.05)
          .to(sahneDurumu, { ruzgar: 0.1, duration: 0.3 }, 3.2)
          .to(A, { isik: 2.3, boy: P.manifesto.boy * 1.12, duration: 0.6, ease: "power2.out" }, 3.45)
          .fromTo(cumleler[2], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.18 }, 3.1)
          .to(bolumler[2].words, { opacity: 1, duration: 0.12, stagger: 0.6 / bolumler[2].words.length }, 3.25)
          .to(cumleler[2], { autoAlpha: 0, y: -40, duration: 0.2 }, 4.05);

        // Kapanış: alev son kez parlar; hemen ardından gündüz sayfası üstüne biner (boy değişmez, kadraj taşmasın)
        zc.to(A, { isik: 2.9, duration: 0.5, ease: "power1.inOut" }, 4.1);

        // Gündüz sayfası ekranı tamamen örtünce sahne gizlenir, geri kaydırınca yeniden görünür
        ScrollTrigger.create({
          trigger: kok.current,
          start: "bottom top",
          onEnter: () => gsap.set(A, { gorunur: 0 }),
          onLeaveBack: () => gsap.set(A, { gorunur: 1 }),
        });

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
      className="relative z-10 bg-gece/85 max-md:bg-gece [.hareket_&]:md:h-[460vh] [.hareket_&]:md:bg-transparent"
    >
      <div className="relative overflow-hidden [.hareket_&]:md:sticky [.hareket_&]:md:top-0 [.hareket_&]:md:h-svh">
        <div className="mx-auto grid h-full max-w-[90rem] px-4 py-20 sm:px-6 md:items-center lg:px-10 [.hareket_&]:md:py-0">
          <div className="relative flex flex-col gap-10 md:max-w-[44rem] [.hareket_&]:md:h-full lg:max-w-[50rem]">
            {CUMLELER.map((cumle, i) => (
              <p
                key={i}
                data-cumle
                className="cumle text-krem [.hareket_&]:md:absolute [.hareket_&]:md:inset-x-0 [.hareket_&]:md:top-1/2 [.hareket_&]:md:-translate-y-1/2"
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
      </div>
    </section>
  );
}
