"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Phone, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { vurgu } from "@/hareket/renk";
import { gsap, HAREKET_ACIK, ScrollTrigger, useGSAP } from "@/hareket/gsap";
import { useIsletmeAdi } from "../IsletmeAdi";

type Urun = { ad: string; aciklama?: string; fiyat: number };

const KATEGORILER: { ad: string; urunler: Urun[] }[] = [
  {
    ad: "Çorbalar",
    urunler: [
      { ad: "Mercimek çorbası", aciklama: "Limon ve kıtır ekmekle", fiyat: 95 },
      { ad: "Ezogelin", fiyat: 95 },
      { ad: "Tavuk suyu", fiyat: 110 },
    ],
  },
  {
    ad: "Ana yemekler",
    urunler: [
      { ad: "Izgara köfte", aciklama: "Piyaz ve közlenmiş biberle", fiyat: 320 },
      { ad: "Tavuk şiş", fiyat: 280 },
      { ad: "Karışık pide", fiyat: 300 },
    ],
  },
  {
    ad: "Tatlılar",
    urunler: [
      { ad: "Künefe", aciklama: "Antep fıstığıyla", fiyat: 160 },
      { ad: "Sütlaç", fiyat: 110 },
    ],
  },
  {
    ad: "İçecekler",
    urunler: [
      { ad: "Ayran", fiyat: 35 },
      { ad: "Türk kahvesi", fiyat: 70 },
      { ad: "Çay", fiyat: 20 },
    ],
  },
];

