"use client";

import { useEffect } from "react";

/**
 * Sonsuz CSS animasyonları (hizmet minyatürleri, iş vitrinindeki kayan telefon ekranları...) yalnız ekrandayken
 * oynar; ekran dışındakiler durur. Telefonda bu animasyonlar açılışta ana iş parçacığını saniyelerce meşgul
 * ediyordu (hız puanı); görünmeyen şeyi oynatmak pil de harcar.
 *
 * Sayfadaki sonsuz animasyonları tarayıcının kendi listesinden (document.getAnimations) bulur, hedef öğelerini
 * izler. CSS'e dokunmaz: bu bileşen çalışmazsa animasyonlar eskisi gibi oynar. Sonradan beliren öğeler (ör. canlı
 * örneklerin içi) izlenmez, olduğu gibi oynar. Her sayfa değişiminde yeniden kurulur (SayfaEtkileri).
 */
export default function EkrandaOynat() {
  useEffect(() => {
    const hedefler = new Map<Element, Animation[]>();
    for (const animasyon of document.getAnimations()) {
      if (!(animasyon instanceof CSSAnimation)) continue;
      const etki = animasyon.effect;
      if (!(etki instanceof KeyframeEffect) || !etki.target) continue;
      if (etki.getTiming().iterations !== Infinity) continue;
      const liste = hedefler.get(etki.target) ?? [];
      liste.push(animasyon);
      hedefler.set(etki.target, liste);
    }
    if (!hedefler.size) return;

    const gozcu = new IntersectionObserver(
      (girdiler) =>
        girdiler.forEach((g) => hedefler.get(g.target)?.forEach((a) => (g.isIntersecting ? a.play() : a.pause()))),
      // Ekrana girmeden biraz önce başlasın
      { rootMargin: "120px 0px" },
    );
    hedefler.forEach((_, oge) => gozcu.observe(oge));
    return () => gozcu.disconnect();
  }, []);

  return null;
}
