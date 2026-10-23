"use client";

import { useRef } from "react";
import {
  ChatCircleDots,
  ChatCircleText,
  Gear,
  HourglassMedium,
  MagnifyingGlass,
  MapPin,
  Printer,
  ShoppingBagOpen,
  Storefront,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { gsap, GENIS, HAREKET_ACIK, ScrollTrigger, SplitText, useGSAP } from "@/hareket/gsap";
import { sahneDurumu } from "@/sahne/durum";

type Kart = { Ikon: Icon; baslik: string; alt: string };

/**
 * Üç sahne: cümle ve cümleyi anlatan üç küçük kart. Kartlar birer örnek ekrandır (istatistik ya da iddia değil);
 * birinci sahnedekiler yayındaki müşterilerin gerçek işlerinden (src/site/icerik.ts › REFERANSLAR).
 */
const SAHNELER: { cumle: string; kartlar: Kart[] }[] = [
  {
    cumle: "Her işletmenin bir ışığı var: ustanın elindeki lezzet, atölyedeki hassasiyet, tezgâhtaki emek.",
    kartlar: [
      { Ikon: Storefront, baslik: "Taş fırın pide salonu", alt: "Azmimilli, 25 yılı aşkın" },
      { Ikon: Gear, baslik: "CNC hassas torna", alt: "336 parça ailesi, ölçü şemalı" },
      { Ikon: Printer, baslik: "Dijital baskı atölyesi", alt: "logonuzla ürün önizlemesi" },
    ],
  },
  {
    cumle: "İnternet rüzgârlı bir yer. Yavaş açılan sayfa, bulunmayan ürün, cevapsız kalan mesaj; ışık kolayca söner.",
    kartlar: [
      { Ikon: HourglassMedium, baslik: "Sayfa yükleniyor…", alt: "ziyaretçi beklemedi, gitti" },
      { Ikon: MagnifyingGlass, baslik: "Ürün bulunamadı", alt: "arama boş döndü" },
      { Ikon: ChatCircleDots, baslik: "Mesaj okundu, cevapsız", alt: "üç gün önce" },
    ],
  },
  {
    cumle: "fanus o ışığın camıdır. Korur, büyütür ve uzaktan görünür kılar.",
    kartlar: [
      { Ikon: ShoppingBagOpen, baslik: "Sipariş #1043 alındı", alt: "gece 02:14, panelde" },
      { Ikon: ChatCircleText, baslik: "Mesaj yanıtlandı", alt: "WhatsApp'tan, kendiliğinden" },
      { Ikon: MapPin, baslik: "Haritada ve aramada", alt: "uzaktan bulunur" },
    ],
  },
];

/** Masaüstünde kartların sahnedeki yerleri (cümle ortada solda, fanus sağda). */
const KART_YERLERI = [
  "left-0 top-[12%] rotate-[-3deg]",
  "left-[26%] bottom-[12%] rotate-[2deg]",
  "left-[50%] top-[20%] rotate-[3deg]",
];

/** Fanusun ekrandaki yerleri: masaüstünde sağda, telefonda başlığın altında. */
const POZLAR = {
  genis: {
    giris: { x: 0.27, y: 0.04, boy: 0.64 },
    manifesto: { x: 0.26, y: 0.05, boy: 0.76 },
  },
  dar: {
    giris: { x: 0, y: 0.31, boy: 0.38 },
    manifesto: { x: 0, y: -0.12, boy: 0.42 },
  },
};

/**
 * Giriş + manifesto boyunca tek bir kaydırma zaman çizelgesi (1 birim = 1 ekran boyu):
 * 0-1 giriş kayar, fanus yerine geçer · 1-2 ilk cümle · 2-3 cam parçaları açılır, rüzgâr çıkar, alev titrer ·
 * 3-4 cam kapanır, ışık büyür · 4.1-4.6 alev son kez parlar. Her cümleyle birlikte üç kart gelir ve gider.
 * Bölüm bitince şerit doğrudan sahnenin üstüne biner. Sahne, sayfa onu tamamen örtünce gizlenir.
 * Konum ve ışık tek çizelgede kalır ki sahne değerleri iki ayrı tetikte çakışmasın; görünürlüğü yalnız ayrı tetik yazar.
 * Telefonda (dar ekran) sabitleme ve çizelge yoktur: cümleler ve kartları alt alta, ekrana girince belirir.
 */
export default function Manifesto() {
  const kok = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ genis: GENIS, hareket: HAREKET_ACIK }, (baglam) => {
        const { genis, hareket } = baglam.conditions as { genis: boolean; hareket: boolean };
        const P = genis ? POZLAR.genis : POZLAR.dar;
        const A = sahneDurumu.akis;
        gsap.set(A, { ...P.giris, kapak: 0, isik: 1, gorunur: 1 });
        sahneDurumu.ruzgar = 0.15;
        if (!hareket) return;

        if (!genis) {
          // Telefon: sahne yalnız girişte; cümleler ve kartlar normal akışta, ekrana girince belirir
          gsap.utils.toArray<HTMLElement>("[data-cumle], [data-kart-satiri]").forEach((c) =>
            gsap.fromTo(
              c,
              { opacity: 0, y: 16 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: { trigger: c, start: "top 85%", once: true },
              },
            ),
          );
          // Giriş ekrandan çıkınca sahne çizimi durur (pil ve işlemci)
          ScrollTrigger.create({
            trigger: document.getElementById("ust"),
            start: "bottom top",
            onEnter: () => gsap.set(A, { gorunur: 0 }),
            onLeaveBack: () => gsap.set(A, { gorunur: 1 }),
          });
          return;
        }

        const cumleler = gsap.utils.toArray<HTMLElement>("[data-cumle]");
        const bolumler = cumleler.map((c) => SplitText.create(c, { type: "words" }));
        const kartGruplari = cumleler.map((_, i) => gsap.utils.toArray<HTMLElement>(`[data-kart-grubu="${i}"] > *`));
        gsap.set(cumleler, { autoAlpha: 0 });
        bolumler.forEach((b) => gsap.set(b.words, { opacity: 0.13 }));
        kartGruplari.forEach((k) => gsap.set(k, { autoAlpha: 0 }));

        const zc = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: document.getElementById("ust"),
            start: "top top",
            endTrigger: kok.current,
            end: "bottom bottom",
            scrub: 1,
          },
        });

        // Bir sahnenin kartları: cümleyle gelir, hafifçe süzülür, cümleyle gider
        const kartlarGelsin = (i: number, giris: number, cikis: number) => {
          zc.fromTo(
            kartGruplari[i]!,
            { autoAlpha: 0, y: 36 },
            { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.05, ease: "power2.out" },
            giris,
          )
            .to(kartGruplari[i]!, { y: -14, duration: cikis - giris - 0.3 }, giris + 0.2)
            .to(kartGruplari[i]!, { autoAlpha: 0, y: -44, duration: 0.15, stagger: 0.03 }, cikis);
        };

        // Giriş kayarken fanus manifestodaki yerine geçer
        zc.to(A, { ...P.manifesto, duration: 1, ease: "power1.inOut" }, 0);

        // Birinci cümle
        zc.to(cumleler[0], { autoAlpha: 1, duration: 0.12 }, 0.9)
          .to(bolumler[0].words, { opacity: 1, duration: 0.12, stagger: 0.7 / bolumler[0].words.length }, 1.0)
          .to(cumleler[0], { autoAlpha: 0, y: -40, duration: 0.18 }, 1.85);
        kartlarGelsin(0, 1.05, 1.85);

        // İkinci cümle: cam parçaları açılır, rüzgâr çıkar, korumasız alev titrer, kıvılcımlar savrulur
        zc.to(A, { kapak: 1, y: P.manifesto.y + 0.1, duration: 0.5, ease: "power2.inOut" }, 1.95)
          .to(sahneDurumu, { ruzgar: 1.15, duration: 0.4 }, 2.05)
          .fromTo(cumleler[1], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.18 }, 2.0)
          .to(bolumler[1].words, { opacity: 1, duration: 0.12, stagger: 0.75 / bolumler[1].words.length }, 2.15)
          .fromTo("[data-ruzgar-ipucu]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 2.3)
          .to("[data-ruzgar-ipucu]", { autoAlpha: 0, duration: 0.15 }, 2.95)
          .to(cumleler[1], { autoAlpha: 0, y: -40, duration: 0.18 }, 2.95);
        kartlarGelsin(1, 2.15, 2.95);
        // Rüzgârda kartlar da yalpalar
        zc.to(kartGruplari[1]!, { rotate: (i) => (i % 2 ? 6 : -5), duration: 0.6, ease: "sine.inOut" }, 2.3);

        // Üçüncü cümle: cam kapanır, rüzgâr kesilir, ışık büyür
        zc.to(A, { kapak: 0, y: P.manifesto.y, duration: 0.45, ease: "power3.in" }, 3.05)
          .to(sahneDurumu, { ruzgar: 0.1, duration: 0.3 }, 3.2)
          .to(A, { isik: 2.3, boy: P.manifesto.boy * 1.12, duration: 0.6, ease: "power2.out" }, 3.45)
          .fromTo(cumleler[2], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.18 }, 3.1)
          .to(bolumler[2].words, { opacity: 1, duration: 0.12, stagger: 0.6 / bolumler[2].words.length }, 3.25)
          .to(cumleler[2], { autoAlpha: 0, y: -40, duration: 0.2 }, 4.05);
        kartlarGelsin(2, 3.25, 4.05);

        // Kapanış: alev son kez parlar; hemen ardından şerit üstüne biner (boy değişmez, kadraj taşmasın)
        zc.to(A, { isik: 2.9, duration: 0.5, ease: "power1.inOut" }, 4.1);

        // Sayfa ekranı tamamen örtünce sahne gizlenir, geri kaydırınca yeniden görünür
        ScrollTrigger.create({
          trigger: kok.current,
          start: "bottom top",
          onEnter: () => gsap.set(A, { gorunur: 0 }),
          onLeaveBack: () => gsap.set(A, { gorunur: 1 }),
        });

        return () => bolumler.forEach((b) => b.revert());
      });
    },
    { scope: kok },
  );

  return (
    <section
      ref={kok}
      id="manifesto"
      aria-label="fanus ne demek"
      className="relative z-10 bg-gece/85 max-md:bg-gece [.hareket_&]:md:h-[460vh] [.hareket_&]:md:bg-transparent"
    >
      <div className="relative overflow-hidden [.hareket_&]:md:sticky [.hareket_&]:md:top-0 [.hareket_&]:md:h-svh">
        <div className="mx-auto grid h-full max-w-[90rem] px-4 py-20 sm:px-6 md:items-center lg:px-10 [.hareket_&]:md:py-0">
          <div className="relative flex flex-col gap-14 md:max-w-[44rem] [.hareket_&]:md:h-full lg:max-w-[50rem]">
            {SAHNELER.map((sahne, i) => (
              <div key={i} className="[.hareket_&]:md:contents">
                <p
                  data-cumle
                  className="cumle text-krem [.hareket_&]:md:absolute [.hareket_&]:md:inset-x-0 [.hareket_&]:md:top-1/2 [.hareket_&]:md:-translate-y-1/2"
                >
                  {sahne.cumle}
                </p>
                {/* Telefon: kartlar cümlenin altında sıralı */}
                <ul data-kart-satiri className="mt-5 grid gap-2 md:hidden" aria-hidden="true">
                  {sahne.kartlar.map((k) => (
                    <li key={k.baslik}>
                      <KartGovdesi kart={k} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Masaüstü: kartlar sahnede, cümlenin ve fanusun etrafında (hareket kapalıysa gizli) */}
        {SAHNELER.map((sahne, i) => (
          <div
            key={i}
            data-kart-grubu={i}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-4 inset-y-0 hidden sm:inset-x-6 lg:inset-x-10 [.hareket_&]:md:block"
          >
            {sahne.kartlar.map((k, j) => (
              <div key={k.baslik} className={`absolute ${KART_YERLERI[j]}`}>
                <KartGovdesi kart={k} />
              </div>
            ))}
          </div>
        ))}

        <p
          data-ruzgar-ipucu
          className="pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 rounded-full border border-cizgi bg-gece/60 px-4 py-2 font-mono text-xs tracking-wide text-soluk opacity-0 backdrop-blur [@media(pointer:fine)]:block"
        >
          Fareyi hızlıca gezdirin: rüzgâr sizsiniz
        </p>
      </div>
    </section>
  );
}

/** Küçük örnek ekran kartı: ikon, başlık, bir satır açıklama. */
function KartGovdesi({ kart }: { kart: Kart }) {
  return (
    <span className="flex w-[17rem] max-w-full items-center gap-3 rounded-2xl border border-cizgi-guclu bg-gece-2 px-4 py-3 golge">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-vurgu text-gece">
        <kart.Ikon size={20} weight="bold" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[0.9375rem] font-semibold">{kart.baslik}</span>
        <span className="block truncate text-sm text-soluk">{kart.alt}</span>
      </span>
    </span>
  );
}
