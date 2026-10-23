"use client";

import { AD_SINIRI, useIsletmeAdi } from "./IsletmeAdi";

/** Hizmet örneklerini kişiselleştiren işletme adı kutusu (ad bütün sayfalarda hatırlanır). */
export default function AdGirisi({ kimlik = "isletme-adi" }: { kimlik?: string }) {
  const { ad, setAd } = useIsletmeAdi();
  return (
    <div>
      <label htmlFor={kimlik} className="text-[0.9375rem] font-medium text-krem">
        İşletmenizin adı
      </label>
      <input
        id={kimlik}
        type="text"
        value={ad}
        maxLength={AD_SINIRI}
        autoComplete="organization"
        placeholder="Örneğin Yıldız Fırın"
        onChange={(olay) => setAd(olay.target.value)}
        className="mt-2.5 h-15 w-full rounded-2xl border border-cizgi-guclu bg-gece-2 px-5 text-lg text-krem transition-colors duration-300 placeholder:text-silik hover:border-krem/40 focus:border-vurgu focus:outline-none"
      />
      <p className="mt-2.5 text-sm text-soluk">
        Örnekler bu adla canlı çalışır. Ad yalnız bu tarayıcıda kullanılır, hiçbir yere gönderilmez.
      </p>
    </div>
  );
}
