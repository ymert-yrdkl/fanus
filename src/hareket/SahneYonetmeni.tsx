"use client";

import { FARE, gsap, HAREKET_ACIK, ScrollTrigger, SplitText, useGSAP } from "./gsap";

const sayiBicimi = new Intl.NumberFormat("tr-TR");

/**
 * Sayfa genelindeki kaydırma efektleri, öznitelikle çalışır (bölümler sunucu bileşeni kalabilir):
 * - data-belir            görünüme girince aşağıdan belirir (data-gecikme="0.1" isteğe bağlı)
 * - data-bol              başlık satır satır maskeden yükselir
 * - data-sayac="3305"     sayı sıfırdan sayar
 * - data-paralaks="-0.2"  kaydırırken kendi hızında kayar
 * - data-miknatis         fare yaklaşınca düğme imlece doğru çekilir
 * - data-isik             kartın üstünde imleci izleyen ışık (.isik-katmani ile)
 * Sayfanın EN SONUNDA durur ki bütün bölümler DOM'da olsun.
 */
export default function SahneYonetmeni() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(HAREKET_ACIK, () => {
      gsap.utils.toArray<HTMLElement>("[data-belir]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out",
            delay: Number(el.dataset.gecikme ?? 0),
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-bol]").forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "bol-satir",
          autoSplit: true,
          onSplit(parca) {
            gsap.set(el, { opacity: 1 });
            return gsap.from(parca.lines, {
              yPercent: 118,
              rotate: 2.5,
              transformOrigin: "0% 100%",
              duration: 1.25,
              ease: "expo.out",
              stagger: 0.1,
              scrollTrigger: { trigger: el, start: "top 86%", once: true },
            });
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-sayac]").forEach((el) => {
        const hedef = Number(el.dataset.sayac);
        const sayac = { deger: 0 };
        gsap.to(sayac, {
          deger: hedef,
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = sayiBicimi.format(Math.round(sayac.deger));
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-paralaks]").forEach((el) => {
        const hiz = Number(el.dataset.paralaks);
        gsap.fromTo(
          el,
          { yPercent: -hiz * 50 },
          {
            yPercent: hiz * 50,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      gsap.fromTo(
        "#ilerleme",
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.4 } },
      );
    });

    mm.add(FARE, () => {
      const temizlikler: (() => void)[] = [];

      gsap.utils.toArray<HTMLElement>("[data-miknatis]").forEach((el) => {
        const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
        const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
        const hareket = (olay: PointerEvent) => {
          const kutu = el.getBoundingClientRect();
          x((olay.clientX - (kutu.left + kutu.width / 2)) * 0.3);
          y((olay.clientY - (kutu.top + kutu.height / 2)) * 0.4);
        };
        const birak = () => {
          x(0);
          y(0);
        };
        el.addEventListener("pointermove", hareket);
        el.addEventListener("pointerleave", birak);
        temizlikler.push(() => {
          el.removeEventListener("pointermove", hareket);
          el.removeEventListener("pointerleave", birak);
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-isik]").forEach((el) => {
        const hareket = (olay: PointerEvent) => {
          const kutu = el.getBoundingClientRect();
          el.style.setProperty("--mx", `${olay.clientX - kutu.left}px`);
          el.style.setProperty("--my", `${olay.clientY - kutu.top}px`);
        };
        el.addEventListener("pointermove", hareket);
        temizlikler.push(() => el.removeEventListener("pointermove", hareket));
      });

      return () => temizlikler.forEach((temizle) => temizle());
    });

    // Yazı tipleri ve görseller yerleşince tetik noktalarını yeniden ölç
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    window.__fanusHazir = true;
  });

  return (
    <div
      id="ilerleme"
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[65] h-px origin-left bg-alev"
    />
  );
}
