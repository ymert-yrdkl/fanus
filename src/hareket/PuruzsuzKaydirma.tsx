"use client";

import { useEffect } from "react";
import { hareketYukle } from "./gsap";
import { lenisAyarla } from "./kaydirma";

/**
 * Masaüstünde fare tekerleğini yumuşatan Lenis'i kurar ve GSAP'in saatine bağlar
 * (ScrollTrigger her karede güncel konumu bilsin). Dokunmatikte tarayıcının kendi kaydırması kalır ve Lenis hiç
 * indirilmez: paket yalnız fareli, hareket tercihi açık cihazlarda sonradan yüklenir.
 */
export default function PuruzsuzKaydirma() {
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: no-preference) and (pointer: fine)").matches) return;

    let iptal = false;
    let temizle = () => {};
    Promise.all([import("lenis"), hareketYukle()]).then(([{ default: Lenis }, { gsap, ScrollTrigger }]) => {
      if (iptal) return;
      const lenis = new Lenis({ lerp: 0.085, anchors: true, autoRaf: false });
      lenisAyarla(lenis);
      lenis.on("scroll", ScrollTrigger.update);

      const kare = (zaman: number) => lenis.raf(zaman * 1000);
      gsap.ticker.add(kare);
      gsap.ticker.lagSmoothing(0);

      temizle = () => {
        gsap.ticker.remove(kare);
        lenis.destroy();
        lenisAyarla(null);
      };
    });

    return () => {
      iptal = true;
      temizle();
    };
  }, []);

  return null;
}
