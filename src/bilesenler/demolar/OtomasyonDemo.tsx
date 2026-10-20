"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ShoppingBagOpen,
  Package,
  Receipt,
  Truck,
  ChatCircleText,
  Check,
  Lightning,
} from "@phosphor-icons/react/dist/ssr";
import { gsap, HAREKET_ACIK, ScrollTrigger, useGSAP } from "@/hareket/gsap";
import { useIsletmeAdi } from "../IsletmeAdi";

const ADIMLAR = [
  { ad: "Yeni sipariş", Ikon: ShoppingBagOpen },
  { ad: "Stok düşüldü", Ikon: Package },
  { ad: "Fatura kesildi", Ikon: Receipt },
  { ad: "Kargo etiketi", Ikon: Truck },
  { ad: "Müşteriye mesaj", Ikon: ChatCircleText },
];

// Telefonda tek sütun; geniş ekranda kıvrılan yol: → → ↓ ← (mesaj balonu en solda)
const YERLESIM = [
  "sm:col-start-1 sm:row-start-1",
  "sm:col-start-2 sm:row-start-1",
  "sm:col-start-3 sm:row-start-1",
  "sm:col-start-3 sm:row-start-2",
  "sm:col-start-2 sm:row-start-2",
];

type Kayit = { saat: string; metin: string };

