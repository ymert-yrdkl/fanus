"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/hareket/gsap";
import { sahneDurumu } from "./durum";

type Hal = "yukleniyor" | "hazir" | "yok";

/**
 * Sayfanın arkasında sabit duran 3B fanus. three.js sayfa açıldıktan sonra boşta yüklenir;
 * o sırada ve WebGL yoksa yerinde sıcak bir ışık durur. Saydam bölümler (ana sayfada giriş ve
 * manifesto, iletişimde teklif) tuvali gösterir, diğer bölümler zemin rengiyle örter.
 * `poz`: "akis" ana sayfanın kaydırma çizelgesi, "son" iletişim sayfasının sabit duruşu.
 */
export default function FanusSahnesi({ poz = "akis" }: { poz?: "akis" | "son" }) {
  const tuvalRef = useRef<HTMLCanvasElement>(null);
  const [hal, setHal] = useState<Hal>("yukleniyor");

  useEffect(() => {
    let iptal = false;
    let kurulum: { yokEt: () => void } | null = null;
    const azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Her sayfada sahne baştan kurulur: açılış (alev tutuşur, cam iner) yeniden oynar
    sahneDurumu.sonKarisim = poz === "son" ? 1 : 0;
    sahneDurumu.giris = azHareket ? 1 : 0;

    // Sahne hazır olunca açılış perdesinin kalkmasını bekle, sonra alevi yak ve camı indir
    const girisiBaslat = () => {
      if (azHareket) {
        sahneDurumu.giris = 1;
        return;
      }
      const oynat = () => gsap.to(sahneDurumu, { giris: 1, duration: 2.8, ease: "power2.inOut" });
      if (window.__fanusAcildi) oynat();
      else window.addEventListener("fanus:acildi", oynat, { once: true });
    };

    const baslat = async () => {
      const { fanusSahnesiKur } = await import("./fanus3b");
      if (iptal || !tuvalRef.current) return;
      kurulum = fanusSahnesiKur(tuvalRef.current, {
        azHareket,
        hazir: () => {
          setHal("hazir");
          girisiBaslat();
        },
      });
      if (!kurulum) setHal("yok");
    };

    const bosta = window.requestIdleCallback
      ? window.requestIdleCallback(() => void baslat(), { timeout: 900 })
      : window.setTimeout(() => void baslat(), 150);

    return () => {
      iptal = true;
      sahneDurumu.sonKarisim = 0;
      if (window.cancelIdleCallback) window.cancelIdleCallback(bosta);
      else window.clearTimeout(bosta);
      kurulum?.yokEt();
    };
  }, [poz]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-0 h-lvh">
      {/* Yedek ışık: three.js gelene kadar ve WebGL olmayan cihazlarda */}
      <div
        className={`absolute inset-0 transition-opacity duration-[1600ms] ${hal === "hazir" ? "opacity-0" : "opacity-100"}`}
      >
        <div className="absolute top-[64%] left-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-alev)_28%,transparent),color-mix(in_srgb,var(--color-alev)_6%,transparent)_40%,transparent_68%)] md:top-[52%] md:left-[72%]" />
      </div>
      <div
        className={`absolute inset-0 transition-opacity duration-[1600ms] ${hal === "hazir" ? "opacity-100" : "opacity-0"}`}
      >
        <canvas ref={tuvalRef} className="block h-full w-full" />
      </div>
    </div>
  );
}
