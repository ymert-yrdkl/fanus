// Lenis (pürüzsüz kaydırma) örneği. PuruzsuzKaydirma bileşeni kurar; menü ve açılış perdesi
// kaydırmayı durdurmak için buradaki yardımcıları kullanır.
import type Lenis from "lenis";

let ornek: Lenis | null = null;

export function lenisAyarla(yeni: Lenis | null) {
  ornek = yeni;
}

export function kaydirmayiDurdur() {
  ornek?.stop();
  if (!ornek) document.documentElement.style.overflow = "hidden";
}

export function kaydirmayiBaslat() {
  ornek?.start();
  document.documentElement.style.overflow = "";
}

/** Bir öğeye ya da çapaya kaydırır; Lenis yoksa tarayıcının kendi kaydırması. */
export function kaydir(hedef: string | HTMLElement) {
  if (ornek) {
    ornek.scrollTo(hedef, { duration: 1.6 });
    return;
  }
  const el = typeof hedef === "string" ? document.querySelector(hedef) : hedef;
  el?.scrollIntoView({ behavior: "smooth" });
}
