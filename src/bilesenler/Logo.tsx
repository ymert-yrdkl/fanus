import type { SVGProps } from "react";

/*
  fanus işareti, 32x32'lik kutuda: [ · ] — iki köşeli parantez (fanusun iki cam duvarı; aynı zamanda kod) ve ortada
  fanusun içindeki ateşböceği: sarı-yeşil bir ışık noktası ve etrafında soluk halesi. Klavyeyle yazılışı "[ · ]",
  düz metinde "[.]". Parantezler currentColor (mürekkep ya da kâğıt), nokta markanın ışık rengi (--color-isik);
  vurgu renginden bağımsızdır. (23 Ekim 2026: alev gitti, ateşböceği geldi.)
*/

/** Köşeli parantezlerin çizgileri. */
const CIZGILER = ["M12.5 5H9a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h3.5", "M19.5 5H23a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2h-3.5"];
const NOKTA = { cx: 16, cy: 16, r: 2.4, hale: 4.4 };

/** Ateşböceği: hale ve çekirdek. */
function Isik(ozellik: SVGProps<SVGGElement>) {
  return (
    <g {...ozellik}>
      <circle cx={NOKTA.cx} cy={NOKTA.cy} r={NOKTA.hale} fill="var(--color-isik)" opacity={0.45} />
      <circle cx={NOKTA.cx} cy={NOKTA.cy} r={NOKTA.r} fill="var(--color-isik-koyu)" />
    </g>
  );
}

/** Küçük işaret (menü, altbilgi). Parantez rengi `currentColor`. */
export function FanusIsareti({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={`shrink-0 ${className}`} aria-hidden="true">
      {CIZGILER.map((d) => (
        <path key={d} d={d} stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      <Isik />
    </svg>
  );
}

/**
 * Büyük, çizilerek beliren işaret (açılış perdesi). Çizgiler `cizgiAdi` veri özniteliğini, nokta `isikAdi`nı
 * taşır; GSAP bunları seçip strokeDashoffset 1→0 ve ölçek 0→1 ile canlandırır.
 * `gizli`: çizim baştan görünmez (yalnız JS ile açılan açılış perdesinde); yoksa JS'siz de tam görünür.
 */
export function CizilenIsaret({
  cizgiAdi,
  isikAdi,
  kalinlik,
  gizli = false,
  className,
}: {
  cizgiAdi: string;
  isikAdi: string;
  kalinlik: number;
  gizli?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      {CIZGILER.map((d) => (
        <path
          key={d}
          {...{ [cizgiAdi]: "" }}
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={gizli ? 1 : 0}
          d={d}
          stroke="currentColor"
          strokeWidth={kalinlik}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      <Isik {...{ [isikAdi]: "" }} className={gizli ? "opacity-0" : undefined} />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <FanusIsareti className="size-7 text-krem" />
      <span className="font-baslik text-[1.375rem] leading-none font-semibold tracking-[-0.03em]">
        fanus<span className="text-soluk">soft</span>
      </span>
    </span>
  );
}
