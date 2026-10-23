"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X, ArrowUpRight, CaretDown } from "@phosphor-icons/react/dist/ssr";
import { gecisleGit } from "@/hareket/gecis";
import { gsap, HAREKET_ACIK, ScrollTrigger, useGSAP } from "@/hareket/gsap";
import { kaydirmayiBaslat, kaydirmayiDurdur } from "@/hareket/kaydirma";
import { HIZMETLER, hizmetFiyatEtiketi } from "@/site/icerik";
import { Logo } from "./Logo";
import { dugmeSinifi } from "./dugme";

const BAGLANTILAR = [
  { ad: "Hizmetler", adres: "/hizmetler" },
  { ad: "İşler", adres: "/isler" },
  { ad: "Fiyatlar", adres: "/fiyatlar" },
  { ad: "İletişim", adres: "/iletisim" },
];

/** Üzerine gelince yazı yukarı kayar, altından aynısı gelir. */
function KayanYazi({ children }: { children: string }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-yay group-hover:-translate-y-full">{children}</span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full text-vurgu transition-transform duration-500 ease-yay group-hover:translate-y-0"
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
  // Hizmetler açılır paneli bir bağlantıya tıklanınca kapanır ve fare menüden çıkana kadar kapalı kalır
  const [acilirKapali, setAcilirKapali] = useState(false);
  const yol = usePathname();

  // Sayfa değişince menüdeki odak bırakılır: odakta kalan bağlantı açılır paneli açık tutmasın
  useEffect(() => {
    const odak = document.activeElement;
    if (odak instanceof HTMLElement && kok.current?.contains(odak)) odak.blur();
  }, [yol]);
  const etkin = (adres: string) => yol === adres || yol.startsWith(`${adres}/`);

  useGSAP(
    () => {
      // Aşağı kaydırınca menü gizlenir, yukarı kaydırınca geri gelir; en üstte zeminsizdir
      let gizli = false;
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (tetik) => {
          const y = tetik.scroll();
          kok.current?.toggleAttribute("data-dolu", y > 40);
          const gizle = tetik.direction === 1 && y > 480;
          if (gizle === gizli) return;
          gizli = gizle;
          gsap.to(kok.current, { yPercent: gizle ? -110 : 0, duration: 0.5, ease: "power3.out", overwrite: true });
        },
      });
    },
    { scope: kok },
  );

  // Gündüz (beyaz) bölümün üstündeyken menü de açık renklere döner; her sayfa değişiminde yeniden kurulur
  useGSAP(
    () => {
      const ust = kok.current!;
      // Sayfa içeriğindeki (#icerik) açık zeminli bölümlerden en az biri menünün altındaysa menü açık renkte;
      // menü penceresi ve açılış perdesi gibi içerik dışı açık zeminler sayılmaz (kapalıyken tetikleyiciyi söndürürdü)
      const aktifler = new Set<HTMLElement>();
      const uygula = () => ust.toggleAttribute("data-acik-ust", aktifler.size > 0);
      gsap.utils.toArray<HTMLElement>('#icerik[data-zemin="acik"], #icerik [data-zemin="acik"]').forEach((bolum) => {
        ScrollTrigger.create({
          trigger: bolum,
          // Menünün alt kenarı açık içeriğe değince açık renge geç
          start: "top top+=60",
          end: "bottom top+=60",
          onToggle: (t) => {
            if (t.isActive) aktifler.add(bolum);
            else aktifler.delete(bolum);
            uygula();
          },
        });
      });
      uygula();
    },
    { dependencies: [yol], revertOnUpdate: true },
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
        { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.05, delay: 0.3 },
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

  /** Menü penceresinden bir sayfaya: önce pencere kapanır, sonra sayfa geçişi başlar. */
  const penceredenGit = (olay: React.MouseEvent<HTMLAnchorElement>, adres: string) => {
    olay.preventDefault();
    menuyuKapat(() => {
      if (adres !== window.location.pathname) gecisleGit(adres);
    });
  };

  return (
    <>
      <header
        ref={kok}
        // Bütün sayfalar kâğıt üstünde başlar: JS gelmeden de açık renklerde (ScrollTrigger sonra yönetir)
        data-acik-ust=""
        className="group/ust fixed inset-x-0 top-0 z-50 h-(--ust-yukseklik) border-b border-transparent text-krem transition-[background-color,border-color,backdrop-filter,color] duration-500 data-dolu:border-cizgi data-dolu:bg-gece/75 data-dolu:backdrop-blur-xl"
      >
        <nav
          aria-label="Ana menü"
          className="mx-auto flex h-full max-w-[90rem] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10"
        >
          <Link href="/" aria-label="fanussoft ana sayfa" className="-m-2 rounded-full p-2">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-9 text-[0.9375rem] text-soluk md:flex">
            {BAGLANTILAR.map((b) =>
              b.adres === "/hizmetler" ? (
                <li
                  key={b.adres}
                  className="group/acilir relative"
                  onPointerDown={(olay) => {
                    if ((olay.target as Element).closest("a")) setAcilirKapali(true);
                  }}
                  onPointerLeave={() => setAcilirKapali(false)}
                >
                  <Link
                    href={b.adres}
                    aria-current={etkin(b.adres) ? "page" : undefined}
                    className="group flex items-center gap-1 py-2 hover:text-krem aria-[current=page]:text-krem"
                  >
                    <KayanYazi>{b.ad}</KayanYazi>
                    <CaretDown
                      size={12}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover/acilir:rotate-180"
                    />
                  </Link>
                  {/* Açılır panel: üzerine gelince ya da klavyeyle odaklanınca */}
                  <div
                    className={`invisible absolute top-full left-1/2 w-[34rem] -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-[opacity,translate,visibility] duration-300 ease-yay ${
                      acilirKapali
                        ? ""
                        : "group-focus-within/acilir:visible group-focus-within/acilir:translate-y-0 group-focus-within/acilir:opacity-100 group-hover/acilir:visible group-hover/acilir:translate-y-0 group-hover/acilir:opacity-100"
                    }`}
                  >
                    <ul className="grid grid-cols-2 gap-1 rounded-3xl border border-cizgi bg-gece-2/95 p-2 golge backdrop-blur-xl">
                      {HIZMETLER.map((h) => (
                        <li key={h.adres}>
                          <Link
                            href={`/hizmetler/${h.adres}`}
                            className="group/hizmet block rounded-2xl p-4 transition-colors duration-300 hover:bg-gece-3"
                          >
                            <span className="flex items-center justify-between gap-2 font-medium text-krem">
                              {h.ad}
                              <ArrowUpRight
                                size={14}
                                aria-hidden="true"
                                className="text-soluk transition-[transform,color] duration-300 group-hover/hizmet:translate-x-0.5 group-hover/hizmet:-translate-y-0.5 group-hover/hizmet:text-vurgu"
                              />
                            </span>
                            <span className="mt-1 block text-sm text-vurgu">{hizmetFiyatEtiketi(h.adres)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={b.adres}>
                  <Link
                    href={b.adres}
                    aria-current={etkin(b.adres) ? "page" : undefined}
                    className="group block py-2 hover:text-krem aria-[current=page]:text-krem"
                  >
                    <KayanYazi>{b.ad}</KayanYazi>
                  </Link>
                </li>
              ),
            )}
          </ul>

          <div className="flex items-center gap-2">
            <Link href="/iletisim" data-miknatis className={`${dugmeSinifi.alev} min-h-10 px-5 max-[359px]:hidden`}>
              Teklif al
            </Link>
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
        data-zemin="acik"
        aria-label="Menü"
        onCancel={(olay) => {
          olay.preventDefault();
          menuyuKapat();
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-gece p-0 text-krem backdrop:bg-transparent"
      >
        <div className="flex h-full flex-col overflow-y-auto px-4 pb-8 sm:px-6">
          <div className="flex h-(--ust-yukseklik) shrink-0 items-center justify-between">
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
          <ul className="mt-8 flex flex-col">
            {[{ ad: "Ana sayfa", adres: "/" }, ...BAGLANTILAR].map((b) => (
              <li key={b.adres} className="overflow-hidden">
                <a
                  data-menu-oge
                  href={b.adres}
                  aria-current={yol === b.adres ? "page" : undefined}
                  onClick={(olay) => penceredenGit(olay, b.adres)}
                  className="flex items-center justify-between py-2 font-baslik text-[2.5rem] leading-tight font-semibold tracking-[-0.03em] aria-[current=page]:text-vurgu"
                >
                  {b.ad}
                  <ArrowUpRight size={26} className="text-vurgu" aria-hidden="true" />
                </a>
                {b.adres === "/hizmetler" && (
                  <ul className="mb-3 grid grid-cols-2 gap-x-4 gap-y-1 pl-1">
                    {HIZMETLER.map((h) => (
                      <li key={h.adres} className="overflow-hidden">
                        <a
                          data-menu-oge
                          href={`/hizmetler/${h.adres}`}
                          onClick={(olay) => penceredenGit(olay, `/hizmetler/${h.adres}`)}
                          className="flex min-h-11 items-center text-soluk"
                        >
                          {h.ad}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <Link
            href="/iletisim"
            onClick={(olay) => penceredenGit(olay, "/iletisim")}
            className={`${dugmeSinifi.alev} mt-auto w-full`}
          >
            Teklif al
          </Link>
        </div>
      </dialog>
    </>
  );
}
