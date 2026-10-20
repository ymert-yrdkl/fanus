"use client";

import { useState } from "react";
import { Palette, X } from "@phosphor-icons/react/dist/ssr";
import { TEMALAR, temaGecerliMi, type TemaKodu, VARSAYILAN_TEMA } from "@/site/tema";

/** Yalnız denemede: sol altta renk temasını değiştiren küçük panel (seçim bu tarayıcıda hatırlanır). */
export default function TemaSecici() {
  const [acik, setAcik] = useState(false);
  const [acikBolum, setAcikBolum] = useState(() =>
    typeof document === "undefined" ? true : document.documentElement.dataset.acikBolum !== "kapali",
  );
  const [secili, setSecili] = useState<TemaKodu>(() => {
    if (typeof document === "undefined") return VARSAYILAN_TEMA;
    const kod = document.documentElement.dataset.tema;
    return temaGecerliMi(kod) ? kod : VARSAYILAN_TEMA;
  });

  const sec = (kod: TemaKodu) => {
    document.documentElement.setAttribute("data-tema", kod);
    try {
      localStorage.setItem("fanus-tema", kod);
    } catch {
      // Gizli pencerede depolama kapalı olabilir; tema yine değişir
    }
    const tema = TEMALAR.find((t) => t.kod === kod)!;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", tema.zemin);
    window.dispatchEvent(new Event("fanus:tema"));
    setSecili(kod);
  };

  const acikBolumDegistir = () => {
    const yeni = !acikBolum;
    document.documentElement.setAttribute("data-acik-bolum", yeni ? "acik" : "kapali");
    try {
      localStorage.setItem("fanus-acik-bolum", yeni ? "acik" : "kapali");
    } catch {
      // depolama kapalı olabilir
    }
    setAcikBolum(yeni);
  };

  return (
    <div className="fixed bottom-4 left-4 z-[90] font-govde">
      {acik ? (
        <div className="w-60 rounded-2xl border border-cizgi-guclu bg-gece-2/95 p-3 golge backdrop-blur-xl">
          <div className="flex items-center justify-between px-1 pb-2">
            <span className="etiket">Renk teması</span>
            <button
              type="button"
              onClick={() => setAcik(false)}
              className="flex size-8 items-center justify-center rounded-full hover:bg-gece-3"
            >
              <X size={14} aria-hidden="true" />
              <span className="sr-only">Kapat</span>
            </button>
          </div>
          <ul className="grid gap-1">
            {TEMALAR.map((t) => (
              <li key={t.kod}>
                <button
                  type="button"
                  aria-pressed={secili === t.kod}
                  onClick={() => sec(t.kod)}
                  className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm transition-colors ${
                    secili === t.kod ? "bg-gece-4 text-krem" : "text-soluk hover:bg-gece-3 hover:text-krem"
                  }`}
                >
                  <span className="flex overflow-hidden rounded-md border border-cizgi-guclu">
                    <span className="size-5" style={{ background: t.zemin }} />
                    <span className="size-5" style={{ background: t.vurgu }} />
                  </span>
                  {t.ad}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            aria-pressed={acikBolum}
            onClick={acikBolumDegistir}
            className="mt-2 flex w-full items-center justify-between rounded-xl border border-cizgi px-2.5 py-2 text-sm text-krem hover:bg-gece-3"
          >
            Gündüz (beyaz) bölümler
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${acikBolum ? "bg-alev text-gece" : "bg-gece-4 text-soluk"}`}
            >
              {acikBolum ? "açık" : "kapalı"}
            </span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAcik(true)}
          className="flex h-11 items-center gap-2 rounded-full border border-cizgi-guclu bg-gece-2/90 px-4 text-sm text-krem backdrop-blur-xl"
        >
          <Palette size={16} aria-hidden="true" />
          Tema
        </button>
      )}
    </div>
  );
}
