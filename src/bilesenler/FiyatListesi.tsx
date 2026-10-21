import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { fiyatYaz, kdvEki, kdvHaricYaz, PAKETLER, YILLIK_YENILEME } from "@/site/icerik";

/** Ana sayfadaki fiyat listesi: menü tahtası gibi, noktalı çizgiyle fiyata uzanan satırlar. */
export default function FiyatListesi() {
  return (
    <section
      aria-labelledby="fiyat-listesi-baslik"
      className="relative z-10 bg-gece px-4 py-28 sm:px-6 md:py-40 lg:px-10"
    >
      <div className="mx-auto grid max-w-[90rem] gap-14 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <h2 id="fiyat-listesi-baslik" data-bol className="bolum-baslik max-w-[11ch]">
            Fiyatı baştan yazıyoruz.
          </h2>
          <p data-belir className="mt-6 max-w-[24rem] text-lg leading-relaxed text-soluk">
            Her pakette yıllık yenileme {kdvHaricYaz(YILLIK_YENILEME)}. Paketlerin bütün özellikleri fiyatlar
            sayfasında.
          </p>
          <Link
            href="/fiyatlar"
            data-belir
            className="group mt-8 inline-flex min-h-12 items-center gap-2 text-[0.9375rem] font-medium text-alev"
          >
            Bütün özellikleri gör
            <ArrowRight
              size={16}
              weight="bold"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
        <ul className="md:col-span-8 md:col-start-5">
          {PAKETLER.map((p, i) => (
            <li key={p.kod} data-belir data-gecikme={String(i * 0.06)}>
              <Link
                href={`/hizmetler/${p.hizmet}`}
                className="group relative flex items-baseline gap-4 border-b border-cizgi py-6 transition-colors duration-300 first:border-t hover:border-alev/50 md:py-7"
              >
                <span className="font-baslik text-[clamp(1.375rem,2.4vw,2rem)] leading-tight font-semibold tracking-[-0.02em] transition-colors duration-300 group-hover:text-alev">
                  {p.ad}
                </span>
                <span
                  aria-hidden="true"
                  className="mb-2 hidden flex-1 border-b border-dotted border-cizgi-guclu sm:block"
                />
                <span className="ml-auto shrink-0 text-right">
                  <span className="block font-baslik text-[clamp(1.375rem,2.4vw,2rem)] leading-tight font-semibold tabular-nums">
                    {p.fiyat !== null ? fiyatYaz(p.fiyat) : "Teklif üzerine"}
                    {p.fiyat !== null && (
                      <span className="text-base font-normal text-soluk"> {kdvEki(p.baslangic)}</span>
                    )}
                  </span>
                  {p.yenileme !== null && (
                    <span className="mt-1 block text-sm text-soluk">yıllık {kdvHaricYaz(p.yenileme)}</span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
