"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/hareket/gsap";

export const tlBicimi = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

/**
 * Değer değişince eski sayıdan yenisine akarak sayan metin. Her karede React yeniden çizilmez:
 * GSAP doğrudan yazıyı günceller. `kurus` tam sayı (para kuruş olarak tutulur).
 */
export function AkanTutar({ kurus, className }: { kurus: number; className?: string }) {
  const el = useRef<HTMLSpanElement>(null);
  const deger = useRef({ v: kurus });

  useEffect(() => {
    const azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const yaz = () => {
      if (el.current) el.current.textContent = tlBicimi.format(Math.round(deger.current.v) / 100);
    };
    if (azHareket) {
      deger.current.v = kurus;
      yaz();
      return;
    }
    const tw = gsap.to(deger.current, { v: kurus, duration: 0.9, ease: "power3.out", onUpdate: yaz });
    return () => {
      tw.kill();
    };
  }, [kurus]);

  return (
    <span ref={el} className={`tabular-nums ${className ?? ""}`}>
      {tlBicimi.format(kurus / 100)}
    </span>
  );
}
