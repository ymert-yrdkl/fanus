"use client";

import { useRef, useState } from "react";
import { WhatsappLogo, EnvelopeSimple, Check } from "@phosphor-icons/react/dist/ssr";
import { gsap, GENIS, ScrollTrigger, useGSAP } from "@/hareket/gsap";
import { sahneDurumu } from "@/sahne/durum";
import { SITE, epostaBaglantisi, whatsappBaglantisi } from "@/site/ayarlar";
import { HIZMETLER } from "@/site/icerik";
import { AD_SINIRI, useIsletmeAdi } from "./IsletmeAdi";
import { dugmeSinifi } from "./dugme";

const SECENEKLER = [...HIZMETLER.map((h) => h.ad), "Henüz emin değilim"];
const NOT_SINIRI = 600;

/** ["a", "b", "c"] → "a, b ve c" */
function veIleBagla(liste: string[]) {
  if (liste.length <= 1) return liste.join("");
  return `${liste.slice(0, -1).join(", ")} ve ${liste.at(-1)}`;
}

export function mesajYaz(ad: string, secilenler: string[], not: string) {
  const isler = secilenler.filter((s) => s !== "Henüz emin değilim").map((s) => s.toLocaleLowerCase("tr"));
  const kim = ad.trim() ? `${ad.trim()} için ` : "";
  const ne =
    isler.length > 0
      ? `${veIleBagla(isler)} hakkında teklif almak istiyorum.`
      : "bir web projesi hakkında görüşmek istiyorum.";
  const satirlar = [`Merhaba fanus, ${kim}${ne}`];
  if (not.trim()) satirlar.push("", not.trim());
  return satirlar.join("\n");
}

export default function Teklif() {
  const kok = useRef<HTMLElement>(null);
  const { ad, setAd } = useIsletmeAdi();
  const [secilenler, setSecilenler] = useState<string[]>([]);
  const [not, setNot] = useState("");

  const mesaj = mesajYaz(ad, secilenler, not);
  const whatsapp = whatsappBaglantisi(mesaj);
  const eposta = epostaBaglantisi(ad.trim() ? `${ad.trim()} için teklif` : "Teklif isteği", mesaj);

  const sec = (secenek: string) =>
    setSecilenler((onceki) => (onceki.includes(secenek) ? onceki.filter((s) => s !== secenek) : [...onceki, secenek]));

  // Bu bölüme gelince fanus geri döner (masaüstünde sağda, telefonda arkada soluk)
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ genis: GENIS }, (baglam) => {
        const { genis } = baglam.conditions as { genis: boolean };
        Object.assign(
          sahneDurumu.son,
          genis
            ? { x: 0.26, y: 0.04, boy: 0.58, kapak: 0, isik: 1.7, gorunur: 1 }
            : { x: 0, y: -0.22, boy: 0.34, kapak: 0, isik: 1.5, gorunur: 0.45 },
        );
        const azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const t = ScrollTrigger.create({
          trigger: kok.current,
          start: "top 55%",
          end: "bottom top",
          onToggle: (tetik) =>
            gsap.to(sahneDurumu, {
              sonKarisim: tetik.isActive ? 1 : 0,
              duration: azHareket ? 0 : tetik.isActive ? 1.6 : 0.6,
              ease: "power2.inOut",
              overwrite: true,
            }),
        });
        return () => t.kill();
      });
    },
    { scope: kok },
  );

  return (
    <section
      ref={kok}
      id="teklif"
      aria-labelledby="teklif-baslik"
      className="relative z-10 px-4 pt-28 pb-24 sm:px-6 md:min-h-dvh md:pt-40 md:pb-32 lg:px-10"
    >
      <div className="mx-auto max-w-[90rem]">
        <div className="max-w-[40rem]">
          <h2 id="teklif-baslik" data-bol className="dev-baslik">
            Sıradaki fanus sizin olsun.
          </h2>
          <p data-belir className="mt-6 max-w-[32rem] text-lg leading-relaxed text-soluk">
            Ne istediğinizi seçin, mesajınız hazırlansın. Gerisini görüşmede birlikte netleştiririz.
          </p>

          <form
            data-belir
            data-gecikme="0.1"
            onSubmit={(olay) => olay.preventDefault()}
            className="mt-10 grid gap-7 rounded-[2rem] border border-cizgi bg-gece-2/85 p-5 backdrop-blur-xl sm:p-8"
          >
            <fieldset>
              <legend className="text-[0.9375rem] font-medium">Ne yaptırmak istiyorsunuz?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {SECENEKLER.map((s) => {
                  const secili = secilenler.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={secili}
                      onClick={() => sec(s)}
                      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm transition-[background-color,border-color,color] duration-300 ${
                        secili ? "border-alev bg-alev text-gece" : "border-cizgi-guclu text-krem hover:border-krem/50"
                      }`}
                    >
                      {secili && <Check size={14} weight="bold" aria-hidden="true" />}
                      {s}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <label htmlFor="teklif-ad" className="text-[0.9375rem] font-medium">
                İşletmenizin adı
              </label>
              <input
                id="teklif-ad"
                type="text"
                value={ad}
                maxLength={AD_SINIRI}
                autoComplete="organization"
                onChange={(olay) => setAd(olay.target.value)}
                className="mt-2 h-13 w-full rounded-2xl border border-cizgi-guclu bg-gece px-4 text-krem transition-colors placeholder:text-silik hover:border-krem/40 focus:border-alev focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="teklif-not" className="text-[0.9375rem] font-medium">
                Kısaca anlatın <span className="font-normal text-soluk">(isteğe bağlı)</span>
              </label>
              <textarea
                id="teklif-not"
                rows={3}
                value={not}
                maxLength={NOT_SINIRI}
                onChange={(olay) => setNot(olay.target.value)}
                placeholder="Örneğin: 40 ürünlük bir mağaza, kapıda ödeme de olsun."
                className="mt-2 w-full resize-none rounded-2xl border border-cizgi-guclu bg-gece px-4 py-3 text-krem transition-colors placeholder:text-silik hover:border-krem/40 focus:border-alev focus:outline-none"
              />
            </div>

            <div>
              <p className="text-sm text-soluk">Gönderilecek mesaj</p>
              <p
                className="mt-2 rounded-2xl rounded-tl-sm border border-cizgi bg-gece-3 p-4 text-[0.9375rem] leading-relaxed whitespace-pre-line"
                aria-live="polite"
              >
                {mesaj}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {whatsapp && (
                <a href={whatsapp} target="_blank" rel="noopener" data-miknatis className={dugmeSinifi.alev}>
                  <WhatsappLogo size={20} weight="fill" aria-hidden="true" />
                  WhatsApp&apos;tan gönder
                </a>
              )}
              <a href={eposta} data-miknatis className={whatsapp ? dugmeSinifi.cerceve : dugmeSinifi.alev}>
                <EnvelopeSimple size={18} aria-hidden="true" />
                E-postayla gönder
              </a>
            </div>
          </form>

          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-[0.9375rem] text-soluk">
            <li>
              <a
                href={`mailto:${SITE.eposta}`}
                className="inline-flex min-h-11 items-center transition-colors hover:text-alev"
              >
                {SITE.eposta}
              </a>
            </li>
            {SITE.telefon && (
              <li>
                <a
                  href={`tel:${SITE.telefon.replace(/\s/g, "")}`}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-alev"
                >
                  {SITE.telefon}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
