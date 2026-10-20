"use client";

import { useEffect, useRef, useState } from "react";
import { Desktop, DeviceMobile, List, MagnifyingGlass, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { gsap } from "@/hareket/gsap";
import { adresAdi, basHarfler, useIsletmeAdi } from "../IsletmeAdi";

// Örnek sitenin tema renkleri (ziyaretçinin seçeceği marka renkleri; fanus'un paleti değil)
const RENKLER = [
  { ad: "Kehribar", deger: "#e39b4c" },
  { ad: "Deniz", deger: "#5f9fb8" },
  { ad: "Zeytin", deger: "#8fa66a" },
  { ad: "Gül", deger: "#cf8592" },
];

const METIN = {
  tr: {
    menu: ["Hakkımızda", "Hizmetler", "İletişim"],
    baslik: (ad: string) => `${ad} ile tanışın`,
    alt: "Ne yaptığımızı, nasıl yaptığımızı ve size nasıl yardım edeceğimizi bir dakikada anlatan site.",
    dugme: "Teklif isteyin",
    kartlar: ["Hizmetlerimiz", "Referanslar", "Bize ulaşın"],
    googleBaslik: (ad: string) => `${ad} | Resmi web sitesi`,
    googleMetin: (ad: string) =>
      `${ad}: hizmetlerimiz, referanslarımız ve iletişim bilgilerimiz. Hemen teklif isteyin.`,
  },
  en: {
    menu: ["About", "Services", "Contact"],
    baslik: (ad: string) => `Meet ${ad}`,
    alt: "A site that explains what we do, how we do it and how we can help you, in under a minute.",
    dugme: "Request a quote",
    kartlar: ["Our services", "References", "Contact us"],
    googleBaslik: (ad: string) => `${ad} | Official website`,
    googleMetin: (ad: string) => `${ad}: our services, references and contact details. Request a quote today.`,
  },
};

type Dil = keyof typeof METIN;
type Cihaz = "masaustu" | "telefon";

function Secenek({
  secili,
  onClick,
  children,
  etiket,
}: {
  secili: boolean;
  onClick: () => void;
  children: React.ReactNode;
  etiket?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={secili}
      aria-label={etiket}
      onClick={onClick}
      className={`flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-full px-3 text-sm transition-colors duration-300 ${
        secili ? "bg-krem text-gece" : "text-soluk hover:text-krem"
      }`}
    >
      {children}
    </button>
  );
}

/** Canlı düzenleyici: renk, dil ve cihaz değişince örnek site anında değişir. */
export default function KurumsalDemo() {
  const kok = useRef<HTMLDivElement>(null);
  const { gorunen } = useIsletmeAdi();
  const [renk, setRenk] = useState(0);
  const [dil, setDil] = useState<Dil>("tr");
  const [cihaz, setCihaz] = useState<Cihaz>("masaustu");
  const ilk = useRef(true);
  const m = METIN[dil];
  const alanAdi = `${adresAdi(gorunen)}.com.tr`;

  // Dil değişince yazılar aşağıdan yeniden belirir
  useEffect(() => {
    if (ilk.current) {
      ilk.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      kok.current!.querySelectorAll("[data-dil-metni]"),
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "expo.out", stagger: 0.04 },
    );
  }, [dil]);

  return (
    <div ref={kok} className="grid gap-4">
      {/* Denetimler */}
      <div className="flex flex-wrap items-center gap-2">
        <div
          className="flex items-center gap-1 rounded-full border border-cizgi bg-gece p-1"
          role="group"
          aria-label="Tema rengi"
        >
          {RENKLER.map((r, i) => (
            <button
              key={r.ad}
              type="button"
              aria-pressed={renk === i}
              aria-label={`Tema rengi: ${r.ad}`}
              onClick={() => setRenk(i)}
              className="flex size-9 items-center justify-center rounded-full"
            >
              <span
                className={`size-5 rounded-full transition-[box-shadow,transform] duration-300 ${renk === i ? "scale-110 ring-2 ring-krem ring-offset-2 ring-offset-gece" : ""}`}
                style={{ backgroundColor: r.deger }}
              />
            </button>
          ))}
        </div>
        <div
          className="flex items-center gap-1 rounded-full border border-cizgi bg-gece p-1"
          role="group"
          aria-label="Dil"
        >
          <Secenek secili={dil === "tr"} onClick={() => setDil("tr")}>
            TR
          </Secenek>
          <Secenek secili={dil === "en"} onClick={() => setDil("en")}>
            EN
          </Secenek>
        </div>
        <div
          className="flex items-center gap-1 rounded-full border border-cizgi bg-gece p-1"
          role="group"
          aria-label="Cihaz"
        >
          <Secenek secili={cihaz === "masaustu"} onClick={() => setCihaz("masaustu")} etiket="Masaüstü görünümü">
            <Desktop size={18} aria-hidden="true" />
          </Secenek>
          <Secenek secili={cihaz === "telefon"} onClick={() => setCihaz("telefon")} etiket="Telefon görünümü">
            <DeviceMobile size={18} aria-hidden="true" />
          </Secenek>
        </div>
      </div>

      {/* Örnek site */}
      <div className="flex justify-center rounded-[1.75rem] border border-cizgi bg-gece-3/50 p-3 sm:p-4">
        <div
          className="@container overflow-hidden rounded-2xl border border-cizgi-guclu bg-[#f6f1e9] text-[#1d1a16] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)] transition-[width] duration-700 ease-yay"
          style={{ width: cihaz === "telefon" ? "17rem" : "100%", ["--tema" as string]: RENKLER[renk]!.deger }}
        >
          <div className="flex items-center gap-2 border-b border-[#1d1a16]/10 bg-[#ece5da] px-3 py-2">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-[#1d1a16]/15" />
              <span className="size-2.5 rounded-full bg-[#1d1a16]/15" />
              <span className="size-2.5 rounded-full bg-[#1d1a16]/15" />
            </span>
            <span className="mx-auto truncate rounded-full bg-[#f6f1e9] px-3 py-0.5 font-mono text-[0.6875rem] text-[#1d1a16]/70">
              {alanAdi}
            </span>
          </div>

          <div className="p-4 @md:p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[0.6875rem] font-bold text-[#fff] transition-colors duration-500"
                  style={{ backgroundColor: "var(--tema)" }}
                >
                  {basHarfler(gorunen)}
                </span>
                <span className="truncate text-sm font-semibold">{gorunen}</span>
              </span>
              <span className="hidden gap-4 text-xs text-[#1d1a16]/70 @md:flex">
                {m.menu.map((oge) => (
                  <span key={oge} data-dil-metni>
                    {oge}
                  </span>
                ))}
              </span>
              <List size={18} className="@md:hidden" aria-hidden="true" />
            </div>

            <div className="mt-5 grid gap-4 @md:mt-7 @md:grid-cols-[1.15fr_1fr] @md:items-center">
              <div>
                <p
                  data-dil-metni
                  className="font-baslik text-[1.6rem] leading-[1.05] font-semibold tracking-tight @md:text-[2.1rem]"
                >
                  {m.baslik(gorunen)}
                </p>
                <p data-dil-metni className="mt-2.5 text-xs leading-relaxed text-[#1d1a16]/70 @md:text-[0.8125rem]">
                  {m.alt}
                </p>
                <span
                  data-dil-metni
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium text-[#fff] transition-colors duration-500"
                  style={{ backgroundColor: "var(--tema)" }}
                >
                  {m.dugme}
                  <ArrowRight size={12} aria-hidden="true" />
                </span>
              </div>
              <div
                aria-hidden="true"
                className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl transition-colors duration-500"
                style={{ backgroundColor: "var(--tema)" }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgb(255_255_255/0.28),transparent_55%),repeating-linear-gradient(90deg,rgb(255_255_255/0.08)_0_1px,transparent_1px_22px)]" />
                <span className="relative font-baslik text-5xl font-semibold text-[#fff]/90">
                  {basHarfler(gorunen)}
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {m.kartlar.map((kart) => (
                <div key={kart} className="rounded-lg bg-[#1d1a16]/[0.05] p-2.5">
                  <span
                    className="mb-2 block h-1 w-5 rounded-full transition-colors duration-500"
                    style={{ backgroundColor: "var(--tema)" }}
                  />
                  <span data-dil-metni className="block text-[0.625rem] leading-tight font-medium @md:text-xs">
                    {kart}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Google önizlemesi */}
      <div className="rounded-[1.25rem] border border-cizgi bg-gece p-4">
        <p className="flex items-center gap-2 text-xs text-soluk">
          <MagnifyingGlass size={14} aria-hidden="true" />
          Google arama sonucunda böyle görünür
        </p>
        <div className="mt-3 flex items-center gap-2.5">
          <span
            className="flex size-7 items-center justify-center rounded-full text-[0.625rem] font-bold text-[#fff] transition-colors duration-500"
            style={{ backgroundColor: RENKLER[renk]!.deger }}
          >
            {basHarfler(gorunen)}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm">{gorunen}</p>
            <p className="truncate text-xs text-soluk">https://{alanAdi}</p>
          </div>
        </div>
        <p data-dil-metni className="mt-2 truncate text-lg text-[#9fc0ff]">
          {m.googleBaslik(gorunen)}
        </p>
        <p data-dil-metni className="mt-1 line-clamp-2 text-sm text-soluk">
          {m.googleMetin(gorunen)}
        </p>
      </div>
    </div>
  );
}
