"use client";

import { useState, useSyncExternalStore } from "react";
import { Palette, X } from "@phosphor-icons/react/dist/ssr";
import {
  BICIMLER,
  bicimGecerliMi,
  type BicimKodu,
  TEMALAR,
  temaGecerliMi,
  type TemaKodu,
  VARSAYILAN_BICIM,
  VARSAYILAN_TEMA,
} from "@/site/tema";

function temaAbone(degisti: () => void) {
  window.addEventListener("fanus:tema", degisti);
  return () => window.removeEventListener("fanus:tema", degisti);
}

function bicimAbone(degisti: () => void) {
  window.addEventListener("fanus:bicim", degisti);
  return () => window.removeEventListener("fanus:bicim", degisti);
}

function okunanBicim(): BicimKodu {
  const kod = document.documentElement.dataset.bicim;
  return bicimGecerliMi(kod) ? kod : VARSAYILAN_BICIM;
}

function okunanTema(): TemaKodu {
  const kod = document.documentElement.dataset.tema;
  return temaGecerliMi(kod) ? kod : VARSAYILAN_TEMA;
}

/** Yalnız denemede: sol altta fanus biçimini ve renk paletini değiştiren panel (seçim bu tarayıcıda hatırlanır). */
export default function TemaSecici() {
  const [acik, setAcik] = useState(false);
  // Seçili palet <html data-tema>'dan okunur. Sunucuda ve ilk çizimde varsayılan kullanılır (yoksa sayfa
  // uyuşmazlık verip baştan çizilir ve head betiğinin koyduğu palet silinir); hemen ardından gerçek değer gelir.
  const secili = useSyncExternalStore(temaAbone, okunanTema, () => VARSAYILAN_TEMA);
  const bicim = useSyncExternalStore(bicimAbone, okunanBicim, () => VARSAYILAN_BICIM);

  const bicimSec = (kod: BicimKodu) => {
    document.documentElement.setAttribute("data-bicim", kod);
    try {
      localStorage.setItem("fanus-bicim", kod);
    } catch {
      // depolama kapalı olabilir; biçim yine değişir
    }
    window.dispatchEvent(new Event("fanus:bicim"));
  };

  const sec = (kod: TemaKodu) => {
    document.documentElement.setAttribute("data-tema", kod);
    try {
      localStorage.setItem("fanus-tema", kod);
    } catch {
      // Gizli pencerede depolama kapalı olabilir; palet yine değişir
    }
    const tema = TEMALAR.find((t) => t.kod === kod)!;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", tema.gece);
    window.dispatchEvent(new Event("fanus:tema"));
  };

  const etkin = TEMALAR.find((t) => t.kod === secili)!;

  return (
    <div className="fixed bottom-4 left-4 z-[90] font-govde">
      {acik ? (
        <div className="max-h-[calc(100dvh-2rem)] w-72 overflow-y-auto rounded-2xl border border-cizgi-guclu bg-gece-2/95 p-3 golge backdrop-blur-xl">
          <div className="flex items-center justify-between px-1 pb-2">
            <span className="etiket">Biçim ve palet</span>
            <button
              type="button"
              onClick={() => setAcik(false)}
              className="flex size-8 items-center justify-center rounded-full hover:bg-gece-3"
            >
              <X size={14} aria-hidden="true" />
              <span className="sr-only">Kapat</span>
            </button>
          </div>
          <div className="mb-3 grid grid-cols-2 gap-1">
            {BICIMLER.map((b) => (
              <button
                key={b.kod}
                type="button"
                aria-pressed={bicim === b.kod}
                onClick={() => bicimSec(b.kod)}
                className={`rounded-xl px-2.5 py-2 text-sm transition-colors ${
                  bicim === b.kod ? "bg-alev text-gece" : "bg-gece-3 text-soluk hover:text-krem"
                }`}
              >
                {b.ad}
              </button>
            ))}
          </div>
          <ul className="grid gap-1">
            {TEMALAR.map((t, i) => (
              <li key={t.kod}>
                <button
                  type="button"
                  aria-pressed={secili === t.kod}
                  onClick={() => sec(t.kod)}
                  className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm transition-colors ${
                    secili === t.kod ? "bg-gece-4 text-krem" : "text-soluk hover:bg-gece-3 hover:text-krem"
                  }`}
                >
                  <span className="flex shrink-0 overflow-hidden rounded-md border border-cizgi-guclu">
                    <span className="size-5" style={{ background: t.gece }} />
                    <span className="size-5" style={{ background: t.gunduz }} />
                    <span className="size-5" style={{ background: t.vurgu }} />
                  </span>
                  <span className="text-silik tabular-nums">{i + 1}</span>
                  {t.ad}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 border-t border-cizgi px-1 pt-2 text-xs leading-relaxed text-soluk">{etkin.not}</p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAcik(true)}
          className="flex h-11 items-center gap-2 rounded-full border border-cizgi-guclu bg-gece-2/90 px-4 text-sm text-krem backdrop-blur-xl"
        >
          <Palette size={16} aria-hidden="true" />
          Palet: {etkin.ad}
        </button>
      )}
    </div>
  );
}
