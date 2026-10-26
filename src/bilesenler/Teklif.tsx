"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { WhatsappLogo, EnvelopeSimple, Check } from "@phosphor-icons/react/dist/ssr";
import { GENIS, useHareket } from "@/hareket/gsap";
import { sahneDurumu } from "@/sahne/durum";
import { epostaBaglantisi, whatsappBaglantisi } from "@/site/ayarlar";
import { kdvHaricYaz, PAKETLER, type PaketKodu } from "@/site/icerik";
import { AD_SINIRI, useIsletmeAdi } from "./IsletmeAdi";
import { dugmeSinifi } from "./dugme";

type Secenek = PaketKodu | "emin-degilim";

/** Mesajda cümle içinde geçen adlar */
const MESAJ_ADLARI: Record<PaketKodu, string> = {
  "tek-sayfa": "tek sayfa kurumsal site",
  kurumsal: "tam paket kurumsal site",
  "e-ticaret": "e-ticaret sitesi",
  "qr-menu": "QR menü",
  otomasyon: "özel yazılım ve otomasyon",
  mobil: "mobil uygulama",
};

const SECENEKLER: { kod: Secenek; ad: string; fiyat?: string }[] = [
  ...PAKETLER.map((p) => ({
    kod: p.kod as Secenek,
    ad: p.ad,
    fiyat: p.fiyat !== null ? kdvHaricYaz(p.fiyat, p.baslangic) : "teklifle",
  })),
  { kod: "emin-degilim", ad: "Henüz emin değilim" },
];
const NOT_SINIRI = 600;

/** ["a", "b", "c"] → "a, b ve c" */
function veIleBagla(liste: string[]) {
  if (liste.length <= 1) return liste.join("");
  return `${liste.slice(0, -1).join(", ")} ve ${liste.at(-1)}`;
}

export function mesajYaz(ad: string, secilenler: Secenek[], not: string) {
  const isler = secilenler.filter((s): s is PaketKodu => s !== "emin-degilim").map((s) => MESAJ_ADLARI[s]);
  const kim = ad.trim() ? `${ad.trim()} için ` : "";
  const ne =
    isler.length > 0
      ? `${veIleBagla(isler)} hakkında teklif almak istiyorum.`
      : "bir web projesi hakkında görüşmek istiyorum.";
  const satirlar = [`Merhaba fanussoft, ${kim}${ne}`];
  if (not.trim()) satirlar.push("", not.trim());
  return satirlar.join("\n");
}

/**
 * Fiyat kartından gelindiyse (?paket=e-ticaret) o paket seçili gelir. Adres useSyncExternalStore ile okunur:
 * sunucuda ve ilk çizimde boş, hemen ardından gerçek değer. (useSearchParams + Suspense, formu yedek kopyadan
 * gerçeğine değiştiriyordu; belirme animasyonu eski kopyaya bağlı kaldığı için form görünmez kalıyordu.)
 */
const adresAbone = (degisti: () => void) => {
  window.addEventListener("popstate", degisti);
  return () => window.removeEventListener("popstate", degisti);
};
function adrestekiPaket(arama: string): Secenek | null {
  const paket = new URLSearchParams(arama).get("paket");
  return SECENEKLER.find((s) => s.kod === paket)?.kod ?? null;
}

