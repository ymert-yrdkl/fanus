import GecisBandi from "@/bilesenler/GecisBandi";
import type { Metadata } from "next";
import { ArrowUpRight, EnvelopeSimple, Phone, WhatsappLogo, VideoCamera } from "@phosphor-icons/react/dist/ssr";
import BolumBasi from "@/bilesenler/BolumBasi";
import Teklif from "@/bilesenler/Teklif";
import FanusSahnesi from "@/sahne/FanusSahnesi";
import { SITE } from "@/site/ayarlar";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Ne yaptırmak istediğinizi seçin, mesajınız hazırlansın; WhatsApp'tan ya da e-postayla gönderin. E-ticaret, kurumsal site, QR menü ve web otomasyonu için teklif alın.",
  alternates: { canonical: "/iletisim" },
};

export default function IletisimSayfasi() {
  const kanallar = [
    { ad: "E-posta", deger: SITE.eposta, adres: `mailto:${SITE.eposta}`, Ikon: EnvelopeSimple },
    ...(SITE.whatsapp
      ? [{ ad: "WhatsApp", deger: `+${SITE.whatsapp}`, adres: `https://wa.me/${SITE.whatsapp}`, Ikon: WhatsappLogo }]
      : []),
    ...(SITE.telefon
      ? [{ ad: "Telefon", deger: SITE.telefon, adres: `tel:${SITE.telefon.replace(/\s/g, "")}`, Ikon: Phone }]
      : []),
  ];

  return (
    <>
      <FanusSahnesi poz="son" />
      <main id="icerik">
        <Teklif />
        <GecisBandi />
        <section
          data-zemin="acik"
          aria-labelledby="kanallar"
          className="relative z-10 bg-gece px-4 pt-10 pb-20 sm:px-6 md:pt-14 md:pb-28 lg:px-10"
        >
          <div className="mx-auto max-w-[90rem]">
            <BolumBasi id="kanallar" etiket="Doğrudan" baslik="Doğrudan da yazabilirsiniz.">
              <ul className="mt-10 border-t border-cizgi-guclu md:mt-14">
                {kanallar.map((k, i) => (
                  <li key={k.ad} data-belir data-gecikme={String(i * 0.07)} className="border-b border-cizgi-guclu">
                    <a
                      href={k.adres}
                      {...(k.adres.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
                      className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-5"
                    >
                      <span className="flex size-12 items-center justify-center rounded-full border border-cizgi-guclu text-alev transition-colors duration-500 group-hover:border-alev group-hover:bg-alev group-hover:text-gece">
                        <k.Ikon size={22} aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="etiket block">{k.ad}</span>
                        <span className="mt-1 block font-baslik text-xl font-semibold tracking-[-0.015em] break-all md:text-2xl">
                          {k.deger}
                        </span>
                      </span>
                      <ArrowUpRight
                        size={20}
                        aria-hidden="true"
                        className="text-soluk transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-alev"
                      />
                    </a>
                  </li>
                ))}
                <li data-belir data-gecikme="0.2" className="border-b border-cizgi-guclu">
                  <div className="grid grid-cols-[auto_1fr] items-center gap-5 py-5">
                    <span className="flex size-12 items-center justify-center rounded-full border border-cizgi-guclu text-alev">
                      <VideoCamera size={22} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="etiket block">Görüşme</span>
                      <span className="mt-1 block leading-relaxed">
                        Türkiye&apos;nin her yerinden çalışıyoruz; görüşmeler telefonla ya da görüntülü yapılır.
                      </span>
                    </span>
                  </div>
                </li>
              </ul>
            </BolumBasi>
          </div>
        </section>
      </main>
    </>
  );
}
