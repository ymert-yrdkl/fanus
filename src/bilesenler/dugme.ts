// Düğme görünümleri: <a> ve <button> aynı sınıfları kullanır.

const temel =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.9375rem] font-medium whitespace-nowrap transition-[background-color,color,border-color,transform] duration-300 ease-yay select-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

export const dugmeSinifi = {
  /** Birincil eylem (sayfada tek niyet: teklif almak). */
  alev: `${temel} bg-alev text-gece hover:bg-alev-acik`,
  /** İkincil: ince çerçeve. */
  cerceve: `${temel} border border-cizgi-guclu text-krem hover:border-krem/60 hover:bg-krem/5`,
  /** Koyu zemin üstünde açık dolgu. */
  krem: `${temel} bg-krem text-gece hover:bg-alev-acik`,
};
