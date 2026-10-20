import Link from "next/link";
import { ArrowUpRight, ShoppingBagOpen, Receipt, Truck, ChatCircleText, List } from "@phosphor-icons/react/dist/ssr";
import { HIZMETLER, hizmetFiyatEtiketi, type HizmetAdresi } from "@/site/icerik";

function CiroGorseli() {
  const boylar = [0.45, 0.7, 0.55, 0.85, 0.6, 1, 0.75];
  return (
    <div className="flex h-full flex-col justify-end rounded-2xl border border-cizgi bg-cukur p-4">
      <div className="flex items-center justify-between text-xs text-soluk">
        <span>Bu hafta</span>
        <span className="rounded-full bg-alev/15 px-2 py-0.5 text-alev">Yeni sipariş</span>
      </div>
      <div className="mt-4 flex h-28 items-end gap-2">
        {boylar.map((b, i) => (
          <span
            key={i}
            className="cubuk flex-1 origin-bottom rounded-t-md bg-alev/80"
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
      <span className="mt-3 inline-block h-4 w-14 rounded-full bg-alev" />
    </div>
  );
}

function QrGorseli({ qrSvg }: { qrSvg: string }) {
  return (
    <div className="relative mx-auto aspect-square h-full max-h-40 overflow-hidden rounded-2xl bg-[#fff] p-3">
      <div
        className="text-gece [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
        dangerouslySetInnerHTML={{ __html: qrSvg }}
      />
      <span className="tarama absolute inset-x-2 top-[6%] bottom-[6%]">
        <span className="absolute inset-x-0 top-0 h-0.5 rounded-full bg-alev shadow-[0_0_14px_3px_color-mix(in_srgb,var(--color-alev)_70%,transparent)]" />
      </span>
    </div>
  );
}

function AkisGorseli() {
  const dugumler = [ShoppingBagOpen, Receipt, Truck, ChatCircleText];
  return (
    <div className="flex h-full items-center rounded-2xl border border-cizgi bg-cukur p-5">
      <div className="relative flex w-full items-center justify-between">
        <span className="absolute inset-x-5 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-cizgi-guclu" />
        <span className="absolute inset-x-5 top-1/2 h-3 -translate-y-1/2">
          <span className="yolcu absolute inset-y-0 left-0 w-[calc(100%-0.75rem)]">
            <span className="absolute top-0 left-0 size-3 rounded-full bg-alev-acik shadow-[0_0_16px_4px_color-mix(in_srgb,var(--color-alev)_60%,transparent)]" />
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

/** Ana sayfadaki dört hizmet kartı (farklı boylarda ızgara); her biri kendi sayfasına gider. */
export default function HizmetKartlari({ qrSvg }: { qrSvg: string }) {
  const yerlesim: Record<HizmetAdresi, string> = {
    "e-ticaret": "md:col-span-4",
    "kurumsal-site": "md:col-span-2",
    "qr-menu": "md:col-span-2",
    "web-otomasyonu": "md:col-span-4",
  };
  const gorsel: Record<HizmetAdresi, React.ReactNode> = {
    "e-ticaret": <CiroGorseli />,
    "kurumsal-site": <SiteGorseli />,
    "qr-menu": <QrGorseli qrSvg={qrSvg} />,
    "web-otomasyonu": <AkisGorseli />,
  };

  return (
    <section
      aria-labelledby="hizmet-kartlari-baslik"
      className="relative z-10 bg-gece px-4 py-28 sm:px-6 md:py-40 lg:px-10"
    >
      <div className="mx-auto max-w-[90rem]">
        <h2 id="hizmet-kartlari-baslik" data-bol className="bolum-baslik max-w-[14ch]">
          İşinize göre dört yol.
        </h2>
        <p data-belir className="mt-6 max-w-[34rem] text-lg leading-relaxed text-soluk">
          Her birinin canlı örneği, bütün özellikleri ve fiyatı kendi sayfasında.
        </p>

        <ul className="mt-14 grid gap-4 md:mt-20 md:grid-cols-6 md:gap-5">
          {HIZMETLER.map((h, i) => (
            <li key={h.adres} data-belir data-gecikme={String(i * 0.08)} className={yerlesim[h.adres]}>
              <Link
                href={`/hizmetler/${h.adres}`}
                data-isik
                className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-cizgi bg-gece-2 p-6 transition-[border-color,transform] duration-500 ease-yay hover:-translate-y-1 hover:border-alev/40 sm:p-8"
              >
                <span className="isik-katmani" aria-hidden="true" />
                <div className="relative h-44" aria-hidden="true">
                  {gorsel[h.adres]}
                </div>
                <div className="relative mt-8 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="ara-baslik">{h.ad}</h3>
                    <p className="mt-3 max-w-[30rem] leading-relaxed text-soluk">{h.baslik}</p>
                  </div>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-cizgi-guclu transition-[background-color,border-color,color,transform] duration-500 ease-yay group-hover:rotate-45 group-hover:border-alev group-hover:bg-alev group-hover:text-gece">
                    <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
                  </span>
                </div>
                <p className="relative mt-6 border-t border-cizgi pt-5 text-[0.9375rem]">
                  <span className="font-medium text-alev">{hizmetFiyatEtiketi(h.adres)}</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
