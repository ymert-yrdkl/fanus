"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FanusIsareti } from "@/bilesenler/Logo";
import { HIZMETLER } from "@/site/icerik";
import { gecisKaydet } from "./gecis";
import { gsap, ScrollTrigger } from "./gsap";
import { basaDon } from "./kaydirma";

const SAYFA_ADLARI: Record<string, string> = {
  "/": "Ana sayfa",
  "/hizmetler": "Hizmetler",
  "/fiyatlar": "Fiyatlar",
  "/isler": "İşler",
  "/iletisim": "İletişim",
  ...Object.fromEntries(HIZMETLER.map((h) => [`/hizmetler/${h.adres}`, h.ad])),
};

/**
 * Site içi bağlantıya tıklanınca perde aşağıdan kapanır (üstünde gidilen sayfanın adı), yeni sayfa
 * yüklenince perde yukarı kalkar. Bağlantılar normal <a>/<Link> kalır: JS yoksa ya da hareket
 * azaltma tercihi varsa sayfa doğrudan açılır. Yeni sekme, değiştirici tuş ve aynı sayfadaki çapa
 * bağlantılarına dokunulmaz.
 */
export default function GecisYoneticisi() {
  const router = useRouter();
  const yol = usePathname();
  const perde = useRef<HTMLDivElement>(null);
  const bekleyen = useRef(false);
  const [hedefAdi, setHedefAdi] = useState("");

  useEffect(() => {
    const git = (adres: string) => {
      const url = new URL(adres, window.location.href);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !perde.current) {
        router.push(url.pathname + url.search + url.hash);
        return;
      }
      if (bekleyen.current) return;
      bekleyen.current = true;
      setHedefAdi(SAYFA_ADLARI[url.pathname] ?? "fanus");
      router.prefetch(url.pathname);
      let gidildi = false;
      const sayfayaGec = () => {
        if (gidildi) return;
        gidildi = true;
        router.push(url.pathname + url.search + url.hash);
      };
      gsap
        .timeline()
        .set(perde.current, { display: "flex", clipPath: "inset(100% 0% 0% 0%)" })
        .set("[data-perde-yazi]", { yPercent: 120 })
        .to(perde.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "expo.inOut" })
        .to("[data-perde-yazi]", { yPercent: 0, duration: 0.6, ease: "expo.out" }, 0.35)
        .call(sayfayaGec);
      // Emniyet: animasyon karesi gelmezse (arka plandaki sekme) sayfa yine açılır
      window.setTimeout(sayfayaGec, 1500);
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

  // Yeni sayfa geldi: başa dön, tetikleri yeniden ölç, perdeyi kaldır
  useEffect(() => {
    if (!bekleyen.current) return;
    bekleyen.current = false;
    basaDon();
    const kapat = () => gsap.set(perde.current, { display: "none", clipPath: "inset(0% 0% 100% 0%)" });
    const kare = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      gsap
        .timeline({ onComplete: kapat })
        .to("[data-perde-yazi]", { yPercent: -120, duration: 0.5, ease: "expo.in" })
        .to(perde.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "expo.inOut" }, 0.2);
    });
    // Emniyet: animasyon karesi gelmezse perde 2 sn sonra kendiliğinden kalkar
    const emniyet = window.setTimeout(kapat, 2000);
    return () => {
      cancelAnimationFrame(kare);
      window.clearTimeout(emniyet);
    };
  }, [yol]);

  return (
    <div
      ref={perde}
      aria-hidden="true"
      className="fixed inset-0 z-[78] hidden flex-col items-center justify-center gap-6 bg-gece-2"
    >
      <FanusIsareti className="size-14 text-krem" />
      <span className="overflow-hidden">
        <span
          data-perde-yazi
          className="block font-baslik text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.15] font-semibold tracking-[-0.035em]"
        >
          {hedefAdi}
        </span>
      </span>
    </div>
  );
}