/** İletişim sayfasındaki teklif oluşturucu: seçimlerden WhatsApp ya da e-posta mesajı hazırlanır. */
export default function Teklif() {
  const kok = useRef<HTMLElement>(null);
  const { ad, setAd } = useIsletmeAdi();
  const arama = useSyncExternalStore(
    adresAbone,
    () => window.location.search,
    () => "",
  );
  // Ziyaretçi bir seçime dokunana kadar (null) adresteki paket seçili sayılır
  const [elleSecilen, setElleSecilen] = useState<Secenek[] | null>(null);
  const adrestenGelen = adrestekiPaket(arama);
  const secilenler = elleSecilen ?? (adrestenGelen ? [adrestenGelen] : []);
  const [not, setNot] = useState("");

  const mesaj = mesajYaz(ad, secilenler, not);
  const whatsapp = whatsappBaglantisi(mesaj);
  const eposta = epostaBaglantisi(ad.trim() ? `${ad.trim()} için teklif` : "Teklif isteği", mesaj);

  const sec = (secenek: Secenek) =>
    setElleSecilen(secilenler.includes(secenek) ? secilenler.filter((s) => s !== secenek) : [...secilenler, secenek]);

  // Arkadaki fanusun yeri: masaüstünde sağda, telefonda üstte soluk
  useHareket(
    ({ gsap }) => {
      const mm = gsap.matchMedia();
      mm.add({ genis: GENIS }, (baglam) => {
        const { genis } = baglam.conditions as { genis: boolean };
        Object.assign(
          sahneDurumu.son,
          genis
            ? { x: 0.26, y: 0.04, boy: 0.58, kapak: 0, isik: 1.7, gorunur: 1 }
            : { x: 0, y: -0.24, boy: 0.32, kapak: 0, isik: 1.5, gorunur: 0.4 },
        );
      });
    },
    { scope: kok },
  );

  return (
    <section
      ref={kok}
      data-sayfa-basi
      id="teklif"
      aria-labelledby="teklif-baslik"
      className="relative z-10 px-4 pt-[calc(var(--ust-yukseklik)+3rem)] pb-24 sm:px-6 md:min-h-dvh md:pt-[calc(var(--ust-yukseklik)+5.5rem)] md:pb-32 lg:px-10"
    >
      <div className="mx-auto max-w-[90rem]">
        <div className="max-w-[40rem]">
          <h1 id="teklif-baslik">
            <span data-belir className="etiket block text-krem">
              Teklif ve iletişim
            </span>
            <span data-bol className="dev-baslik mt-5 block md:mt-6">
              Sıradaki fanus sizin olsun.
            </span>
          </h1>
          <p data-belir className="mt-6 max-w-[32rem] text-lg leading-relaxed text-soluk">
            Ne istediğinizi seçin, mesajınız hazırlansın. Gerisini görüşmede birlikte netleştiririz.
          </p>

          <form
            data-belir
            data-gecikme="0.1"
            onSubmit={(olay) => olay.preventDefault()}
            className="mt-10 grid gap-7 rounded-[1.25rem] border border-cizgi-guclu bg-gece-2/85 p-5 backdrop-blur-xl sm:p-8"
          >
            <fieldset>
              <legend className="text-[0.9375rem] font-medium">Ne yaptırmak istiyorsunuz?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {SECENEKLER.map((s) => {
                  const secili = secilenler.includes(s.kod);
                  return (
                    <button
                      key={s.kod}
                      type="button"
                      aria-pressed={secili}
                      onClick={() => sec(s.kod)}
                      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm transition-[background-color,border-color,color] duration-300 ${
                        secili ? "border-vurgu bg-vurgu text-gece" : "border-cizgi-guclu text-krem hover:border-krem/50"
                      }`}
                    >
                      {secili && <Check size={14} weight="bold" aria-hidden="true" />}
                      {s.ad}
                      {s.fiyat && (
                        <span className={`tabular-nums ${secili ? "text-gece/70" : "text-soluk"}`}>{s.fiyat}</span>
                      )}
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
                className="mt-2 h-13 w-full rounded-2xl border border-cizgi-guclu bg-cukur px-4 text-krem transition-colors placeholder:text-silik hover:border-krem/40 focus:border-vurgu focus:outline-none"
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
                className="mt-2 w-full resize-none rounded-2xl border border-cizgi-guclu bg-cukur px-4 py-3 text-krem transition-colors placeholder:text-silik hover:border-krem/40 focus:border-vurgu focus:outline-none"
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
        </div>
      </div>
    </section>
  );
}
