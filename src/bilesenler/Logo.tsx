import type { SVGProps } from "react";
import { BICIMLER, type BicimKodu } from "@/site/tema";

/*
  fanus işareti, 32x32'lik kutuda. Denemede iki biçim var: "simge" (köşeleri yuvarlatılmış cam kare) ve
  "parantez" (alevi iki yandan saran iki kavis). İkisi de sayfada durur, hangisinin görüneceğini <html data-bicim>
  seçer (globals.css › data-bicim-isaret). Alev sabit renkli: dışı kor kırmızısı, içi sarı.
*/

/** Alevin yolu (100x140'lık kutuda). 3B sahnedeki alev de bu yoldan kurulur (src/sahne/fanus3b.ts). */
const ALEV_YOLU = "M57 2C64 34 88 54 88 90C88 119 71 138 50 138C29 138 12 119 12 90C12 58 42 42 57 2Z";

/** Her biçimin çizgileri; "ince" olan camın parıltısıdır (daha ince ve yarı saydam). */
const CIZGILER: Record<BicimKodu, { d: string; ince?: boolean }[]> = {
  simge: [
    { d: "M12 4h8a8 8 0 0 1 8 8v8a8 8 0 0 1-8 8h-8a8 8 0 0 1-8-8v-8a8 8 0 0 1 8-8Z" },
    { d: "M21.5 8.2a4.6 4.6 0 0 1 2.3 2.3", ince: true },
  ],
  parantez: [{ d: "M10.2 5C6.6 9.4 6.6 22.6 10.2 27" }, { d: "M21.8 5c3.6 4.4 3.6 17.6 0 22" }],
};
const ALEV_ALTI: Record<BicimKodu, number> = { simge: 23.6, parantez: 23.4 };
const ALEV_BOYU = 14;

/** 32'lik kutunun ortasında alev; alt kenarı `alt`ta. */
function Alev({ alt, ...ozellik }: { alt: number } & SVGProps<SVGGElement>) {
  const s = ALEV_BOYU / 134;
  return (
    <g {...ozellik}>
      <g transform={`translate(${16 - 50 * s} ${alt - 138 * s}) scale(${s})`}>
        <path d={ALEV_YOLU} fill="#ff4a2b" />
        <path d={ALEV_YOLU} fill="#ffc83a" transform="translate(50 134) scale(.5) translate(-50 -134)" />
      </g>
    </g>
  );
}

/** Küçük işaret (menü, altbilgi, geçiş perdesi). Rengi `currentColor`. */
export function FanusIsareti({ className = "size-7" }: { className?: string }) {
  return (
    <span className={`inline-block shrink-0 ${className}`} aria-hidden="true">
      {BICIMLER.map(({ kod }) => (
        <svg key={kod} data-bicim-isaret={kod} viewBox="0 0 32 32" fill="none" className="size-full">
          {CIZGILER[kod].map((c) => (
            <path
              key={c.d}
              d={c.d}
              stroke="currentColor"
              strokeWidth={c.ince ? 1.5 : 2.1}
              strokeLinecap="round"
              opacity={c.ince ? 0.55 : 1}
            />
          ))}
          <Alev alt={ALEV_ALTI[kod]} />
        </svg>
      ))}
    </span>
  );
}

/**
 * Büyük, çizilerek beliren işaret (açılış perdesi, sayfa sonu çağrısı). Çizgiler `cizgiAdi` veri özniteliğini,
 * alev `alevAdi`nı taşır; GSAP bunları seçip strokeDashoffset 1→0 ve ölçek 0→1 ile canlandırır.
 * `gizli`: çizim baştan görünmez (yalnız JS ile açılan açılış perdesinde); yoksa JS'siz de tam görünür.
 */
export function CizilenIsaret({
  cizgiAdi,
  alevAdi,
  kalinlik,
  gizli = false,
  className,
}: {
  cizgiAdi: string;
  alevAdi: string;
  kalinlik: number;
  gizli?: boolean;
  className?: string;
}) {
  return (
    <>
      {BICIMLER.map(({ kod }) => (
        <svg key={kod} data-bicim-isaret={kod} viewBox="0 0 32 32" fill="none" className={className}>
          {CIZGILER[kod].map((c) => (
            <path
              key={c.d}
              {...{ [cizgiAdi]: "" }}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={gizli ? 1 : 0}
              d={c.d}
              stroke="currentColor"
              strokeWidth={c.ince ? kalinlik * 0.7 : kalinlik}
              strokeLinecap="round"
              opacity={c.ince ? 0.55 : 1}
            />
          ))}
          <Alev {...{ [alevAdi]: "" }} alt={ALEV_ALTI[kod]} className={gizli ? "opacity-0" : undefined} />
        </svg>
      ))}
    </>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <FanusIsareti className="size-7 text-krem" />
      <span className="font-baslik text-[1.375rem] leading-none font-semibold tracking-[-0.03em]">
        fanus<span className="text-soluk">.tr</span>
      </span>
    </span>
  );
}
