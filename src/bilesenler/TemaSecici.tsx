"use client";

import { useState, useSyncExternalStore } from "react";
import { Palette, X } from "@phosphor-icons/react/dist/ssr";
import { TEMALAR, temaGecerliMi, type TemaKodu, VARSAYILAN_TEMA } from "@/site/tema";

function temaAbone(degisti: () => void) {
  window.addEventListener("fanus:tema", degisti);
  return () => window.removeEventListener("fanus:tema", degisti);
}

function okunanTema(): TemaKodu {
  const kod = document.documentElement.dataset.tema;
  return temaGecerliMi(kod) ? kod : VARSAYILAN_TEMA;
}

/** Yalnız denemede: sol altta renk paletini değiştiren panel (seçim bu tarayıcıda hatırlanır). */
export default function TemaSecici() {
  const [acik, setAcik] = useState(false);
  // Seçili palet <html data-tema>'dan okunur. Sunucuda ve ilk çizimde varsayılan kullanılır (yoksa sayfa
  // uyuşmazlık verip baştan çizilir ve head betiğinin koyduğu palet silinir); hemen ardından gerçek değer gelir.
  const secili = useSyncExternalStore(temaAbone, okunanTema, () => VARSAYILAN_TEMA);

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
            <span className="etiket">Renk paleti</span>
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
