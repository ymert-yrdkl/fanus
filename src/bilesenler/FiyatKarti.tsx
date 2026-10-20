import Link from "next/link";
import { ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { fiyatYaz, type Paket } from "@/site/icerik";
import { dugmeSinifi } from "./dugme";

/** Bir paketin fiyat kartı: fiyat (sayarak belirir), yıllık yenileme, özellikler ve eylemler. */
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
      data-isik
      data-belir
      data-gecikme={String(gecikme)}
      aria-labelledby={`paket-${paket.kod}`}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-cizgi bg-gece-2 p-6 transition-colors duration-500 hover:border-alev/40 sm:p-8"
    >
      <div className="isik-katmani" aria-hidden="true" />
      <h3 id={`paket-${paket.kod}`} className="ara-baslik relative">
        {paket.ad}
      </h3>
      <p className="relative mt-3 leading-relaxed text-soluk">{paket.ozet}</p>

      <div className="relative mt-8 border-t border-cizgi pt-7">
        {paket.fiyat !== null ? (
          <>
            <p className="flex items-baseline gap-2">
              <span className="font-baslik text-[clamp(2.75rem,4vw,3.5rem)] leading-none font-semibold tracking-[-0.035em] text-krem tabular-nums">
                ₺<span data-sayac={paket.fiyat}>{paket.fiyat.toLocaleString("tr-TR")}</span>
              </span>
              {paket.baslangic && <span className="text-soluk">&apos;dan başlayan</span>}
            </p>
            {paket.yenileme !== null && (
              <p className="mt-3 text-[0.9375rem] text-soluk">
                Yıllık yenileme <span className="font-medium text-alev">{fiyatYaz(paket.yenileme)}</span>
              </p>
            )}
          </>
        ) : (
          <>
            <p className="font-baslik text-[clamp(2.25rem,3.4vw,3rem)] leading-none font-semibold tracking-[-0.03em]">
              Teklif üzerine
            </p>
            <p className="mt-3 text-[0.9375rem] text-soluk">Bağlanacak sistemlere göre yazılı fiyat</p>
          </>
        )}
      </div>

      <ul className="relative mt-8 grid flex-1 content-start gap-3">
        {paket.maddeler.map((m) => (
          <li key={m} className="flex items-start gap-3 text-[0.9375rem]">
            <Check size={17} weight="bold" className="mt-0.5 shrink-0 text-alev" aria-hidden="true" />
            {m}
          </li>
        ))}
      </ul>

      <div className="relative mt-9 flex flex-wrap items-center gap-3">
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
    </article>
  );
}
