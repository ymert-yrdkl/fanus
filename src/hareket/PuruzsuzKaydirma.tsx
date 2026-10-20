"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { lenisAyarla } from "./kaydirma";

/**
 * Masaüstünde fare tekerleğini yumuşatan Lenis'i kurar ve GSAP'in saatine bağlar
 * (ScrollTrigger her karede güncel konumu bilsin). Dokunmatikte tarayıcının kendi kaydırması kalır.
 */
export default function PuruzsuzKaydirma() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.085, anchors: true, autoRaf: false });
    lenisAyarla(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const kare = (zaman: number) => lenis.raf(zaman * 1000);
    gsap.ticker.add(kare);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(kare);
      lenis.destroy();
      lenisAyarla(null);
    };
  }, []);

  return null;
}
