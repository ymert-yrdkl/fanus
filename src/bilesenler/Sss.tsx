import { Plus } from "@phosphor-icons/react/dist/ssr";
import type { Soru } from "@/site/icerik";
import BolumBasi from "./BolumBasi";

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
    <section
      aria-labelledby="sss-baslik"
      className="relative z-10 bg-gece px-4 pt-10 pb-16 sm:px-6 md:pt-14 md:pb-24 lg:px-10"
    >
      <div className="mx-auto max-w-[90rem]">
        <BolumBasi id="sss-baslik" etiket="Sorular" baslik={baslik} metin={metin}>
          <ul className="mt-10 border-t border-cizgi-guclu md:mt-14">
            {sorular.map((s, i) => (
              <li key={s.soru} data-belir data-gecikme={String(i * 0.05)} className="border-b border-cizgi-guclu">
                <details className="sss group" name="sss">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left md:py-6">
                    <span className="font-baslik text-xl font-medium tracking-[-0.015em] md:text-2xl">{s.soru}</span>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-cizgi-guclu transition-[transform,background-color,border-color,color] duration-500 ease-yay group-open:rotate-45 group-open:border-vurgu group-open:bg-vurgu group-open:text-gece">
                      <Plus size={16} aria-hidden="true" />
                    </span>
                  </summary>
                  <p className="max-w-[40rem] pb-7 leading-relaxed text-soluk">{s.cevap}</p>
                </details>
              </li>
            ))}
          </ul>
        </BolumBasi>
      </div>
    </section>
  );
}
