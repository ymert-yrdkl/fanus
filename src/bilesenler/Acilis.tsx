"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/hareket/gsap";
import { kaydirmayiBaslat, kaydirmayiDurdur } from "@/hareket/kaydirma";

// GSAP, bir zaman çizelgesinin geri çağrısında yaratılan animasyonları o çizelgenin kapsamına bağlar.
// Olay setTimeout ile ayrı bir turda yayınlanır ki dinleyenlerin animasyonları kendi kapsamlarında kalsın.
function acildiDuyur() {
  window.setTimeout(() => {
    window.__fanusAcildi = true;
    window.dispatchEvent(new Event("fanus:acildi"));
  }, 0);
}

/**
 * Açılış perdesi: fanus çizilir, alev yanar, perde yukarı kalkar. Oturumda ikinci açılışta kısa sürer.
 * Hareket azaltma tercihi varsa (ya da JS yoksa) CSS perdeyi hiç göstermez.
 */
export default function Acilis() {
  const kok = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      if (!html.classList.contains("hareket")) {
        acildiDuyur();
        return;
      }
      const tekrar = html.classList.contains("tekrar");
      try {
        sessionStorage.setItem("fanus-acildi", "1");
      } catch {
        // Gizli pencerede sessionStorage kapalı olabilir; perde yine çalışır
      }
      kaydirmayiDurdur();

      const sayac = { deger: 0 };
      const sayacEl = kok.current!.querySelector<HTMLElement>("[data-sayac-yuzde]")!;
      const zc = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => {
          kaydirmayiBaslat();
          gsap.set(kok.current, { display: "none" });
        },
      });

      if (tekrar) {
        zc.set("[data-cizgi]", { strokeDashoffset: 0 })
          .set("[data-alev-acilis]", { scale: 1, opacity: 1 })
          .to(kok.current, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" }, 0.15)
          .call(acildiDuyur, [], 0.35);
        return;
      }

      zc.fromTo(
        "[data-cizgi]",
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut", stagger: 0.12 },
      )
        .fromTo(
          "[data-alev-acilis]",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.9, ease: "back.out(2.2)" },
          0.75,
        )
        .fromTo("[data-hale-acilis]", { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4 }, 0.8)
        .fromTo("[data-harf]", { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1, stagger: 0.05 }, 0.55)
        .to(
          sayac,
          {
            deger: 100,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
              sayacEl.textContent = String(Math.round(sayac.deger)).padStart(3, "0");
            },
          },
          0,
        )
        .to("[data-acilis-icerik]", { scale: 0.92, opacity: 0, duration: 0.7, ease: "power3.in" }, 1.75)
        .to(kok.current, { clipPath: "inset(0 0 100% 0)", duration: 1.05, ease: "expo.inOut" }, 2.0)
        .call(acildiDuyur, [], 2.15);
    },
    { scope: kok },
  );

  return (
    <div
      ref={kok}
      aria-hidden="true"
      className="acilis fixed inset-0 z-[80] items-center justify-center bg-gece [clip-path:inset(0_0_0_0)]"
    >
      <div data-acilis-icerik className="relative flex flex-col items-center gap-8">
        <div className="relative size-40">
          <div
            data-hale-acilis
            className="absolute top-[58%] left-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(235_160_78/0.35),transparent_65%)] opacity-0"
          />
          <svg viewBox="0 0 32 32" fill="none" className="relative size-full text-krem">
            <path
              data-cizgi
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
              d="M8.5 27V14.5a7.5 7.5 0 0 1 15 0V27"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeLinecap="round"
            />
            <path
              data-cizgi
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
              d="M5 27.5h22"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            <path
              data-alev-acilis
              className="origin-[16px_21px] fill-alev opacity-0"
              d="M16 13.2c2.3 2.7 3.4 4.7 3.4 6.6a3.4 3.4 0 0 1-6.8 0c0-1.9 1.1-3.9 3.4-6.6Z"
            />
          </svg>
        </div>
        <div className="flex items-end gap-4">
          <span className="flex overflow-hidden font-baslik text-5xl leading-[1.1] font-semibold tracking-[-0.04em]">
            {"fanus".split("").map((harf, i) => (
              <span key={i} data-harf className="inline-block">
                {harf}
              </span>
            ))}
          </span>
          <span data-sayac-yuzde className="pb-1.5 font-mono text-sm text-soluk tabular-nums">
            000
          </span>
        </div>
      </div>
    </div>
  );
}
