"use client";

import { useEffect, useState } from "react";
import { Bell, CalendarCheck, Crown, House, Heart, MapPin, User } from "@phosphor-icons/react/dist/ssr";
import { basHarfler, useIsletmeAdi } from "../IsletmeAdi";

type Sekme = "ana" | "randevu" | "hesap";

const BILDIRIMLER = [
  { baslik: "Hatırlatma", metin: "Yarın 10:30 randevunuz var." },
  { baslik: "Yeni kampanya", metin: "Bu hafta üyelere %10 indirim." },
  { baslik: "Abonelik yenilendi", metin: "Premium bir yıl daha sizinle." },
];

/**
 * Mobil uygulama örneği: işletmenin adıyla açılan bir telefon ekranı. Üç sekme (ana, randevu, hesap), üstten
 * düşen bildirimler ve bir abonelik düğmesi. Yanında kısa açıklama: neyin değiştiği.
 */
export default function MobilDemo() {
  const { ad } = useIsletmeAdi();
  const gorunen = ad.trim() || "İşletmeniz";
  const [sekme, setSekme] = useState<Sekme>("ana");
  const [premium, setPremium] = useState(false);
  const [bildirim, setBildirim] = useState<number | null>(null);

  // Her 4 saniyede bir bildirim düşer, 2,5 saniye sonra çekilir
  useEffect(() => {
    let i = 0;
    const goster = () => {
      setBildirim(i % BILDIRIMLER.length);
      i += 1;
      window.setTimeout(() => setBildirim(null), 2500);
    };
    const ilk = window.setTimeout(goster, 1200);
    const dongu = window.setInterval(goster, 4000);
    return () => {
      window.clearTimeout(ilk);
      window.clearInterval(dongu);
    };
  }, []);

  return (
    <div className="@container">
      <div className="grid gap-8 @md:grid-cols-[1fr_1.1fr] @md:items-center">
        {/* Telefon */}
        <div
          data-zemin="koyu"
          className="relative mx-auto w-[16.5rem] overflow-hidden rounded-[2.2rem] border-[7px] border-gece-4 bg-cukur golge"
        >
          <div data-zemin="acik" className="relative flex aspect-[9/18] flex-col rounded-[1.75rem] bg-gece">
            {/* Durum çubuğu ve başlık */}
            <div className="flex items-center justify-between px-5 pt-4 text-[0.65rem] text-soluk">
              <span>09:41</span>
              <span className="h-1.5 w-14 rounded-full bg-cukur" aria-hidden="true" />
            </div>
            <div className="flex items-center gap-3 px-5 pt-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-vurgu text-xs font-semibold text-gece">
                {basHarfler(gorunen)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{gorunen}</p>
                <p className="text-[0.7rem] text-soluk">{premium ? "Premium üye" : "Ücretsiz plan"}</p>
              </div>
              {premium && <Crown size={16} weight="fill" className="ml-auto text-vurgu" aria-hidden="true" />}
            </div>

            {/* Sekme içeriği */}
            <div className="flex-1 px-4 pt-4" aria-live="polite">
              {sekme === "ana" && (
                <div className="grid gap-3">
                  <div className="rounded-2xl bg-gece-2 p-4">
                    <p className="text-[0.7rem] text-soluk">Bu ay</p>
                    <p className="rakam mt-1 text-3xl">
                      4<span className="text-base font-normal text-soluk"> ziyaret</span>
                    </p>
                    <div className="mt-3 flex h-10 items-end gap-1">
                      {[0.4, 0.7, 0.5, 0.9, 0.6, 1, 0.8].map((b, i) => (
                        <span
                          key={i}
                          className="cubuk flex-1 origin-bottom rounded-sm bg-vurgu/80"
                          style={{ height: `${b * 100}%`, animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-gece-2 p-3">
                      <Heart size={18} weight="fill" className="text-vurgu" aria-hidden="true" />
                      <p className="mt-2 text-xs font-semibold">Favoriler</p>
                      <p className="text-[0.7rem] text-soluk">12 kayıt</p>
                    </div>
                    <div className="rounded-2xl bg-gece-2 p-3">
                      <MapPin size={18} weight="fill" className="text-vurgu" aria-hidden="true" />
                      <p className="mt-2 text-xs font-semibold">En yakın şube</p>
                      <p className="text-[0.7rem] text-soluk">1,2 km</p>
                    </div>
                  </div>
                </div>
              )}
              {sekme === "randevu" && (
                <div className="grid gap-2">
                  {["Yarın 10:30", "Cuma 14:00", "Pazartesi 09:15"].map((s, i) => (
                    <div key={s} className="flex items-center gap-3 rounded-2xl bg-gece-2 p-3">
                      <CalendarCheck size={18} className={i === 0 ? "text-vurgu" : "text-soluk"} aria-hidden="true" />
                      <div>
                        <p className="text-xs font-semibold">{s}</p>
                        <p className="text-[0.7rem] text-soluk">{i === 0 ? "Onaylandı" : "Boş saat"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {sekme === "hesap" && (
                <div className="grid gap-3">
                  <div className="rounded-2xl bg-gece-2 p-4">
                    <p className="text-xs font-semibold">{premium ? "Premium" : "Ücretsiz plan"}</p>
                    <p className="mt-1 text-[0.7rem] leading-relaxed text-soluk">
                      {premium
                        ? "Sınırsız kayıt, öncelikli randevu ve reklamsız kullanım."
                        : "Premium ile sınırsız kayıt ve öncelikli randevu."}
                    </p>
                    <button
                      type="button"
                      onClick={() => setPremium((p) => !p)}
                      className={`mt-3 inline-flex min-h-9 items-center justify-center rounded-full px-4 text-xs font-semibold transition-colors ${
                        premium ? "border border-cizgi-guclu" : "bg-vurgu text-gece"
                      }`}
                    >
                      {premium ? "Aboneliği yönet" : "Premium'a geç · ₺49/ay"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Alt sekmeler */}
            <div className="mx-3 mb-3 grid grid-cols-3 rounded-2xl bg-gece-2 p-1">
              {(
                [
                  ["ana", "Ana", House],
                  ["randevu", "Randevu", CalendarCheck],
                  ["hesap", "Hesap", User],
                ] as const
              ).map(([kod, ad, Ikon]) => (
                <button
                  key={kod}
                  type="button"
                  aria-pressed={sekme === kod}
                  onClick={() => setSekme(kod)}
                  className={`flex min-h-10 flex-col items-center justify-center gap-0.5 rounded-xl text-[0.65rem] transition-colors ${
                    sekme === kod ? "bg-gece text-vurgu" : "text-soluk"
                  }`}
                >
                  <Ikon size={16} weight={sekme === kod ? "fill" : "regular"} aria-hidden="true" />
                  {ad}
                </button>
              ))}
            </div>

            {/* Bildirim: üstten düşer */}
            <div
              aria-hidden="true"
              className={`absolute inset-x-3 top-2 flex items-start gap-2.5 rounded-2xl border border-cizgi-guclu bg-gece-2 p-3 golge transition-[transform,opacity] duration-500 ease-yay ${
                bildirim === null ? "-translate-y-24 opacity-0" : "translate-y-0 opacity-100"
              }`}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-vurgu text-gece">
                <Bell size={14} weight="fill" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold">{gorunen}</span>
                <span className="block truncate text-[0.7rem] text-soluk">
                  {bildirim !== null ? BILDIRIMLER[bildirim]!.metin : ""}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Açıklama */}
        <div>
          <p className="etiket">Uygulamanız</p>
          <ul className="mt-4 grid gap-3 text-[0.9375rem] leading-relaxed">
            <li>
              <span className="font-semibold">Bildirimler:</span>{" "}
              <span className="text-soluk">
                randevu, kampanya ve abonelik haberleri telefona düşer; siz göndermezsiniz.
              </span>
            </li>
            <li>
              <span className="font-semibold">Sekmeler:</span>{" "}
              <span className="text-soluk">ana ekran, randevu ve hesap; alttaki düğmelere dokunun.</span>
            </li>
            <li>
              <span className="font-semibold">Abonelik:</span>{" "}
              <span className="text-soluk">
                Hesap sekmesinde Premium&apos;a geçin; ücret App Store ve Google Play üzerinden alınır.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