function saatYaz() {
  return new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/** İki düğüm kutusu arasında yumuşak bağlantı yolu (aynı satırdaysa yatay, değilse dikey). */
function yolCiz(a: DOMRect, b: DOMRect, kok: DOMRect) {
  const ax = a.left - kok.left;
  const ay = a.top - kok.top;
  const bx = b.left - kok.left;
  const by = b.top - kok.top;
  if (Math.abs(ay - by) < 8) {
    const sagaDogru = bx > ax;
    const x1 = sagaDogru ? ax + a.width : ax;
    const x2 = sagaDogru ? bx : bx + b.width;
    const y1 = ay + a.height / 2;
    const y2 = by + b.height / 2;
    const orta = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${orta} ${y1}, ${orta} ${y2}, ${x2} ${y2}`;
  }
  const x1 = ax + a.width / 2;
  const x2 = bx + b.width / 2;
  const y1 = ay + a.height;
  const y2 = by;
  const orta = (y1 + y2) / 2;
  return `M ${x1} ${y1} C ${x1} ${orta}, ${x2} ${orta}, ${x2} ${y2}`;
}

/** Sipariş gelince beş işin sırayla kendiliğinden yapılması. */
export default function OtomasyonDemo() {
  const kok = useRef<HTMLDivElement>(null);
  const nokta = useRef<HTMLSpanElement>(null);
  const { gorunen } = useIsletmeAdi();
  const [yollar, setYollar] = useState<string[]>([]);
  const [aktif, setAktif] = useState(-1);
  const [calisiyor, setCalisiyor] = useState(false);
  const [no, setNo] = useState(1043);
  const [stok, setStok] = useState(41);
  const [kayitlar, setKayitlar] = useState<Kayit[]>([]);
  const [mesaj, setMesaj] = useState(false);
  const [sayac, setSayac] = useState(0);
  const calisiyorRef = useRef(false);
  const durum = useRef({ no: 1043, stok: 41 });

  // Düğümlerin yerine göre yolları ölç (ekran boyu değişince yeniden)
  useLayoutEffect(() => {
    const kap = kok.current!;
    const olc = () => {
      const kutular = [...kap.querySelectorAll<HTMLElement>("[data-dugum]")].map((d) => d.getBoundingClientRect());
      const kokKutu = kap.getBoundingClientRect();
      setYollar(kutular.slice(0, -1).map((k, i) => yolCiz(k, kutular[i + 1]!, kokKutu)));
    };
    olc();
    const izleyici = new ResizeObserver(olc);
    izleyici.observe(kap);
    return () => izleyici.disconnect();
  }, []);

  const kaydet = (metin: string) => setKayitlar((onceki) => [...onceki, { saat: saatYaz(), metin }].slice(-4));

  const calistir = useCallback(() => {
    if (calisiyorRef.current || !kok.current) return;
    calisiyorRef.current = true;
    setCalisiyor(true);
    const siparisNo = durum.current.no;
    const yeniStok = durum.current.stok - 1;
    const azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const aktifYollar = kok.current.querySelectorAll<SVGPathElement>("[data-aktif-yol]");
    const temelYollar = kok.current.querySelectorAll<SVGPathElement>("[data-temel-yol]");

    const adimMetinleri = [
      `Sipariş #${siparisNo} alındı`,
      `Stok güncellendi: kupa ${yeniStok + 1} → ${yeniStok}`,
      `Fatura #${siparisNo} kesildi, e-posta ile gönderildi`,
      `Kargo etiketi hazır, kurye çağrıldı`,
      `Müşteriye WhatsApp mesajı gitti`,
    ];

    const bitir = () => {
      setMesaj(true);
      setSayac((s) => s + ADIMLAR.length);
      durum.current = { no: siparisNo + 1, stok: yeniStok > 5 ? yeniStok : 41 };
      setStok(yeniStok);
      calisiyorRef.current = false;
      setCalisiyor(false);
    };

    setMesaj(false);
    setNo(siparisNo);
    setAktif(0);
    kaydet(adimMetinleri[0]!);

    if (azHareket) {
      for (let i = 1; i < ADIMLAR.length; i++) kaydet(adimMetinleri[i]!);
      setAktif(ADIMLAR.length - 1);
      aktifYollar.forEach((y) => gsap.set(y, { strokeDashoffset: 0 }));
      bitir();
      return;
    }

    const zc = gsap.timeline({ onComplete: bitir });
    zc.set(aktifYollar, { strokeDashoffset: 1 }).set(nokta.current, { autoAlpha: 1 });
    temelYollar.forEach((yol, i) => {
      zc.to(nokta.current, {
        duration: 0.75,
        ease: "power2.inOut",
        motionPath: { path: yol, align: yol, alignOrigin: [0.5, 0.5] },
      })
        .to(aktifYollar[i]!, { strokeDashoffset: 0, duration: 0.75, ease: "power2.inOut" }, "<")
        .call(() => {
          setAktif(i + 1);
          kaydet(adimMetinleri[i + 1]!);
        })
        .to({}, { duration: 0.25 });
    });
    zc.to(nokta.current, { autoAlpha: 0, duration: 0.3 });
  }, []);

  // Görünürken birkaç saniyede bir yeni sipariş gelir
  useGSAP(
    () => {
      let aralik = 0;
      const t = ScrollTrigger.create({
        trigger: kok.current,
        start: "top 75%",
        end: "bottom 15%",
        onToggle: (tetik) => {
          window.clearInterval(aralik);
          if (!tetik.isActive) return;
          calistir();
          if (window.matchMedia(HAREKET_ACIK).matches) aralik = window.setInterval(calistir, 8000);
        },
      });
      return () => {
        window.clearInterval(aralik);
        t.kill();
      };
    },
    { scope: kok, dependencies: [calistir] },
  );

  useEffect(() => {
    if (!mesaj || !kok.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      kok.current.querySelector("[data-balon]"),
      { scale: 0.6, opacity: 0, y: 12 },
      { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.8)" },
    );
  }, [mesaj]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm text-soluk">
          <Lightning size={16} weight="fill" className="text-alev" aria-hidden="true" />
          Otomatik yapılan iş: <span className="font-medium text-krem tabular-nums">{sayac}</span>
        </p>
        <button
          type="button"
          onClick={calistir}
          disabled={calisiyor}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-cizgi-guclu px-4 text-sm transition-colors hover:border-alev hover:text-alev disabled:opacity-50"
        >
          {calisiyor ? "Akış çalışıyor" : "Yeni sipariş gönder"}
        </button>
      </div>

      <div ref={kok} className="relative rounded-[1.75rem] border border-cizgi bg-gece p-4 sm:p-6">
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible">
          {yollar.map((d, i) => (
            <g key={i}>
              <path
                data-temel-yol
                d={d}
                fill="none"
                stroke="rgb(244 236 224 / 0.14)"
                strokeWidth="1.5"
                strokeDasharray="4 6"
              />
              <path
                data-aktif-yol
                d={d}
                pathLength={1}
                fill="none"
                className="stroke-alev"
                strokeWidth="2"
                strokeDasharray="1"
                strokeDashoffset={1}
                strokeLinecap="round"
              />
            </g>
          ))}
        </svg>
        <span
          ref={nokta}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 z-10 size-3.5 rounded-full bg-alev-acik opacity-0 shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-alev)_25%,transparent),0_0_24px_6px_color-mix(in_srgb,var(--color-alev)_60%,transparent)]"
        />

        <ol className="relative grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-3 sm:gap-y-12">
          {ADIMLAR.map((a, i) => {
            const tamam = i <= aktif;
            return (
              <li
                key={a.ad}
                data-dugum
                className={`${YERLESIM[i]} flex items-center gap-3 rounded-2xl border p-3 transition-[border-color,background-color,box-shadow] duration-500 ${
                  tamam
                    ? "border-alev/60 bg-alev/10 shadow-[0_0_40px_-12px_color-mix(in_srgb,var(--color-alev)_60%,transparent)]"
                    : "border-cizgi bg-gece-2"
                }`}
              >
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-500 ${tamam ? "bg-alev text-gece" : "bg-gece-4 text-soluk"}`}
                >
                  {tamam && i > 0 ? (
                    <Check size={18} weight="bold" aria-hidden="true" />
                  ) : (
                    <a.Ikon size={20} aria-hidden="true" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{a.ad}</span>
                  <span className="block truncate text-xs text-soluk">
                    {i === 0 && `#${no}`}
                    {i === 1 && `Kupa stoğu ${stok}`}
                    {i === 2 && "e-Arşiv, PDF"}
                    {i === 3 && "Barkod hazır"}
                    {i === 4 && "WhatsApp"}
                  </span>
                </span>
              </li>
            );
          })}

          <li className="sm:col-start-1 sm:row-start-2 sm:self-center" aria-live="polite">
            <div
              data-balon
              className={`max-w-[17rem] rounded-2xl rounded-tl-sm border border-cizgi-guclu bg-gece-3 p-3 text-sm leading-snug ${mesaj ? "" : "invisible"}`}
            >
              <p className="text-xs font-medium text-alev">{gorunen}</p>
              <p className="mt-1">
                Merhaba, #{no} numaralı siparişiniz kargoya verildi. Takip numaranız: FN{no}TR
              </p>
              <p className="mt-1 text-right text-[0.6875rem] text-soluk">✓✓ okundu</p>
            </div>
          </li>
        </ol>
      </div>

      <div className="rounded-[1.25rem] border border-cizgi bg-gece p-4 font-mono text-xs" aria-label="Akış kaydı">
        <p className="mb-2 text-soluk">akış kaydı</p>
        <ul className="grid min-h-[5.5rem] gap-1.5">
          {kayitlar.length === 0 && <li className="text-soluk">Sipariş bekleniyor…</li>}
          {kayitlar.map((k, i) => (
            <li key={`${k.saat}-${i}-${k.metin}`} className="flex gap-3 animate-[satir_0.5s_var(--ease-yay)]">
              <span className="text-soluk tabular-nums">{k.saat}</span>
              <span className="truncate text-krem/90">{k.metin}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
