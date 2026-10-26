"use client";

import { useEffect, useRef, useState } from "react";
import {
  Coffee,
  TShirt,
  Tote,
  Minus,
  Plus,
  ShoppingBag,
  CreditCard,
  CheckCircle,
  LockSimple,
} from "@phosphor-icons/react/dist/ssr";
import { vurgu } from "@/hareket/renk";
import { HAREKET_ACIK, hareketYukle, useHareket } from "@/hareket/gsap";
import { basHarfler, useIsletmeAdi } from "../IsletmeAdi";
import { AkanTutar, tlBicimi } from "./AkanSayi";

const URUNLER = [
  { kod: "kupa", ad: "Kupa", fiyat: 18000, Ikon: Coffee },
  { kod: "tisort", ad: "Tişört", fiyat: 42000, Ikon: TShirt },
  { kod: "canta", ad: "Bez çanta", fiyat: 9500, Ikon: Tote },
];

type Asama = "sepet" | "odeme" | "dogrulama" | "tamam";
type Siparis = { no: number; tutar: number; adet: number; durum: "Yeni" | "Hazırlanıyor" | "Kargoda" };

const ILK_SIPARISLER: Siparis[] = [
  { no: 1042, tutar: 51000, adet: 2, durum: "Hazırlanıyor" },
  { no: 1041, tutar: 27500, adet: 2, durum: "Kargoda" },
  { no: 1040, tutar: 84000, adet: 2, durum: "Kargoda" },
];

