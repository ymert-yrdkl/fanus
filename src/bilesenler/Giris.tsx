"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { gsap, GENIS, HAREKET_ACIK, SplitText, useGSAP } from "@/hareket/gsap";
import { REFERANSLAR } from "@/site/icerik";
import { dugmeSinifi } from "./dugme";

/**
 * Giriş: afiş gibi büyük başlık solda, sağda (telefonda altta) 3B silindir fanus. Altta ince çizgiyle ayrılmış
 * "şu an yayında" satırı.
 */
export default function Giris() {
  const kok = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Telefon: başlık beklemeden görünür (CSS), düğmeler ve bağlantılar kısa bir belirmeyle gelir
      mm.add(`${HAREKET_ACIK} and (max-width: 767px)`, () => {
        gsap.fromTo(
          kok.current!.querySelectorAll("[data-giris]"),
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.06, delay: 0.1 },
        );
      });

      mm.add(`${HAREKET_ACIK} and ${GENIS}`, () => {
        const baslik = kok.current!.querySelector<HTMLElement>("h1")!;
        const parcalar = SplitText.create(baslik, { type: "lines,words", mask: "lines", linesClass: "bol-satir" });
        gsap.set(baslik, { opacity: 1 });
        gsap.set(parcalar.words, { yPercent: 120, rotate: 5, transformOrigin: "0% 100%" });

        const oge = (secici: string) => kok.current!.querySelectorAll(secici);
        // Başka sayfadan gelindiyse sayfa geçiş perdesinin kalkmasını kısa bir süre bekle
        const gecikme = window.__fanusAcildi ? 0.55 : 0;
        const oynat = () => {
          const zc = gsap.timeline({ defaults: { ease: "expo.out" }, delay: gecikme });
          zc.to(parcalar.words, { yPercent: 0, rotate: 0, duration: 1.5, stagger: 0.07 })
            .fromTo(
              oge("[data-giris]"),
              { autoAlpha: 0, y: 28 },
              { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08 },
              0.55,
            )
            .fromTo(oge("[data-giris-metin]"), { y: 36 }, { y: 0, duration: 1.3 }, 0.4)
            .fromTo(oge("[data-vurgu-cizgi]"), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.inOut" }, 0.9);
        };
        if (window.__fanusAcildi) oynat();
        else window.addEventListener("fanus:acildi", oynat, { once: true });

        // Aşağı kaydırınca giriş metni yukarı süzülür ve solar
        gsap.to("[data-giris-icerik]", {
          yPercent: -18,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: { trigger: kok.current, start: "top top", end: "bottom top", scrub: true },
        });

        return () => {
          window.removeEventListener("fanus:acildi", oynat);
          parcalar.revert();
        };
      });
    },
    { scope: kok },
  );

  return (
    <section
      ref={kok}
      id="ust"
      aria-labelledby="giris-baslik"
      className="relative z-10 flex min-h-svh flex-col px-4 pt-[calc(var(--ust-yukseklik)+1.5rem)] sm:px-6 md:min-h-dvh md:pt-[calc(var(--ust-yukseklik)+3rem)] lg:px-10"
    >
      <div data-giris-icerik className="mx-auto flex w-full max-w-[90rem] flex-1 flex-col md:justify-center">
        <p data-giris className="etiket flex items-center gap-3">
          <span className="h-px w-8 bg-cizgi-guclu" aria-hidden="true" />
          Yazılım ve teknoloji çözümleri
          <span className="max-md:hidden"> · Düzce&apos;den Türkiye&apos;nin her yerine</span>
        </p>
        <h1 id="giris-baslik" data-giris-baslik className="dev-baslik mt-6 max-w-[15ch] md:mt-8">
          Web&apos;den üretime,
          <br /> işinizi yürüten
          <br />
          <span className="relative inline-block text-vurgu">
            yazılım.
            <span
              data-vurgu-cizgi
              aria-hidden="true"
              className="absolute -bottom-1 left-0 h-[0.06em] w-full origin-left rounded-full bg-vurgu/70"
            />
          </span>
        </h1>
        <div className="mt-8 grid gap-7 md:mt-12 md:grid-cols-12 md:items-end md:gap-8">
          {/* Görünür kalır, yalnız kayar: sayfanın ana içeriği ilk boyamada sayılsın (LCP) */}
          <p data-giris-metin className="max-w-[30rem] text-lg leading-relaxed text-soluk md:col-span-5 md:text-xl">
            fanussoft; e-ticaret ve kurumsal web siteleri, QR menü ve NFC kart sistemleri, mobil uygulamalar, iş ve
            üretim otomasyonu için özel yazılım kurar.
          </p>
          <div data-giris className="flex flex-wrap items-center gap-3 md:col-span-5 md:col-start-7">
            <Link href="/iletisim" data-miknatis className={dugmeSinifi.alev}>
              Teklif al
            </Link>
            <Link href="/fiyatlar" className={dugmeSinifi.cerceve}>
              Fiyatlar
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Telefonda alev bu boşlukta yanar */}
      <div aria-hidden="true" className="h-[44svh] md:hidden" />

      <div
        data-giris
        className="mx-auto mb-6 flex w-full max-w-[90rem] flex-col gap-3 border-t border-cizgi-guclu pt-5 md:mb-8 md:flex-row md:items-center md:gap-10"
      >
        <p className="etiket flex items-center gap-2.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-canli opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-canli" />
          </span>
          Şu an yayında
        </p>
        <ul className="flex flex-wrap gap-x-7 gap-y-2">
          {REFERANSLAR.map((r) => (
            <li key={r.kod}>
              <a
                href={r.adres}
                target="_blank"
                rel="noopener"
                className="group inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] text-krem/85 transition-colors hover:text-vurgu md:min-h-0"
              >
                {r.gosterim ?? r.alanAdi}
                <ArrowUpRight
                  size={14}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </li>
          ))}
        </ul>
        <p className="etiket hidden md:ml-auto md:block">Web · E-ticaret · QR ve NFC · Mobil · Özel yazılım</p>
      </div>
    </section>
  );
}
