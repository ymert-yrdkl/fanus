import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { dugmeSinifi } from "./dugme";

/** Sayfa sonlarındaki çağrı: afiş gibi büyük başlık, altta iki düğme. */
export default function CagriBandi({
  baslik = "Sıradaki fanus sizin olsun.",
  metin = "Ne istediğinizi kısaca yazın; kapsamı ve fiyatı birlikte netleştirelim.",
  ikinci = { ad: "Fiyatlar", adres: "/fiyatlar" },
}: {
  baslik?: string;
  metin?: string;
  ikinci?: { ad: string; adres: string };
}) {
  return (
    <section
      aria-labelledby="cagri-baslik"
      className="relative z-10 overflow-hidden bg-gece px-4 pt-10 pb-24 sm:px-6 md:pt-14 md:pb-36 lg:px-10"
    >
      <div className="mx-auto max-w-[90rem] border-t border-cizgi-guclu pt-6 md:pt-8">
        <p data-belir className="etiket">
          Teklif
        </p>
        <h2 id="cagri-baslik" data-bol className="dev-baslik mt-6 max-w-[13ch] md:mt-8">
          {baslik}
        </h2>
        <div className="mt-9 grid gap-7 md:mt-12 md:grid-cols-12 md:items-end md:gap-8">
          <p data-belir className="max-w-[30rem] text-lg leading-relaxed text-soluk md:col-span-5">
            {metin}
          </p>
          <div
            data-belir
            data-gecikme="0.1"
            className="flex flex-wrap gap-3 md:col-span-6 md:col-start-7 md:justify-end"
          >
            <Link href="/iletisim" data-miknatis className={dugmeSinifi.alev}>
              Teklif al
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </Link>
            <Link href={ikinci.adres} className={dugmeSinifi.cerceve}>
              {ikinci.ad}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
