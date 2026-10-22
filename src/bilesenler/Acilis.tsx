"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/hareket/gsap";
import { kaydirmayiBaslat, kaydirmayiDurdur } from "@/hareket/kaydirma";
import { CizilenIsaret } from "./Logo";

// GSAP, bir zaman çizelgesinin geri çağrısında yaratılan animasyonları o çizelgenin kapsamına bağlar.
// Olay setTimeout ile ayrı bir turda yayınlanır ki dinleyenlerin animasyonları kendi kapsamlarında kalsın.
function acildiDuyur() {
  window.setTimeout(() => {
    window.__fanusAcildi = true;
    window.dispatchEvent(new Event("fanus:acildi"));
  }, 0);
}

/**
 * Açılış perdesi (masaüstü): işaret çizilir, alev yanar, perde yukarı kalkar. Oturumda ikinci açılışta kısa sürer.
 * Hareket azaltma tercihi varsa, JS yoksa ya da telefondaysa perde hiç görünmez.
 */
export default function Acilis() {
  const kok = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      // Hareket azaltma tercihinde ve telefonda perde yok (CSS de gizler)
      if (!html.classList.contains("hareket") || window.matchMedia("(max-width: 767px)").matches) {
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

      let duyuruldu = false;
      const duyur = () => {
        if (duyuruldu) return;
        duyuruldu = true;
        acildiDuyur();
      };
      const bitir = () => {
        kaydirmayiBaslat();
        gsap.set(kok.current, { display: "none" });
        duyur();
      };

      const sayac = { deger: 0 };
      const sayacEl = kok.current!.querySelector<HTMLElement>("[data-sayac-yuzde]")!;
      const zc = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: bitir });

      // Emniyet: sekme arka plandaysa ya da ilk kareler çok yavaşsa (ör. 3B gölgelendirici derlemesi)
      // zaman çizelgesi takılabilir; perde her durumda en geç birkaç saniyede kalkar.
      const emniyet = window.setTimeout(
        () => {
          if (zc.progress() < 1) {
            zc.kill();
            bitir();
          }
        },
        tekrar ? 2500 : 3500,
      );

      if (tekrar) {
        zc.set("[data-cizgi]", { strokeDashoffset: 0 })
          .set("[data-alev-acilis]", { scale: 1, opacity: 1, transformOrigin: "50% 100%" })
          .to(kok.current, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" }, 0.15)
          .call(duyur, [], 0.35);
        return () => window.clearTimeout(emniyet);
      }

      zc.fromTo(
        "[data-cizgi]",
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut", stagger: 0.08 },
      )
        .fromTo(
          "[data-alev-acilis]",
          { scale: 0, opacity: 0, transformOrigin: "50% 100%" },
          { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2.2)" },
          0.45,
        )
        .fromTo("[data-hale-acilis]", { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9 }, 0.5)
        .fromTo("[data-harf]", { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 0.7, stagger: 0.04 }, 0.3)
        .to(
          sayac,
          {
            deger: 100,
            duration: 1.0,
            ease: "power2.inOut",
            onUpdate: () => {
              sayacEl.textContent = String(Math.round(sayac.deger)).padStart(3, "0");
            },
          },
          0,
        )
        .to("[data-acilis-icerik]", { scale: 0.92, opacity: 0, duration: 0.45, ease: "power3.in" }, 1.05)
        .to(kok.current, { clipPath: "inset(0 0 100% 0)", duration: 0.85, ease: "expo.inOut" }, 1.2)
        .call(duyur, [], 1.3);
      return () => window.clearTimeout(emniyet);
    },
    { scope: kok },
  );

  return (
    <div
      ref={kok}
      aria-hidden="true"
      data-zemin="acik"
      className="acilis fixed inset-0 z-[80] items-center justify-center bg-gece [clip-path:inset(0_0_0_0)]"
    >
      <div data-acilis-icerik className="relative flex flex-col items-center gap-8">
        <div className="relative size-40">
          <div
            data-hale-acilis
            className="absolute top-[58%] left-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-alev)_35%,transparent),transparent_65%)] opacity-0"
          />
          <CizilenIsaret
            cizgiAdi="data-cizgi"
            alevAdi="data-alev-acilis"
            kalinlik={0.9}
            gizli
            className="relative size-full text-krem"
          />
        </div>
        <div className="flex items-end gap-4">
          <span className="flex overflow-hidden font-baslik text-5xl leading-[1.1] font-semibold tracking-[-0.04em]">
            {"fanussoft".split("").map((harf, i) => (
              <span key={i} data-harf className={`inline-block ${i < 5 ? "" : "text-soluk"}`}>
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
