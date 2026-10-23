// GSAP'in canlandıracağı renkler için temanın vurgu rengini okur (CSS değişkeni → rgba).
// Tema değişince sonraki çağrı yeni rengi verir.

/** "#ff5a36" ya da "#f53" → [255, 90, 54] */
function hexAyristir(hex: string): [number, number, number] {
  let h = hex.trim().replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const sayi = parseInt(h.slice(0, 6), 16);
  return [(sayi >> 16) & 255, (sayi >> 8) & 255, sayi & 255];
}

/** Temanın vurgu (alev) rengi, istenen saydamlıkla: vurgu(0.3) → "rgba(255, 90, 54, 0.3)" */
export function vurgu(alfa: number) {
  const deger = getComputedStyle(document.documentElement).getPropertyValue("--color-vurgu");
  const [r, g, b] = deger.startsWith("#") ? hexAyristir(deger) : [235, 160, 78];
  return `rgba(${r}, ${g}, ${b}, ${alfa})`;
}
