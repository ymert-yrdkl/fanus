import Link from "next/link";
import type { RehberBolumu } from "@/site/rehber";

/** Metindeki "[bağlantı metni](/yol)" parçalarını site içi bağlantıya çevirir. */
function Satir({ metin }: { metin: string }) {
  const parcalar = metin.split(/(\[[^\]]+\]\(\/[^)]*\))/g);
  return (
    <>
      {parcalar.map((parca, i) => {
        const eslesme = parca.match(/^\[([^\]]+)\]\((\/[^)]*)\)$/);
        if (!eslesme) return parca;
        return (
          <Link
            key={i}
            href={eslesme[2]!}
            className="text-vurgu underline decoration-current/35 underline-offset-4 transition-colors hover:decoration-current"
          >
            {eslesme[1]}
          </Link>
        );
      })}
    </>
  );
}

/** Rehber yazısının gövdesi: her bölüm bir H2, paragraflar ve isteğe bağlı madde listesi. */
export default function RehberMetni({ bolumler }: { bolumler: RehberBolumu[] }) {
  return (
    <div className="grid gap-12 md:gap-16">
      {bolumler.map((b, i) => (
        <section key={b.baslik} aria-labelledby={`bolum-${i}`}>
          <h2 id={`bolum-${i}`} data-belir className="ara-baslik">
            {b.baslik}
          </h2>
          <div className="mt-5 grid gap-4 text-lg leading-relaxed text-krem">
            {b.paragraflar.map((p, j) => (
              <p key={j}>
                <Satir metin={p} />
              </p>
            ))}
          </div>
          {b.maddeler && (
            <ul className="mt-5 grid gap-3 text-lg leading-relaxed text-krem">
              {b.maddeler.map((m, j) => (
                <li key={j} className="flex gap-3.5">
                  <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-vurgu" />
                  <span>
                    <Satir metin={m} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