/** Müşteri sepeti ve yönetim paneli yan yana: ödeme alınınca sipariş panele düşer. */
export default function EticaretDemo() {
  const kok = useRef<HTMLDivElement>(null);
  const { gorunen } = useIsletmeAdi();
  const [adetler, setAdetler] = useState([1, 1, 0]);
  const [asama, setAsama] = useState<Asama>("sepet");
  const [siparisler, setSiparisler] = useState(ILK_SIPARISLER);
  const [yeniNo, setYeniNo] = useState<number | null>(null);
  const dokunuldu = useRef(false);
  const zamanlayicilar = useRef<number[]>([]);

  const toplam = URUNLER.reduce((t, u, i) => t + u.fiyat * adetler[i]!, 0);
  const sepetAdedi = adetler.reduce((t, a) => t + a, 0);
  const ciro = siparisler.reduce((t, s) => t + s.tutar, 0);

  const sonra = (ms: number, is: () => void) => {
    zamanlayicilar.current.push(window.setTimeout(is, ms));
  };
  useEffect(() => () => zamanlayicilar.current.forEach((z) => clearTimeout(z)), []);

  const adetDegistir = (i: number, fark: number) => {
    dokunuldu.current = true;
    setAdetler((onceki) => onceki.map((a, j) => (j === i ? Math.max(0, Math.min(9, a + fark)) : a)));
  };

  const ode = () => {
    if (toplam === 0) return;
    setAsama("dogrulama");
    sonra(1500, () => {
      const no = Math.max(...siparisler.map((s) => s.no)) + 1;
      setAsama("tamam");
      setYeniNo(no);
      setSiparisler((onceki) =>
        [{ no, tutar: toplam, adet: sepetAdedi, durum: "Yeni" as const }, ...onceki].slice(0, 4),
      );
      sonra(2600, () => {
        setAsama("sepet");
        setAdetler([1, 0, 1]);
      });
    });
  };

  // Görünüme ilk girişte, ziyaretçi dokunmadıysa akışı bir kez kendiliğinden göster
  useHareket(
    ({ gsap, ScrollTrigger }) => {
      const mm = gsap.matchMedia();
      mm.add(HAREKET_ACIK, () => {
        const t = ScrollTrigger.create({
          trigger: kok.current,
          start: "top 55%",
          once: true,
          onEnter: () =>
            sonra(1400, () => {
              if (dokunuldu.current) return;
              setAsama("odeme");
              sonra(1300, () => !dokunuldu.current && ode());
            }),
        });
        return () => t.kill();
      });
    },
    { scope: kok },
  );

  // Yeni sipariş panele düşünce satır açılır ve parlar
  useEffect(() => {
    if (yeniNo === null || !kok.current) return;
    const satir = kok.current.querySelector(`[data-siparis="${yeniNo}"]`);
    if (!satir) return;
    void hareketYukle().then(({ gsap }) =>
      gsap.fromTo(
        satir,
        { height: 0, opacity: 0, backgroundColor: vurgu(0.22) },
        {
          height: "auto",
          opacity: 1,
          duration: 0.7,
          ease: "expo.out",
          backgroundColor: vurgu(0),
          clearProps: "height",
        },
      ),
    );
  }, [yeniNo]);

  return (
    <div ref={kok} className="grid gap-4 sm:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] sm:items-start">
      {/* Müşterinin gördüğü mağaza */}
      <div className="relative overflow-hidden rounded-[1.75rem] border border-cizgi-guclu bg-cukur p-4 golge">
        <div className="flex items-center justify-between gap-3 border-b border-cizgi pb-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-vurgu font-baslik text-sm font-semibold text-gece">
              {basHarfler(gorunen)}
            </span>
            <span className="truncate font-medium">{gorunen}</span>
          </div>
          <span className="relative flex size-9 items-center justify-center rounded-full bg-gece-3">
            <ShoppingBag size={18} aria-hidden="true" />
            <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-vurgu text-[0.6875rem] font-semibold text-gece tabular-nums">
              {sepetAdedi}
            </span>
            <span className="sr-only">Sepette {sepetAdedi} ürün</span>
          </span>
        </div>

        <ul className="mt-3 grid gap-2.5">
          {URUNLER.map((u, i) => (
            <li key={u.kod} className="flex items-center gap-3 rounded-2xl bg-gece-2 p-2.5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gece-4 text-vurgu">
                <u.Ikon size={24} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.9375rem] leading-tight font-medium">{u.ad}</p>
                <p className="truncate text-xs text-soluk">{gorunen} baskılı</p>
                <p className="mt-0.5 text-sm tabular-nums">{tlBicimi.format(u.fiyat / 100)}</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-gece-3 p-1">
                <button
                  type="button"
                  onClick={() => adetDegistir(i, -1)}
                  disabled={asama !== "sepet"}
                  className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-gece-4 disabled:opacity-40"
                >
                  <Minus size={14} aria-hidden="true" />
                  <span className="sr-only">{u.ad} azalt</span>
                </button>
                <span className="w-4 text-center text-sm tabular-nums">{adetler[i]}</span>
                <button
                  type="button"
                  onClick={() => adetDegistir(i, 1)}
                  disabled={asama !== "sepet"}
                  className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-gece-4 disabled:opacity-40"
                >
                  <Plus size={14} aria-hidden="true" />
                  <span className="sr-only">{u.ad} artır</span>
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between px-1 text-[0.9375rem]">
          <span className="text-soluk">Toplam</span>
          <AkanTutar kurus={toplam} className="font-baslik text-xl font-semibold" />
        </div>

        <div className="mt-3 min-h-[6.5rem]" aria-live="polite">
          {asama === "sepet" && (
            <button
              type="button"
              onClick={() => {
                dokunuldu.current = true;
                setAsama("odeme");
              }}
              disabled={toplam === 0}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-vurgu font-medium text-gece transition-colors hover:bg-vurgu-acik disabled:opacity-40"
            >
              Ödemeye geç
            </button>
          )}
          {asama === "odeme" && (
            <div className="grid gap-2.5">
              <div className="flex items-center gap-3 rounded-2xl border border-cizgi bg-gece-2 px-4 py-3 text-sm">
                <CreditCard size={20} className="text-vurgu" aria-hidden="true" />
                <span className="font-mono tracking-wider">•••• 4242</span>
                <span className="ml-auto text-soluk">12/29</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  dokunuldu.current = true;
                  ode();
                }}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-vurgu font-medium text-gece transition-colors hover:bg-vurgu-acik"
              >
                <LockSimple size={16} weight="bold" aria-hidden="true" />
                {tlBicimi.format(toplam / 100)} öde
              </button>
            </div>
          )}
          {asama === "dogrulama" && (
            <div className="grid gap-3 rounded-2xl border border-cizgi bg-gece-2 p-4">
              <p className="text-sm">3D Secure doğrulanıyor</p>
              <div className="h-1.5 overflow-hidden rounded-full bg-gece-4">
                <div className="h-full w-full origin-left animate-[dolum_1.4s_ease-in-out_forwards] rounded-full bg-vurgu" />
              </div>
            </div>
          )}
          {asama === "tamam" && (
            <div className="flex items-center gap-3 rounded-2xl border border-vurgu/40 bg-vurgu/10 p-4">
              <CheckCircle size={28} weight="fill" className="shrink-0 text-vurgu" aria-hidden="true" />
              <div>
                <p className="font-medium">Ödeme alındı</p>
                <p className="text-sm text-soluk">Sipariş #{yeniNo} oluşturuldu</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* İşletmenin gördüğü panel */}
      <div className="rounded-[1.75rem] border border-cizgi bg-gece-3/60 p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="etiket">Yönetim paneli</p>
            <p className="mt-1 text-sm text-soluk">Bugünkü ciro</p>
            <AkanTutar kurus={ciro} className="font-baslik text-3xl font-semibold tracking-tight" />
          </div>
          <p className="text-sm text-soluk tabular-nums">{siparisler.length} sipariş</p>
        </div>
        <ul className="mt-5 grid">
          {siparisler.map((s) => (
            <li key={s.no} data-siparis={s.no} className="overflow-hidden rounded-xl">
              <div className="flex items-center gap-2.5 border-t border-cizgi px-2 py-3 text-sm">
                <span className="font-mono text-soluk">#{s.no}</span>
                <span className="whitespace-nowrap text-soluk">{s.adet} ürün</span>
                <span className="ml-auto tabular-nums">{tlBicimi.format(s.tutar / 100)}</span>
                <span
                  className={`w-[5.75rem] shrink-0 rounded-full px-2 py-1 text-center text-xs ${
                    s.durum === "Yeni"
                      ? "bg-vurgu text-gece"
                      : s.durum === "Hazırlanıyor"
                        ? "bg-gece-4 text-krem"
                        : "bg-transparent text-soluk ring-1 ring-cizgi-guclu"
                  }`}
                >
                  {s.durum}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
