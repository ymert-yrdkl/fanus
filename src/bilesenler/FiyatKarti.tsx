import Link from "next/link";
import { ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { fiyatYaz, KDV_EKI, kdvEki, type Paket } from "@/site/icerik";
import { dugmeSinifi } from "./dugme";

/**
 * Bir paketin fiyat kartı: üstte koyu zeminde ad, özet ve büyük rakam (sayarak belirir), altta kâğıt zeminde
 * özellikler ve eylemler.
 */
export default function FiyatKarti({
  paket,
  detayLinki = true,
  gecikme = 0,
}: {
  paket: Paket;
  detayLinki?: boolean;
  gecikme?: number;
}) {
  return (
    <article
      data-belir
      data-gecikme={String(gecikme)}
      aria-labelledby={`paket-${paket.kod}`}
      className="flex flex-col overflow-hidden rounded-[1.25rem] border border-cizgi-guclu"
    >
      <div data-zemin="koyu" className="p-6 sm:p-8">
        <h3 id={`paket-${paket.kod}`} className="ara-baslik">
          {paket.ad}
        </h3>
        <p className="mt-3 max-w-[30rem] leading-relaxed text-soluk">{paket.ozet}</p>

        {paket.fiyat !== null ? (
          <>
            <p className="rakam mt-8 flex flex-wrap items-baseline gap-x-2 text-[clamp(2.5rem,4vw,3.5rem)] leading-none">
              <span>
                ₺<span data-sayac={paket.fiyat}>{paket.fiyat.toLocaleString("tr-TR")}</span>
              </span>
              <span className="text-base font-normal tracking-normal text-soluk">
                {kdvEki(paket.baslangic)}
                {paket.baslangic && " başlayan"}
              </span>
            </p>
            {paket.yenileme !== null && (
              <p className="mt-3 text-[0.9375rem] text-soluk">
                Yıllık yenileme <span className="font-medium text-alev">{fiyatYaz(paket.yenileme)}</span> {KDV_EKI}
              </p>
            )}
          </>
        ) : (
          <>
            <p className="rakam mt-8 text-[clamp(2rem,3.2vw,2.75rem)] leading-none">Teklif üzerine</p>
            <p className="mt-3 text-[0.9375rem] text-soluk">Bağlanacak sistemlere göre yazılı fiyat</p>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <ul className="grid flex-1 content-start gap-3">
          {paket.maddeler.map((m) => (
            <li key={m} className="flex items-start gap-3 text-[0.9375rem]">
              <Check size={17} weight="bold" className="mt-0.5 shrink-0 text-alev" aria-hidden="true" />
              {m}
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link href={`/iletisim?paket=${paket.kod}`} data-miknatis className={dugmeSinifi.alev}>
            Bu paketle başla
          </Link>
          {detayLinki && (
            <Link
              href={`/hizmetler/${paket.hizmet}`}
              className="group/detay inline-flex min-h-12 items-center gap-1.5 px-2 text-[0.9375rem] text-soluk transition-colors hover:text-krem"
            >
              Ayrıntılar
              <ArrowUpRight
                size={15}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover/detay:translate-x-0.5 group-hover/detay:-translate-y-0.5"
              />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
