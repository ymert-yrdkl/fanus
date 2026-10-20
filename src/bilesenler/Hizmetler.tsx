"use client";

import { useRef } from "react";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { gsap, GENIS, HAREKET_ACIK, ScrollTrigger, useGSAP } from "@/hareket/gsap";
import { HIZMETLER, type HizmetKodu } from "@/site/icerik";
import { AD_SINIRI, useIsletmeAdi } from "./IsletmeAdi";
import EticaretDemo from "./demolar/EticaretDemo";
import KurumsalDemo from "./demolar/KurumsalDemo";
import OtomasyonDemo from "./demolar/OtomasyonDemo";
import QrMenuDemo from "./demolar/QrMenuDemo";

export default function Hizmetler({ qrSvg }: { qrSvg: string }) {
  const kok = useRef<HTMLElement>(null);
  const { ad, setAd } = useIsletmeAdi();

  const demolar: Record<HizmetKodu, React.ReactNode> = {
    eticaret: <EticaretDemo />,
    kurumsal: <KurumsalDemo />,
    otomasyon: <OtomasyonDemo />,
    qrmenu: <QrMenuDemo qrSvg={qrSvg} />,
  };

  // Kartlar üst üste biner: alttaki kart gelince öndeki küçülür ve kararır
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Ekrandan uzun kart yapışınca alt kısmı görünmez kalmasın: üst boşluğu karta göre küçült
      mm.add(GENIS, () => {
        const kartlar = gsap.utils.toArray<HTMLElement>("[data-hizmet-karti]");
        const ustAyarla = () =>
          kartlar.forEach((k) => {
            k.style.top = `${Math.min(88, window.innerHeight - k.offsetHeight - 16)}px`;
          });
        ustAyarla();
        ScrollTrigger.addEventListener("refreshInit", ustAyarla);
        return () => {
          ScrollTrigger.removeEventListener("refreshInit", ustAyarla);
          kartlar.forEach((k) => (k.style.top = ""));
        };
      });
      mm.add(`${HAREKET_ACIK} and ${GENIS}`, () => {
        const kartlar = gsap.utils.toArray<HTMLElement>("[data-hizmet-karti]");
        kartlar.forEach((kart, i) => {
          const sonraki = kartlar[i + 1];
          if (!sonraki) return;
          const zc = gsap.timeline({
            scrollTrigger: { trigger: sonraki, start: "top bottom", end: "top 12%", scrub: true },
          });
          zc.to(kart, { scale: 0.9, ease: "none" }, 0).to(
            kart.querySelector("[data-kart-perde]"),
            { opacity: 0.6, ease: "none" },
            0,
          );
        });
      });
    },
    { scope: kok },
  );

  return (
    <section
      ref={kok}
      id="hizmetler"
      aria-labelledby="hizmetler-baslik"
      className="relative z-10 bg-gece px-4 pt-28 pb-24 sm:px-6 md:pt-40 lg:px-10"
    >
      <div className="mx-auto grid max-w-[90rem] gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <h2 id="hizmetler-baslik" data-bol className="bolum-baslik max-w-[14ch]">
            Adınızı yazın, sitenizi şimdi görün.
          </h2>
          <p data-belir className="mt-6 max-w-[34rem] text-lg leading-relaxed text-soluk">
            Aşağıdaki dört örnek gerçek bileşenlerdir ve yazdığınız adla canlı çalışır. Tıklayın, deneyin.
          </p>
        </div>
        <div data-belir data-gecikme="0.15" className="md:col-span-5">
          <label htmlFor="isletme-adi" className="text-[0.9375rem] font-medium text-krem">
            İşletmenizin adı
          </label>
          <input
            id="isletme-adi"
            type="text"
            value={ad}
            maxLength={AD_SINIRI}
            autoComplete="organization"
            placeholder="Örneğin Yıldız Fırın"
            onChange={(olay) => setAd(olay.target.value)}
            className="mt-2.5 h-15 w-full rounded-2xl border border-cizgi-guclu bg-gece-2 px-5 text-lg text-krem transition-colors duration-300 placeholder:text-silik hover:border-krem/40 focus:border-alev focus:outline-none"
          />
          <p className="mt-2.5 text-sm text-soluk">
            Yazdığınız ad yalnız bu sayfada kullanılır, hiçbir yere gönderilmez.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-[90rem] flex-col gap-6 md:mt-24 md:gap-10">
        {HIZMETLER.map((h) => (
          <article
            key={h.kod}
            data-hizmet-karti
            aria-labelledby={`hizmet-${h.kod}`}
            className="relative origin-top overflow-hidden rounded-[2rem] border border-cizgi bg-gece-2 md:sticky md:top-[5.5rem] md:min-h-[calc(100dvh-7rem)]"
          >
            <div className="grid gap-10 p-5 sm:p-8 md:h-full md:grid-cols-12 md:items-center md:gap-8 lg:p-12">
              <div className="md:col-span-5 lg:pr-6">
                <p className="etiket">{h.ad}</p>
                <h3 id={`hizmet-${h.kod}`} className="ara-baslik mt-4 max-w-[18ch]">
                  {h.baslik}
                </h3>
                <p className="mt-5 max-w-[30rem] leading-relaxed text-soluk">{h.metin}</p>
                <ul className="mt-8 grid gap-3">
                  {h.maddeler.map((madde) => (
                    <li key={madde} className="flex items-start gap-3 text-[0.9375rem]">
                      <Check size={18} weight="bold" className="mt-0.5 shrink-0 text-alev" aria-hidden="true" />
                      {madde}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="min-w-0 md:col-span-7">{demolar[h.kod]}</div>
            </div>
            <div
              data-kart-perde
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gece opacity-0"
            />
          </article>
        ))}
      </div>
    </section>
  );
}
