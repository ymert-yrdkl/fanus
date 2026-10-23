import { ShoppingBagOpen, Receipt, Truck, ChatCircleText, List } from "@phosphor-icons/react/dist/ssr";
import type { HizmetAdresi } from "@/site/icerik";

/*
  Hizmet dizinindeki minyatürler: her hizmetin küçük, kendi kendine dönen bir resmi. Yalnız işaretleme ve CSS
  animasyonu (globals.css › .cubuk, .yazilan, .tarama, .yolcu, .dugum); sunucuda da istemcide de çizilir.
  Hepsi kapsayıcının yüksekliğini doldurur (h-full).
*/

function CiroGorseli() {
  const boylar = [0.45, 0.7, 0.55, 0.85, 0.6, 1, 0.75];
  return (
    <div className="flex h-full flex-col justify-end rounded-2xl border border-cizgi bg-cukur p-4">
      <div className="flex items-center justify-between text-xs text-soluk">
        <span>Bu hafta</span>
        <span className="rounded-full bg-vurgu px-2 py-0.5 font-medium text-gece">Yeni sipariş</span>
      </div>
      <div className="mt-4 flex h-28 items-end gap-2">
        {boylar.map((b, i) => (
          <span
            key={i}
            className="cubuk flex-1 origin-bottom rounded-t-md bg-vurgu/80"
            style={{ height: `${b * 100}%`, animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function SiteGorseli() {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-cizgi bg-[#f6f1e9] p-3">
      <div className="flex items-center justify-between">
        <span className="h-2 w-10 rounded-full bg-[#1d1a16]/70" />
        <List size={12} className="text-[#1d1a16]/60" aria-hidden="true" />
      </div>
      <span className="yazilan mt-4 block h-3 w-[80%] origin-left rounded-full bg-[#1d1a16]" />
      <span className="yazilan mt-1.5 block h-3 w-[55%] origin-left rounded-full bg-[#1d1a16] [animation-delay:0.4s]" />
      <span className="mt-3 block h-1.5 w-[90%] rounded-full bg-[#1d1a16]/20" />
      <span className="mt-1 block h-1.5 w-[70%] rounded-full bg-[#1d1a16]/20" />
      <span className="mt-3 inline-block h-4 w-14 rounded-full bg-vurgu" />
    </div>
  );
}

function QrGorseli({ qrSvg }: { qrSvg: string }) {
  return (
    <div className="relative mx-auto aspect-square h-full max-h-40 overflow-hidden rounded-2xl bg-[#fff] p-3">
      <div
        className="text-[#141416] [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
        dangerouslySetInnerHTML={{ __html: qrSvg }}
      />
      <span className="tarama absolute inset-x-2 top-[6%] bottom-[6%]">
        <span className="absolute inset-x-0 top-0 h-0.5 rounded-full bg-vurgu shadow-[0_0_14px_3px_color-mix(in_srgb,var(--color-vurgu)_70%,transparent)]" />
      </span>
    </div>
  );
}

function AkisGorseli() {
  const dugumler = [ShoppingBagOpen, Receipt, Truck, ChatCircleText];
  return (
    <div className="flex h-full items-center overflow-hidden rounded-2xl border border-cizgi bg-cukur p-5">
      <div className="relative flex w-full items-center justify-between">
        <span className="absolute inset-x-5 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-cizgi-guclu" />
        <span className="absolute inset-x-5 top-1/2 h-3 -translate-y-1/2">
          <span className="yolcu absolute inset-y-0 left-0 w-[calc(100%-0.75rem)]">
            <span className="absolute top-0 left-0 size-3 rounded-full bg-vurgu-acik shadow-[0_0_16px_4px_color-mix(in_srgb,var(--color-vurgu)_60%,transparent)]" />
          </span>
        </span>
        {dugumler.map((Ikon, i) => (
          <span
            key={i}
            className="dugum relative flex size-12 items-center justify-center rounded-xl border border-cizgi-guclu bg-gece-3 text-soluk"
            style={{ animationDelay: `${i * 0.75}s` }}
          >
            <Ikon size={22} aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** Hizmetin minyatürü; kapsayıcının yüksekliğini doldurur. */
export default function HizmetMinyaturu({ adres, qrSvg }: { adres: HizmetAdresi; qrSvg: string }) {
  switch (adres) {
    case "e-ticaret":
      return <CiroGorseli />;
    case "kurumsal-site":
      return <SiteGorseli />;
    case "qr-menu":
      return <QrGorseli qrSvg={qrSvg} />;
    case "web-otomasyonu":
      return <AkisGorseli />;
    case "mobil-uygulama":
      return <TelefonGorseli />;
  }
}

/** Mobil uygulama: küçük telefon; ekranında bildirim düşer, alt sekmeler, bir kart. */
function TelefonGorseli() {
  return (
    <div className="flex h-full items-end justify-center">
      <div className="relative flex h-full w-[6.5rem] flex-col overflow-hidden rounded-t-[1.4rem] border-[4px] border-b-0 border-gece-4 bg-cukur px-2 pt-2">
        <span className="dusen-bildirim flex items-center gap-1.5 rounded-lg bg-vurgu px-2 py-1.5">
          <span className="size-2 rounded-full bg-gece/70" aria-hidden="true" />
          <span className="h-1.5 w-12 rounded-full bg-gece/60" />
        </span>
        <span className="mt-2 block rounded-lg bg-gece-2 p-2">
          <span className="block h-1.5 w-8 rounded-full bg-soluk/60" />
          <span className="mt-1.5 flex h-6 items-end gap-0.5">
            {[0.4, 0.7, 0.5, 0.9, 0.6, 1].map((b, i) => (
              <span
                key={i}
                className="cubuk flex-1 origin-bottom rounded-sm bg-vurgu/80"
                style={{ height: `${b * 100}%`, animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </span>
        </span>
        <span className="mt-auto mb-1 grid grid-cols-3 gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-3 rounded-md ${i === 0 ? "bg-vurgu" : "bg-gece-3"}`} />
          ))}
        </span>
      </div>
    </div>
  );
}
