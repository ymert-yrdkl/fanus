import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { fiyatYaz, kdvEki, kdvHaricYaz, PAKETLER, YENILEMEYE_DAHIL, YILLIK_YENILEME } from "@/site/icerik";
import BolumBasi from "./BolumBasi";

/**
 * Ana sayfadaki fiyat tahtası: gündüz sayfasının ortasında koyu bir tahta, paket adı solda, büyük rakam sağda,
 * satırlar ince çizgiyle ayrılır. Yıllık yenileme, kapsamı ve KDV notu altta.
 */
export default function FiyatListesi() {
  return (
    <section
      data-zemin="koyu"
      aria-labelledby="fiyat-listesi-baslik"
      className="relative z-10 bg-gece px-4 py-20 sm:px-6 md:py-28 lg:px-10"
    >
      <div className="mx-auto max-w-[90rem]">
        <BolumBasi
          id="fiyat-listesi-baslik"
          etiket="Fiyatlar"
          baslik="Fiyatı baştan yazıyoruz."
          metin="Her paketin fiyatı ve içeriği açık. Teklifte olmayan bir kalem sonradan faturaya eklenmez."
        />

        <ul className="mt-12 md:mt-20">
          {PAKETLER.map((p, i) => (
            <li
              key={p.kod}
              data-belir
              data-gecikme={String(i * 0.05)}
              className="border-t border-cizgi-guclu last:border-b"
            >
              <Link
                href={`/hizmetler/${p.hizmet}`}
                className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-6 md:grid-cols-12 md:items-center md:gap-x-8 md:py-7"
              >
                <span className="font-baslik text-[clamp(1.375rem,2.4vw,2.25rem)] leading-tight font-semibold tracking-[-0.025em] transition-colors duration-300 [font-variation-settings:'opsz'_96,'wdth'_90] group-hover:text-alev md:col-span-6">
                  {p.ad}
                </span>
                <span className="rakam text-right text-[clamp(1.75rem,3.6vw,3.5rem)] leading-none md:col-span-4 md:col-start-7">
                  {p.fiyat !== null ? fiyatYaz(p.fiyat) : "Teklifle"}
                  {p.fiyat !== null && (
                    <span className="ml-1.5 text-base font-normal tracking-normal text-soluk">
                      {kdvEki(p.baslangic)}
                    </span>
                  )}
                </span>
                <span className="col-start-1 text-sm text-soluk md:col-span-2 md:col-start-11 md:text-right md:text-[0.9375rem]">
                  {p.yenileme !== null ? `yıllık ${kdvHaricYaz(p.yenileme)}` : "sistemlere göre"}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-12 md:gap-8">
          <p data-belir className="text-[0.9375rem] leading-relaxed text-soluk md:col-span-7 md:col-start-4">
            Yıllık yenileme {kdvHaricYaz(YILLIK_YENILEME)}, her pakette aynı:{" "}
            {YENILEMEYE_DAHIL.map((m) => m.toLocaleLowerCase("tr-TR")).join(", ")}.
          </p>
          <Link
            href="/fiyatlar"
            data-belir
            className="group inline-flex min-h-12 items-center gap-2 text-[0.9375rem] font-medium text-alev md:col-span-2 md:col-start-11 md:justify-self-end"
          >
            Paket içerikleri
            <ArrowRight
              size={16}
              weight="bold"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
