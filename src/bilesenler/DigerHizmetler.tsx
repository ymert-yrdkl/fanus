import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { HIZMETLER, hizmetFiyatEtiketi, type HizmetAdresi } from "@/site/icerik";

/** Hizmet sayfasının sonunda diğer hizmetlere bağlantılar. */
export default function DigerHizmetler({ simdiki }: { simdiki: HizmetAdresi }) {
  const digerleri = HIZMETLER.filter((h) => h.adres !== simdiki);
  return (
    <section aria-labelledby="diger-hizmetler" className="relative z-10 bg-gece px-4 pb-28 sm:px-6 md:pb-40 lg:px-10">
      <div className="mx-auto max-w-[90rem]">
        <h2 id="diger-hizmetler" data-belir className="etiket">
          Diğer hizmetler
        </h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {digerleri.map((h, i) => (
            <li key={h.adres} data-belir data-gecikme={String(i * 0.07)}>
              <Link
                href={`/hizmetler/${h.adres}`}
                data-isik
                className="group relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-[1.75rem] border border-cizgi bg-gece-2 p-6 transition-[border-color,transform] duration-500 ease-yay hover:-translate-y-1 hover:border-alev/40"
              >
                <span className="isik-katmani" aria-hidden="true" />
                <span className="relative flex items-start justify-between gap-4">
                  <span className="ara-baslik">{h.ad}</span>
                  <ArrowUpRight
                    size={20}
                    aria-hidden="true"
                    className="shrink-0 text-soluk transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-alev"
                  />
                </span>
                <span className="relative text-[0.9375rem] text-alev">{hizmetFiyatEtiketi(h.adres)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
