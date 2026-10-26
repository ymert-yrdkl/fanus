"use client";

import { useEffect, useRef, useState } from "react";
import { hareketYukle } from "@/hareket/gsap";
import { sahneDurumu } from "./durum";

type Hal = "yukleniyor" | "hazir" | "yok";

/**
 * Sayfanın arkasında sabit duran 3B fanus. three.js ilk etkileşimde yüklenir (masaüstünde etkileşim yoksa
 * 6 sn sonra); o sırada ve WebGL yoksa yerinde sıcak bir ışık durur. Telefonda o ana kadar sahnenin birebir
 * sabit görseli durur
 * (`public/fanus-telefon.webp`, giriş bitmiş hâli; tema değişirse yeniden çekilmeli). Saydam bölümler (ana sayfada giriş ve
 * manifesto, iletişimde teklif) tuvali gösterir, diğer bölümler zemin rengiyle örter. Telefonda ana sayfada
 * sahne sabit değildir: yalnız girişin parçasıdır ve sayfayla birlikte kayar (manifesto telefonda sahnesizdir).
 * `poz`: "akis" ana sayfanın kaydırma çizelgesi, "son" iletişim sayfasının sabit duruşu.
 */
export default function FanusSahnesi({
  poz = "akis",
  poster = "/fanus-telefon.webp",
}: {
  poz?: "akis" | "son";
  /** Telefondaki sabit görselin adresi; ana sayfa onu HTML'e gömülü (data: adresi) verir. */
  poster?: string;
}) {
  const tuvalRef = useRef<HTMLCanvasElement>(null);
  const [hal, setHal] = useState<Hal>("yukleniyor");

  useEffect(() => {
    let iptal = false;
    let kurulum: { yokEt: () => void } | null = null;
    const azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const telefon = window.matchMedia("(max-width: 767px)").matches;
    // Telefonda ana sayfada sabit görsel giriş bitmiş hâli gösterir; canlı sahne oradan devam eder
    const gorselden = telefon && poz === "akis";
    // Her sayfada sahne baştan kurulur: açılış (alev tutuşur, cam iner) yeniden oynar
    sahneDurumu.sonKarisim = poz === "son" ? 1 : 0;
    sahneDurumu.giris = azHareket || gorselden ? 1 : 0;

    // Sahne hazır olunca açılış perdesinin kalkmasını bekle, sonra alevi yak ve camı indir
    const girisiBaslat = () => {
      if (azHareket || gorselden) {
        sahneDurumu.giris = 1;
        return;
      }
      const oynat = () =>
        void hareketYukle().then(({ gsap }) => gsap.to(sahneDurumu, { giris: 1, duration: 2.8, ease: "power2.inOut" }));
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

    // İlk etkileşimde yükle (fare hareketi, dokunma, kaydırma, tuş): sayfa ilk açılırken işlemci boş kalır, içerik
    // hemen görünür. Masaüstünde hiç etkileşim olmazsa 6 sn sonra yine yüklenir; telefonda pil için beklenir.
    const OLAYLAR = ["pointermove", "pointerdown", "touchstart", "wheel", "keydown", "scroll"] as const;
    let basladi = false;
    const etkilesimle = () => {
      if (basladi) return;
      basladi = true;
      OLAYLAR.forEach((o) => window.removeEventListener(o, etkilesimle));
      void baslat();
    };
    OLAYLAR.forEach((o) => window.addEventListener(o, etkilesimle, { passive: true }));
    const yedek = telefon ? 0 : window.setTimeout(etkilesimle, 6000);

    return () => {
      iptal = true;
      sahneDurumu.sonKarisim = 0;
      OLAYLAR.forEach((o) => window.removeEventListener(o, etkilesimle));
      window.clearTimeout(yedek);
      kurulum?.yokEt();
    };
  }, [poz]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-0 h-lvh overflow-hidden ${poz === "akis" ? "max-md:absolute" : ""}`}
    >
      {/* Telefonda canlı sahne gelene kadar sahnenin sabit görseli (yalnız ana sayfa) */}
      {poz === "akis" && (
        // eslint-disable-next-line @next/next/no-img-element -- tam ekran boyunda, ölçeklemesi CSS ile
        <img
          src={poster}
          alt=""
          fetchPriority="high"
          className={`absolute top-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 transition-opacity duration-700 md:hidden ${hal === "hazir" ? "opacity-0" : "opacity-100"}`}
        />
      )}
      {/* Yedek ışık: three.js gelene kadar ve WebGL olmayan cihazlarda */}
      <div
        className={`absolute inset-0 transition-opacity duration-[1600ms] ${hal === "hazir" ? "opacity-0" : "opacity-100"} ${poz === "akis" ? "max-md:hidden" : ""}`}
      >
        <div className="absolute top-[64%] left-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-isik)_28%,transparent),color-mix(in_srgb,var(--color-isik)_6%,transparent)_40%,transparent_68%)] md:top-[52%] md:left-[72%]" />
      </div>
      <div
        className={`absolute inset-0 transition-opacity duration-[1600ms] max-md:duration-700 ${hal === "hazir" ? "opacity-100" : "opacity-0"}`}
      >
        <canvas ref={tuvalRef} className="block h-full w-full" />
      </div>
    </div>
  );
}
