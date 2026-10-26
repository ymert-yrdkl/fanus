// GSAP (animasyon kütüphanesi) gerektiğinde yüklenir: açılıştaki JavaScript'e girmez (telefonda hız puanı).
// Bileşenler GSAP'ı doğrudan içe aktarmaz; kurulumlarını useHareket ile yazar, tıklama gibi anlarda hareketYukle
// ile alır. GSAP 3.13'ten beri bütün eklentiler ücretsiz ve npm paketinde. Yalnız bir bileşenin kullandığı eklenti
// o bileşende yüklenir (MotionPath: OtomasyonDemo).
//
// Ne zaman yüklenir: masaüstünde hemen (açılış perdesi ve giriş animasyonu ona bağlı); telefonda kullanıcının ilk
// dokunuşunda ya da kaydırmasında (telefonda ilk ekran CSS ile görünür). Menü gibi bir eylem isterse hemen yüklenir.
import { useEffect, type DependencyList, type RefObject } from "react";
import type { gsap as GsapTipi } from "gsap";
import type { ScrollTrigger as ScrollTriggerTipi } from "gsap/ScrollTrigger";
import type { SplitText as SplitTextTipi } from "gsap/SplitText";

/** Hareket azaltma tercihi olmayanlar için (gsap.matchMedia koşulu). */
export const HAREKET_ACIK = "(prefers-reduced-motion: no-preference)";
/** Fare kullanan masaüstü (mıknatıs düğme, imleç ışığı). */
export const FARE = "(prefers-reduced-motion: no-preference) and (pointer: fine)";
/** Tailwind `md` kırılımı. */
export const GENIS = "(min-width: 768px)";

export type Hareket = {
  gsap: typeof GsapTipi;
  ScrollTrigger: typeof ScrollTriggerTipi;
  SplitText: typeof SplitTextTipi;
};

let yukleme: Promise<Hareket> | null = null;

/** GSAP'ı ve eklentilerini yükler (bir kez; sonraki çağrılar aynı sözü döndürür). */
export function hareketYukle(): Promise<Hareket> {
  yukleme ??= import("./gsap-paketi").then((m) => m.hareket);
  return yukleme;
}

let sira: Promise<void> | null = null;

/**
 * Kurulumlar için bekleme. Masaüstünde hemen (açılış perdesi ve giriş animasyonu GSAP'a bağlı). Telefonda kullanıcının
 * ilk dokunuşunda ya da kaydırmasında: telefonda ilk ekran GSAP'sız (CSS) görünür, GSAP yalnız aşağıdaki şerit, sayaç,
 * manifesto belirmeleri ve menü içindir. Sayfa yüklendikten sonra kendiliğinden yüklemek, bütün kurulumları ölçüm
 * penceresinde tek uzun işe topluyordu (PageSpeed: bloklanma 30 → 230 ms).
 */
function kurulumSirasi(): Promise<void> {
  sira ??= new Promise<void>((coz) => {
    if (window.matchMedia(GENIS).matches) return coz();
    const olaylar = ["scroll", "touchstart", "pointerdown", "keydown", "wheel"] as const;
    const basla = () => {
      olaylar.forEach((o) => window.removeEventListener(o, basla));
      coz();
    };
    olaylar.forEach((o) => window.addEventListener(o, basla, { passive: true }));
  });
  return sira;
}

/**
 * useGSAP yerine: GSAP hazır olunca kurulum işlevini bir gsap.context içinde çalıştırır (seçiciler `scope` öğesiyle
 * sınırlı); bileşen kalkınca ya da bağımlılıklar değişince kurulanların hepsi geri alınır. Kurulum işlevi bir temizlik
 * işlevi döndürebilir; o da geri almada çağrılır.
 */
export function useHareket(
  kur: (h: Hareket) => void | (() => void),
  { scope, dependencies = [] }: { scope?: RefObject<Element | null>; dependencies?: DependencyList } = {},
) {
  useEffect(() => {
    let iptal = false;
    let baglam: gsap.Context | undefined;
    kurulumSirasi()
      .then(hareketYukle)
      .then((h) => {
        if (iptal) return;
        baglam = h.gsap.context(() => kur(h), scope?.current ?? undefined);
      });
    return () => {
      iptal = true;
      baglam?.revert();
    };
    // Kurulum işlevi her çizimde yenidir; yalnız verilen bağımlılıklar değişince yeniden kurulur (useGSAP gibi)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
