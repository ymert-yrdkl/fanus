export {};

declare global {
  interface Window {
    /** Hareket altyapısı kuruldu (head betiği 6 sn içinde görmezse animasyon ön durumlarını kaldırır). */
    __fanusHazir?: boolean;
    /** Açılış perdesi kalktı; giriş animasyonu başlayabilir. */
    __fanusAcildi?: boolean;
  }
}
