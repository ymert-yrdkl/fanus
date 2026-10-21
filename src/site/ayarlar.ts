// Sitenin bütün iletişim ve kimlik ayarları tek yerde.
// "ONAY BEKLİYOR" yazanlar Yusuf'un kararı; liste docs/acik-kararlar.md.

type SiteAyarlari = {
  ad: string;
  alanAdi: string;
  adres: string;
  baslik: string;
  aciklama: string;
  whatsapp: string;
  telefon: string;
  eposta: string;
  instagram: string;
};

export const SITE: SiteAyarlari = {
  ad: "fanus",
  alanAdi: "fanussoft.com",
  adres: process.env.NEXT_PUBLIC_SITE_ADRESI ?? "https://fanussoft.com",
  baslik: "fanussoft | E-ticaret, kurumsal site, QR menü ve web otomasyonu",
  aciklama:
    "fanussoft; e-ticaret siteleri, kurumsal web siteleri, QR menüler ve iş akışınızı yürüten web otomasyonları kurar. Yayındaki işlerimizi gezin, teklif isteyin.",

  // ONAY BEKLİYOR: WhatsApp numarası, ülke koduyla ve boşluksuz (ör. "905xxxxxxxxx").
  // Boşken WhatsApp düğmeleri gizlenir, teklif e-postayla gönderilir.
  whatsapp: "",
  // ONAY BEKLİYOR: görünen telefon (ör. "+90 5xx xxx xx xx"). Boşken gösterilmez.
  telefon: "",
  // ONAY BEKLİYOR: e-posta kutusunun açılmış olması gerekir.
  eposta: "merhaba@fanussoft.com",
  // ONAY BEKLİYOR: Instagram kullanıcı adı (ör. "fanussoft"). Boşken gösterilmez.
  instagram: "",
};

/** Hazır metinle WhatsApp bağlantısı. Numara yoksa null. */
export function whatsappBaglantisi(metin: string): string | null {
  if (!SITE.whatsapp) return null;
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(metin)}`;
}

/** Hazır konu ve metinle e-posta bağlantısı. */
export function epostaBaglantisi(konu: string, metin: string): string {
  return `mailto:${SITE.eposta}?subject=${encodeURIComponent(konu)}&body=${encodeURIComponent(metin)}`;
}
