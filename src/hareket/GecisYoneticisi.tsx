"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gecisKaydet } from "./gecis";
import { gsap, ScrollTrigger } from "./gsap";
import { basaDon } from "./kaydirma";

/** Koyu (3B sahneyle) başlayan sayfalar; diğerleri gündüz zemininde başlar. Örtü gidilen sayfanın rengini alır. */
const KOYU_BASLAYAN = new Set(["/", "/iletisim"]);

/**
 * Site içi bağlantıya tıklanınca "buzlu cam" geçişi: sayfa bir an bulanıklaşıp gidilen sayfanın zemin rengine
 * karışır, üstte ince bir çizgi akar; yeni sayfa gelince örtü çözülür ve içerik hafifçe yukarı kayarak gelir.
 * Bağlantılar normal <a>/<Link> kalır: JS yoksa ya da hareket azaltma tercihi varsa sayfa doğrudan açılır.
 * Yeni sekme, değiştirici tuş ve aynı sayfadaki çapa bağlantılarına dokunulmaz.
 */
export default function GecisYoneticisi() {
  const router = useRouter();
  const yol = usePathname();
  const ortu = useRef<HTMLDivElement>(null);
  const cizgi = useRef<HTMLDivElement>(null);
  const bekleyen = useRef(false);

  useEffect(() => {
    const git = (adres: string) => {
      const url = new URL(adres, window.location.href);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !ortu.current) {
        router.push(url.pathname + url.search + url.hash);
        return;
      }
      if (bekleyen.current) return;
      bekleyen.current = true;
      router.prefetch(url.pathname);
      ortu.current.dataset.ton = KOYU_BASLAYAN.has(url.pathname) ? "gece" : "gunduz";
      let gidildi = false;
      const sayfayaGec = () => {
        if (gidildi) return;
        gidildi = true;
        router.push(url.pathname + url.search + url.hash);
      };
      gsap
        .timeline()
        .set(ortu.current, { display: "block", opacity: 0, backdropFilter: "blur(0px)" })
        .set(cizgi.current, { display: "block", scaleX: 0, opacity: 1 })
        .to(ortu.current, { opacity: 1, backdropFilter: "blur(18px)", duration: 0.32, ease: "power2.in" })
        .to(cizgi.current, { scaleX: 0.7, duration: 0.6, ease: "power2.out" }, 0)
        .call(sayfayaGec, [], 0.32);
      // Emniyet: animasyon karesi gelmezse (arka plandaki sekme) sayfa yine açılır
      window.setTimeout(sayfayaGec, 900);
    };
    gecisKaydet(git);

    const tikla = (olay: MouseEvent) => {
      if (olay.button !== 0 || olay.metaKey || olay.ctrlKey || olay.shiftKey || olay.altKey) return;
      const a = (olay.target as Element | null)?.closest?.("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      // Menü penceresindeki bağlantılar geçişi kendisi başlatır (pencere üst katmandadır)
      if (a.closest("dialog")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      olay.preventDefault();
      olay.stopPropagation();
      git(url.href);
    };
    // Yakalama aşamasında: Next <Link> kendi yönlendirmesini başlatmadan önce
    document.addEventListener("click", tikla, true);
    return () => {
      document.removeEventListener("click", tikla, true);
      gecisKaydet(null);
    };
  }, [router]);

  // Yeni sayfa geldi: başa dön, tetikleri yeniden ölç, örtüyü çöz, içeriği hafifçe yukarı kaydırarak getir
  useEffect(() => {
    if (!bekleyen.current) return;
    bekleyen.current = false;
    basaDon();
    const kapat = () => {
      gsap.set([ortu.current, cizgi.current], { display: "none" });
      gsap.set("#icerik", { clearProps: "transform" });
    };
    const kare = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      gsap
        .timeline({ onComplete: kapat })
        .to(cizgi.current, { scaleX: 1, duration: 0.25, ease: "power2.out" })
        .to(cizgi.current, { opacity: 0, duration: 0.3 }, 0.2)
        .to(ortu.current, { opacity: 0, backdropFilter: "blur(0px)", duration: 0.55, ease: "power2.out" }, 0.05)
        .fromTo("#icerik", { y: 18 }, { y: 0, duration: 0.7, ease: "expo.out" }, 0.05);
    });
    // Emniyet: animasyon karesi gelmezse örtü kendiliğinden kalkar
    const emniyet = window.setTimeout(kapat, 2000);
    return () => {
      cancelAnimationFrame(kare);
      window.clearTimeout(emniyet);
    };
  }, [yol]);

  return (
    <>
      <div ref={ortu} aria-hidden="true" className="gecis-ortusu pointer-events-none fixed inset-0 z-[78] hidden" />
      <div ref={cizgi} aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[79] hidden h-0.5 origin-left bg-alev" />
    </>
  );
}
