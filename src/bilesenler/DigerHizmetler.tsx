import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { HIZMETLER, hizmetFiyatEtiketi, type HizmetAdresi } from "@/site/icerik";

/** Hizmet sayfasının sonunda diğer hizmetlere bağlantılar: ince çizgili satırlar. */
export default function DigerHizmetler({ simdiki }: { simdiki: HizmetAdresi }) {
  const digerleri = HIZMETLER.filter((h) => h.adres !== simdiki);
  return (
    <section
      aria-labelledby="diger-hizmetler"
      className="relative z-10 bg-gece px-4 pt-6 pb-16 sm:px-6 md:pb-24 lg:px-10"
    >
      <div className="mx-auto max-w-[90rem]">
        <h2 id="diger-hizmetler" data-belir className="etiket">
          Diğer hizmetler
        </h2>
        <ul className="mt-5">
          {digerleri.map((h, i) => (
            <li
              key={h.adres}
              data-belir
              data-gecikme={String(i * 0.05)}
              className="border-t border-cizgi-guclu last:border-b"
            >
              <Link
                href={`/hizmetler/${h.adres}`}
                className="group grid grid-cols-[1fr_auto] items-center gap-x-5 gap-y-1 py-5 md:grid-cols-12 md:gap-x-8 md:py-6"
              >
                <span className="ara-baslik transition-transform duration-500 ease-yay md:col-span-6 md:group-hover:translate-x-3">
                  {h.ad}
                </span>
                <span className="rakam col-start-1 text-base text-soluk md:col-span-5 md:col-start-7 md:text-right md:text-lg">
                  {hizmetFiyatEtiketi(h.adres)}
                </span>
                <span className="row-span-2 flex size-11 items-center justify-center justify-self-end rounded-full border border-cizgi-guclu transition-[background-color,border-color,color,transform] duration-500 ease-yay group-hover:rotate-45 group-hover:border-vurgu group-hover:bg-vurgu group-hover:text-gece md:col-span-1 md:row-span-1">
                  <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
