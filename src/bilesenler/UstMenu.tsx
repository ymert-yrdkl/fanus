"use client";

import { useRef, useState } from "react";
import { List, X, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { gsap, HAREKET_ACIK, ScrollTrigger, useGSAP } from "@/hareket/gsap";
import { kaydir, kaydirmayiBaslat, kaydirmayiDurdur } from "@/hareket/kaydirma";
import { Logo } from "./Logo";
import { dugmeSinifi } from "./dugme";

const BAGLANTILAR = [
  { ad: "Hizmetler", hedef: "#hizmetler" },
  { ad: "İşler", hedef: "#isler" },
  { ad: "Süreç", hedef: "#surec" },
  { ad: "SSS", hedef: "#sss" },
];

/** Üzerine gelince yazı yukarı kayar, altından aynısı gelir. */
function KayanYazi({ children }: { children: string }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-yay group-hover:-translate-y-full">{children}</span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full text-alev transition-transform duration-500 ease-yay group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

export default function UstMenu() {
  const kok = useRef<HTMLElement>(null);
  const pencere = useRef<HTMLDialogElement>(null);
  const [acik, setAcik] = useState(false);

  useGSAP(
    () => {
      // Aşağı kaydırınca menü gizlenir, yukarı kaydırınca geri gelir; en üstte zeminsizdir
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (tetik) => {
          const y = tetik.scroll();
          kok.current?.toggleAttribute("data-dolu", y > 40);
          const gizle = tetik.direction === 1 && y > 480;
          gsap.to(kok.current, { yPercent: gizle ? -110 : 0, duration: 0.5, ease: "power3.out", overwrite: true });
        },
      });
    },
    { scope: kok },
  );

  const menuyuAc = () => {
    const dialog = pencere.current!;
    dialog.showModal();
    setAcik(true);
    kaydirmayiDurdur();
    const mm = gsap.matchMedia();
    mm.add(HAREKET_ACIK, () => {
      gsap.fromTo(
        dialog,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.inOut" },
      );
      gsap.fromTo(
        dialog.querySelectorAll("[data-menu-oge]"),
        { yPercent: 120 },
        { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06, delay: 0.3 },
      );
    });
  };

  const menuyuKapat = (sonra?: () => void) => {
    const dialog = pencere.current!;
    const bitir = () => {
      dialog.close();
      setAcik(false);
      kaydirmayiBaslat();
      sonra?.();
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return bitir();
    gsap.to(dialog, { clipPath: "inset(100% 0 0% 0)", duration: 0.6, ease: "expo.inOut", onComplete: bitir });
  };

  return (
    <>
      <header
        ref={kok}
        className="group/ust fixed inset-x-0 top-0 z-50 h-(--ust-yukseklik) border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-500 data-dolu:border-cizgi data-dolu:bg-gece/70 data-dolu:backdrop-blur-xl"
      >
        <nav
          aria-label="Ana menü"
          className="mx-auto flex h-full max-w-[90rem] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10"
        >
          <a href="#ust" aria-label="fanus.tr ana sayfa" className="-m-2 rounded-full p-2">
            <Logo />
          </a>

          <ul className="hidden items-center gap-9 text-[0.9375rem] text-soluk md:flex">
            {BAGLANTILAR.map((b) => (
              <li key={b.hedef}>
                <a href={b.hedef} className="group block py-2 hover:text-krem">
                  <KayanYazi>{b.ad}</KayanYazi>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a href="#teklif" data-miknatis className={`${dugmeSinifi.alev} hidden min-h-10 px-5 sm:inline-flex`}>
              Teklif al
            </a>
            <button
              type="button"
              onClick={menuyuAc}
              aria-haspopup="dialog"
              aria-expanded={acik}
              className="inline-flex size-11 items-center justify-center rounded-full border border-cizgi-guclu md:hidden"
            >
              <List size={20} weight="regular" aria-hidden="true" />
              <span className="sr-only">Menüyü aç</span>
            </button>
          </div>
        </nav>
      </header>

      <dialog
        ref={pencere}
        aria-label="Menü"
        onCancel={(olay) => {
          olay.preventDefault();
          menuyuKapat();
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-gece p-0 text-krem backdrop:bg-transparent"
      >
        <div className="flex h-full flex-col px-4 pb-8 sm:px-6">
          <div className="flex h-(--ust-yukseklik) items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={() => menuyuKapat()}
              className="inline-flex size-11 items-center justify-center rounded-full border border-cizgi-guclu"
            >
              <X size={20} aria-hidden="true" />
              <span className="sr-only">Menüyü kapat</span>
            </button>
          </div>
          <ul className="mt-10 flex flex-col gap-2">
            {[...BAGLANTILAR, { ad: "Teklif al", hedef: "#teklif" }].map((b) => (
              <li key={b.hedef} className="overflow-hidden">
                <a
                  data-menu-oge
                  href={b.hedef}
                  onClick={(olay) => {
                    olay.preventDefault();
                    menuyuKapat(() => kaydir(b.hedef));
                  }}
                  className="flex items-center justify-between py-2 font-baslik text-[2.75rem] leading-tight font-semibold tracking-[-0.03em]"
                >
                  {b.ad}
                  <ArrowUpRight size={28} className="text-alev" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-auto text-soluk">E-ticaret, kurumsal site, QR menü ve web otomasyonu.</p>
        </div>
      </dialog>
    </>
  );
}
