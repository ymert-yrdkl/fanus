"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { gsap, HAREKET_ACIK, useGSAP } from "@/hareket/gsap";
import { kaydir } from "@/hareket/kaydirma";
import { SITE } from "@/site/ayarlar";
import { HIZMETLER, REFERANSLAR } from "@/site/icerik";
import { Logo } from "./Logo";

const SAYFA_BAGLANTILARI = [
  { ad: "Ana sayfa", adres: "/" },
  { ad: "Hizmetler", adres: "/hizmetler" },
  { ad: "İşler", adres: "/isler" },
  { ad: "Fiyatlar", adres: "/fiyatlar" },
  { ad: "İletişim", adres: "/iletisim" },
];

export default function Alt() {
  const kok = useRef<HTMLElement>(null);

  // Dev kelime markası: harfler çizgiden dolguya, soldan sağa ışıyarak dolar
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(HAREKET_ACIK, () => {
        gsap.fromTo(
          "[data-harf-dolu]",
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: "[data-kelime-markasi]", start: "top 95%", end: "bottom bottom", scrub: 1 },
          },
        );
      });
    },
    { scope: kok },
  );

  return (
    <footer
      ref={kok}
      data-zemin="acik"
      className="relative z-10 overflow-hidden border-t border-cizgi bg-gece px-4 pt-20 pb-8 sm:px-6 lg:px-10"
    >
      <div className="mx-auto grid max-w-[90rem] gap-12 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Logo />
          <p className="mt-5 max-w-[22rem] leading-relaxed text-soluk">
            Web siteleri, e-ticaret, QR ve NFC sistemleri, mobil uygulama, özel yazılım ve otomasyon. Işığınızı koruyan
            cam.
          </p>
        </div>
        <nav aria-label="Sayfa" className="lg:col-span-2">
          <p className="etiket">Sayfa</p>
          <ul className="mt-4 grid gap-1">
            {SAYFA_BAGLANTILARI.map((b) => (
              <li key={b.adres}>
                <Link
                  href={b.adres}
                  className="inline-flex min-h-10 items-center text-krem/85 transition-colors hover:text-vurgu"
                >
                  {b.ad}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Hizmetler" className="lg:col-span-3">
          <p className="etiket">Hizmetler</p>
          <ul className="mt-4 grid gap-1">
            {HIZMETLER.map((h) => (
              <li key={h.adres}>
                <Link
                  href={`/hizmetler/${h.adres}`}
                  className="inline-flex min-h-10 items-center text-krem/85 transition-colors hover:text-vurgu"
                >
                  {h.ad}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="lg:col-span-2">
          <p className="etiket">İşler</p>
          <ul className="mt-4 grid gap-1">
            {REFERANSLAR.map((r) => (
              <li key={r.kod}>
                <a
                  href={r.adres}
                  target="_blank"
                  rel="noopener"
                  className="group inline-flex min-h-10 items-center gap-1.5 text-krem/85 transition-colors hover:text-vurgu"
                >
                  {r.gosterim ?? r.alanAdi}
                  <ArrowUpRight
                    size={14}
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <p className="etiket">İletişim</p>
          <ul className="mt-4 grid gap-1">
            <li>
              <a
                href={`mailto:${SITE.eposta}`}
                className="inline-flex min-h-10 items-center text-krem/85 transition-colors hover:text-vurgu"
              >
                {SITE.eposta}
              </a>
            </li>
            {SITE.telefon && (
              <li>
                <a
                  href={`tel:${SITE.telefon.replace(/\s/g, "")}`}
                  className="inline-flex min-h-10 items-center text-krem/85 transition-colors hover:text-vurgu"
                >
                  {SITE.telefon}
                </a>
              </li>
            )}
            {SITE.instagram && (
              <li>
                <a
                  href={`https://www.instagram.com/${SITE.instagram}/`}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex min-h-10 items-center text-krem/85 transition-colors hover:text-vurgu"
                >
                  Instagram: @{SITE.instagram}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* "soft" soluk: logodaki yazımla aynı */}
      <div
        data-kelime-markasi
        aria-hidden="true"
        className="mx-auto mt-20 flex max-w-[90rem] justify-center font-baslik text-[clamp(3.5rem,16.5vw,15.5rem)] leading-[0.82] font-semibold tracking-[-0.06em] select-none"
      >
        {"fanussoft".split("").map((harf, i) => (
          <span key={i} className="relative inline-block">
            <span className="cizgi-yazi">{harf}</span>
            <span data-harf-dolu className={`absolute inset-0 ${i < 5 ? "text-krem" : "text-soluk"}`}>
              {harf}
            </span>
          </span>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-[90rem] flex-col gap-4 border-t border-cizgi pt-6 text-sm text-soluk sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 fanussoft</p>
        <p>Bu site çerez kullanmaz, ziyaretinizi izlemez.</p>
        <button
          type="button"
          onClick={() => kaydir(document.body)}
          className="inline-flex min-h-11 items-center gap-2 self-start transition-colors hover:text-krem sm:self-auto"
        >
          Başa dön
          <ArrowUp size={14} aria-hidden="true" />
        </button>
      </div>
    </footer>
  );
}
