import GecisBandi from "@/bilesenler/GecisBandi";
import type { Metadata } from "next";
import { EnvelopeSimple, Phone, WhatsappLogo, VideoCamera } from "@phosphor-icons/react/dist/ssr";
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
        <GecisBandi boy="kisa" />
        <section
          data-zemin="acik"
          aria-labelledby="kanallar"
          className="relative z-10 bg-gece px-4 py-20 sm:px-6 md:py-28 lg:px-10"
        >
          <div className="mx-auto max-w-[90rem]">
            <h2 id="kanallar" data-bol className="bolum-baslik max-w-[14ch]">
              Doğrudan da yazabilirsiniz.
            </h2>
            <ul className="mt-12 grid gap-4 md:grid-cols-3">
              {kanallar.map((k, i) => (
                <li key={k.ad} data-belir data-gecikme={String(i * 0.07)}>
                  <a
                    href={k.adres}
                    {...(k.adres.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
                    data-isik
                    className="group relative flex h-full flex-col gap-8 overflow-hidden rounded-[1.75rem] border border-cizgi bg-gece-2 p-6 transition-colors duration-500 hover:border-alev/40 sm:p-8"
                  >
                    <span className="isik-katmani" aria-hidden="true" />
                    <span className="relative flex size-12 items-center justify-center rounded-2xl bg-gece-4 text-alev transition-colors duration-500 group-hover:bg-alev group-hover:text-gece">
                      <k.Ikon size={24} aria-hidden="true" />
                    </span>
                    <span className="relative">
                      <span className="block text-sm text-soluk">{k.ad}</span>
                      <span className="mt-1 block font-baslik text-xl font-semibold break-all">{k.deger}</span>
                    </span>
                  </a>
                </li>
              ))}
              <li data-belir data-gecikme="0.2">
                <div className="relative flex h-full flex-col gap-8 rounded-[1.75rem] border border-cizgi bg-gece-2 p-6 sm:p-8">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-gece-4 text-alev">
                    <VideoCamera size={24} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm text-soluk">Görüşme</span>
                    <span className="mt-1 block leading-relaxed">
                      Türkiye&apos;nin her yerinden çalışıyoruz; görüşmeler telefonla ya da görüntülü yapılır.
                    </span>
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
