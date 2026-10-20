// 3B sahnenin durumu: sayfadaki GSAP zaman çizelgeleri bu düz nesnedeki sayıları değiştirir,
// sahne her karede okur. React durumu (useState) kullanılmaz: saniyede 60 kez değişen değer.

/** Fanusun ekrandaki yeri ve hali. */
export type Poz = {
  /** Ekran genişliğine oranla yatay konum: -0.5 sol kenar, 0 orta, 0.5 sağ kenar. */
  x: number;
  /** Ekran yüksekliğine oranla dikey konum: -0.5 üst, 0 orta, 0.5 alt (alevin merkezi). */
  y: number;
  /** Fanusun boyu, ekran yüksekliğine oranla. */
  boy: number;
  /** Camın kalkması: 0 kapalı, 1 tamamen kalkmış. */
  kapak: number;
  /** Alevin gücü (1 normal). */
  isik: number;
  /** Tuvalin görünürlüğü 0..1. */
  gorunur: number;
};

export const sahneDurumu = {
  /** Giriş ve manifesto boyunca kaydırmayla değişen hal. */
  akis: { x: 0.22, y: 0.04, boy: 0.62, kapak: 0, isik: 1, gorunur: 1 } as Poz,
  /** Teklif bölümündeki son hal. */
  son: { x: 0.25, y: 0.02, boy: 0.56, kapak: 0, isik: 1.6, gorunur: 1 } as Poz,
  /** 0 = akış, 1 = son hal (teklif bölümüne girince yumuşakça 1 olur). */
  sonKarisim: 0,
  /** Açılış: 0 = cam havada ve alev sönük, 1 = cam yerinde ve alev yanıyor. */
  giris: 0,
  /** Rüzgârın alevi etkileme çarpanı (manifestonun "rüzgâr" cümlesinde artar). */
  ruzgar: 0.15,
};

/** İki poz arasında doğrusal karışım. */
export function pozKaristir(a: Poz, b: Poz, t: number): Poz {
  const k = (x: number, y: number) => x + (y - x) * t;
  return {
    x: k(a.x, b.x),
    y: k(a.y, b.y),
    boy: k(a.boy, b.boy),
    kapak: k(a.kapak, b.kapak),
    isik: k(a.isik, b.isik),
    gorunur: k(a.gorunur, b.gorunur),
  };
}
