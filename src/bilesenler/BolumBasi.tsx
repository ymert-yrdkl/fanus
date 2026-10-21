import type { ReactNode } from "react";

/**
 * Bölüm başı: üstte ince çizgi, solda mono etiket, sağda büyük başlık ve kısa metin (dergi sayfası gibi).
 * `children` başlığın altına gelir (bağlantı, giriş kutusu...).
 */
export default function BolumBasi({
  id,
  etiket,
  baslik,
  metin,
  children,
}: {
  id: string;
  etiket: string;
  baslik: string;
  metin?: string;
  children?: ReactNode;
}) {
  return (
    <div className="grid gap-5 border-t border-cizgi-guclu pt-5 md:grid-cols-12 md:gap-8 md:pt-7">
      <p data-belir className="etiket md:col-span-3">
        {etiket}
      </p>
      <div className="md:col-span-9 lg:col-span-8">
        <h2 id={id} data-bol className="bolum-baslik max-w-[16ch]">
          {baslik}
        </h2>
        {metin && (
          <p data-belir className="mt-5 max-w-[36rem] text-lg leading-relaxed text-soluk">
            {metin}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
