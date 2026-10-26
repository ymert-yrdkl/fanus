import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { HIZMETLER, hizmetFiyatEtiketi, type HizmetAdresi } from "@/site/icerik";
import BolumBasi from "./BolumBasi";
import HizmetMinyaturu from "./demolar/HizmetMinyaturleri";

/**
 * Vitrinin düzeni (6 sütunlu ızgara): 4+2, 2+4, 6. Her satır tam dolar. Sıra burada tutulur; HIZMETLER'in sırası
 * (otomasyon mobilden önce) kullanılınca tam genişlikteki kart satıra sığmayıp alta kayıyor, iki satırda boşluk
 * kalıyordu (Yusuf, 25 Ekim 2026: "düzensiz").
 */
const DUZEN: { adres: HizmetAdresi; sinif: string }[] = [
  { adres: "e-ticaret", sinif: "md:col-span-4" },
  { adres: "kurumsal-site", sinif: "md:col-span-2" },
  { adres: "qr-menu", sinif: "md:col-span-2" },
  { adres: "mobil-uygulama", sinif: "md:col-span-4" },
  { adres: "ozel-yazilim", sinif: "md:col-span-6" },
];

/**
 * Ana sayfadaki hizmet vitrini: farklı genişlikte beş kart (yukarıdaki DUZEN). Üstte hizmetin kendi kendine dönen
 * minyatürü, altında ad, bir cümle ve ok; en altta çizgiyle ayrılmış fiyat. Her kart hizmetin kendi sayfasına gider;
 * üzerine gelince hafifçe kalkar.
 */
export default function HizmetVitrini({ qrSvg }: { qrSvg: string }) {
  const kartlar = DUZEN.flatMap(({ adres, sinif }) => {
    const h = HIZMETLER.find((x) => x.adres === adres);
    return h ? [{ h, sinif }] : [];
  });

  return (
    <section
      aria-labelledby="hizmet-vitrini-baslik"
      className="relative z-10 bg-gece px-4 pt-10 pb-16 sm:px-6 md:pt-14 md:pb-24 lg:px-10"
    >
      <div className="mx-auto max-w-[90rem]">
        <BolumBasi
          id="hizmet-vitrini-baslik"
          etiket="Hizmetler"
          baslik="Web sitesinden cebe ve üretim hattına."
          metin="Beş yol; her birinin canlı örneği, bütün özellikleri ve fiyatı kendi sayfasında."
        />

        <ul className="mt-10 grid gap-4 md:mt-16 md:grid-cols-6 md:gap-5">
          {kartlar.map(({ h, sinif }, i) => (
            <li key={h.adres} data-belir data-gecikme={String(i * 0.06)} className={sinif}>
              <Link
                href={`/hizmetler/${h.adres}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-cizgi-guclu bg-gece-2 p-5 transition-[border-color,transform] duration-500 ease-yay hover:-translate-y-1 hover:border-vurgu sm:p-7"
              >
                <div className="relative h-44" aria-hidden="true">
                  <HizmetMinyaturu adres={h.adres} qrSvg={qrSvg} />
                </div>
                <div className="mt-7 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="ara-baslik">{h.ad}</h3>
                    <p className="mt-2.5 max-w-[30rem] leading-relaxed text-soluk">{h.baslik}</p>
                  </div>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-cizgi-guclu transition-[background-color,border-color,color,transform] duration-500 ease-yay group-hover:rotate-45 group-hover:border-vurgu group-hover:bg-vurgu group-hover:text-gece">
                    <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
                  </span>
                </div>
                <p className="rakam mt-auto border-t border-cizgi-guclu pt-5 text-base">
                  {hizmetFiyatEtiketi(h.adres)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