/** QR kod okutulur, menü telefonda açılır; fiyat panelden değişince menüde hemen görünür. */
export default function QrMenuDemo({ qrSvg }: { qrSvg: string }) {
  const kok = useRef<HTMLDivElement>(null);
  const { gorunen } = useIsletmeAdi();
  const [kategori, setKategori] = useState(0);
  const [corbaFiyati, setCorbaFiyati] = useState(95);
  const [guncellendi, setGuncellendi] = useState(0);

  // Görünüme girince: QR taranır, menü telefona akar
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(HAREKET_ACIK, () => {
        gsap.set("[data-menu-satir]", { autoAlpha: 0, y: 18 });
        const zc = gsap.timeline({ paused: true });
        zc.fromTo(
          "[data-tarama]",
          { top: "0%", autoAlpha: 1 },
          { top: "100%", duration: 1.1, ease: "power1.inOut", repeat: 1, yoyo: true },
        )
          .to("[data-tarama]", { autoAlpha: 0, duration: 0.2 })
          .fromTo(
            "[data-telefon-ekran]",
            { clipPath: "inset(0 0 100% 0)" },
            { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.inOut" },
            "-=0.1",
          )
          .to("[data-menu-satir]", { autoAlpha: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.06 }, "-=0.35");
        const t = ScrollTrigger.create({
          trigger: kok.current,
          start: "top 65%",
          once: true,
          onEnter: () => zc.play(),
        });
        return () => t.kill();
      });
    },
    { scope: kok },
  );

  // Kategori değişince satırlar yeniden belirir; fiyat değişince satır parlar
  const ilkKategori = useRef(true);
  useEffect(() => {
    if (ilkKategori.current) {
      ilkKategori.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      kok.current!.querySelectorAll("[data-menu-satir]"),
      { autoAlpha: 0, x: 16 },
      { autoAlpha: 1, x: 0, duration: 0.5, ease: "expo.out", stagger: 0.05 },
    );
  }, [kategori]);

  useEffect(() => {
    if (guncellendi === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      kok.current!.querySelector("[data-fiyat-satiri]"),
      { backgroundColor: vurgu(0.35) },
      { backgroundColor: vurgu(0), duration: 1.2, ease: "power2.out" },
    );
    gsap.fromTo(
      kok.current!.querySelector("[data-fiyat]"),
      { yPercent: -60, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.45, ease: "back.out(2)" },
    );
  }, [guncellendi]);

  const fiyatDegistir = (fark: number) => {
    setKategori(0);
    setCorbaFiyati((f) => Math.max(5, Math.min(995, f + fark)));
    setGuncellendi((g) => g + 1);
  };

  const urunler = KATEGORILER[kategori]!.urunler.map((u, i) =>
    kategori === 0 && i === 0 ? { ...u, fiyat: corbaFiyati } : u,
  );

  return (
    <div ref={kok} className="grid items-center gap-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-10">
      <div className="grid gap-5">
        <div className="relative mx-auto w-full max-w-[15rem] overflow-hidden rounded-[1.75rem] bg-[#fff] p-5 sm:mx-0">
          <div
            className="text-gece [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
          <span
            data-tarama
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-3 top-0 h-0.5 rounded-full bg-alev opacity-0 shadow-[0_0_18px_4px_color-mix(in_srgb,var(--color-alev)_70%,transparent)]"
          />
        </div>
        <div>
          <p className="max-w-[22rem] text-[0.9375rem] leading-relaxed">
            Telefonunuzun kamerasıyla okutun: <span className="text-alev">Emre Pide&apos;nin gerçek QR menüsü</span>{" "}
            açılır. Bu kodu biz kurduk.
          </p>
          <a
            href="https://menu.emrepide.com.tr"
            target="_blank"
            rel="noopener"
            className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm text-soluk underline decoration-cizgi-guclu underline-offset-4 transition-colors hover:text-alev"
          >
            Telefondaysanız dokunun: menu.emrepide.com.tr
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>

        <div className="rounded-[1.25rem] border border-cizgi bg-cukur p-4">
          <p className="etiket">Panel</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-sm">Mercimek çorbası</span>
            <div className="flex items-center gap-1 rounded-full bg-gece-3 p-1">
              <button
                type="button"
                onClick={() => fiyatDegistir(-5)}
                className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-gece-4"
              >
                <Minus size={14} aria-hidden="true" />
                <span className="sr-only">Fiyatı 5 TL düşür</span>
              </button>
              <span className="w-14 text-center text-sm tabular-nums">₺{corbaFiyati}</span>
              <button
                type="button"
                onClick={() => fiyatDegistir(5)}
                className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-gece-4"
              >
                <Plus size={14} aria-hidden="true" />
                <span className="sr-only">Fiyatı 5 TL artır</span>
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs text-soluk">Fiyatı değiştirin, telefondaki menü anında güncellenir.</p>
        </div>
      </div>

      {/* Telefon */}
      <div className="relative mx-auto h-[31rem] w-[15.5rem] shrink-0 rounded-[2.6rem] border-[7px] border-gece-4 bg-cukur golge">
        <span
          aria-hidden="true"
          className="absolute top-2 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-gece-4"
        />
        <div
          data-telefon-ekran
          className="flex h-full flex-col overflow-hidden rounded-[2.1rem] bg-[#faf6ef] text-[#1d1a16]"
        >
          <div className="bg-[#1d1a16] px-4 pt-9 pb-4 text-[#faf6ef]">
            <p className="truncate font-baslik text-lg font-semibold">{gorunen}</p>
            <p className="text-[0.6875rem] tracking-[0.12em] text-[#faf6ef]/70 uppercase">Menü</p>
          </div>
          <div
            className="flex gap-1.5 overflow-x-auto px-3 py-2.5 [scrollbar-width:none]"
            role="tablist"
            aria-label="Menü kategorileri"
          >
            {KATEGORILER.map((k, i) => (
              <button
                key={k.ad}
                type="button"
                role="tab"
                aria-selected={kategori === i}
                onClick={() => setKategori(i)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[0.6875rem] font-medium transition-colors ${
                  kategori === i ? "bg-[#c4502b] text-[#fff]" : "bg-[#1d1a16]/[0.06] text-[#1d1a16]/80"
                }`}
              >
                {k.ad}
              </button>
            ))}
          </div>
          <ul className="flex-1 space-y-2 overflow-hidden px-3 pb-3">
            {urunler.map((u, i) => (
              <li
                key={`${kategori}-${u.ad}`}
                data-menu-satir
                {...(kategori === 0 && i === 0 ? { "data-fiyat-satiri": true } : {})}
                className="flex items-start justify-between gap-2 rounded-xl bg-[#fff] p-2.5 shadow-[0_1px_0_rgb(29_26_22/0.06)]"
              >
                <div className="min-w-0">
                  <p className="text-[0.8125rem] leading-tight font-semibold">{u.ad}</p>
                  {u.aciklama && <p className="mt-0.5 text-[0.6875rem] leading-snug text-[#1d1a16]/70">{u.aciklama}</p>}
                </div>
                <span className="overflow-hidden rounded-full bg-[#c4502b]/10 px-2 py-0.5 text-[0.75rem] font-semibold text-[#a3401f]">
                  <span className="block tabular-nums" {...(kategori === 0 && i === 0 ? { "data-fiyat": true } : {})}>
                    ₺{u.fiyat}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-[#1d1a16]/10 p-3">
            <span className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-[#1d1a16] text-[0.75rem] font-medium text-[#faf6ef]">
              <Phone size={14} aria-hidden="true" />
              Sipariş için ara
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
