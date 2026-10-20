import { Plus } from "@phosphor-icons/react/dist/ssr";
import type { Soru } from "@/site/icerik";

/** Sık sorulanlar: <details> ile JS'siz çalışır; açılış yüksekliği CSS ile yumuşar. */
export default function Sss({
  sorular,
  baslik = "Sık sorulanlar.",
  metin = "Burada olmayan bir sorunuz varsa yazın; kısa ve net cevap veririz.",
}: {
  sorular: Soru[];
  baslik?: string;
  metin?: string;
}) {
  return (
    <section aria-labelledby="sss-baslik" className="relative z-10 bg-gece px-4 py-28 sm:px-6 md:py-40 lg:px-10">
      <div className="mx-auto grid max-w-[90rem] gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <h2 id="sss-baslik" data-bol className="bolum-baslik max-w-[12ch]">
              {baslik}
            </h2>
            <p data-belir className="mt-6 max-w-[26rem] text-lg leading-relaxed text-soluk">
              {metin}
            </p>
          </div>
        </div>
        <div className="md:col-span-7">
          <ul className="border-t border-cizgi">
            {sorular.map((s, i) => (
              <li key={s.soru} data-belir data-gecikme={String(i * 0.05)} className="border-b border-cizgi">
                <details className="sss group" name="sss">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-6 text-left">
                    <span className="text-lg font-medium md:text-xl">{s.soru}</span>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-cizgi-guclu transition-[transform,background-color,border-color,color] duration-500 ease-yay group-open:rotate-45 group-open:border-alev group-open:bg-alev group-open:text-gece">
                      <Plus size={16} aria-hidden="true" />
                    </span>
                  </summary>
                  <p className="max-w-[40rem] pb-7 leading-relaxed text-soluk">{s.cevap}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
