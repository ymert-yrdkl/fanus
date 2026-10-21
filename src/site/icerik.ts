// Sitedeki metinler. Referans bilgileri sitelerin kendisinden alındı (20 Ekim 2026);
// sayı ya da iddia eklerken kaynağını bu dosyaya not düşün. Fiyatlar Yusuf'tan (20 Ekim 2026).

export type HizmetKodu = "eticaret" | "kurumsal" | "otomasyon" | "qrmenu";
export type HizmetAdresi = "e-ticaret" | "kurumsal-site" | "qr-menu" | "web-otomasyonu";
export type PaketKodu = "tek-sayfa" | "kurumsal" | "e-ticaret" | "qr-menu" | "otomasyon";

export type OzellikGrubu = { baslik: string; maddeler: string[] };
export type Soru = { soru: string; cevap: string };

export type Hizmet = {
  kod: HizmetKodu;
  /** Sayfa adresi: /hizmetler/<adres> */
  adres: HizmetAdresi;
  ad: string;
  baslik: string;
  metin: string;
  /** Hizmetler sayfasındaki kısa liste */
  maddeler: string[];
  /** Hizmet sayfasının üst bölümü */
  sayfaBasligi: string;
  sayfaMetni: string;
  seoBasligi: string;
  seoAciklamasi: string;
  kimlerIcin: string[];
  ozellikler: OzellikGrubu[];
  paketler: PaketKodu[];
  /** İlgili referansın kodu (REFERANSLAR) */
  referans?: string;
  sss: Soru[];
};

/** Bütün paketlerde yıllık yenileme ücreti (TL). */
export const YILLIK_YENILEME = 2399;

export type Paket = {
  kod: PaketKodu;
  ad: string;
  hizmet: HizmetAdresi;
  /** TL; null ise teklif üzerine */
  fiyat: number | null;
  /** "...'dan başlayan" */
  baslangic?: boolean;
  /** TL/yıl; null ise teklif üzerine */
  yenileme: number | null;
  ozet: string;
  maddeler: string[];
};

export const PAKETLER: Paket[] = [
  {
    kod: "tek-sayfa",
    ad: "Tek sayfa kurumsal site",
    hizmet: "kurumsal-site",
    fiyat: 9999,
    yenileme: YILLIK_YENILEME,
    ozet: "Yeni açılan ya da kendini kısaca tanıtmak isteyen işletmeler için, her şeyi tek sayfada anlatan site.",
    maddeler: [
      "Size özel tek sayfa tasarım",
      "Telefon, tablet ve bilgisayara uyumlu",
      "Hakkımızda, hizmetler, galeri ve iletişim bölümleri",
      "Tek dokunuşla arama ve WhatsApp düğmesi",
      "Google Haritalar konumu",
      "Temel SEO, site haritası ve paylaşım görseli",
      "SSL sertifikası (https)",
    ],
  },
  {
    kod: "kurumsal",
    ad: "Kurumsal site, tam paket",
    hizmet: "kurumsal-site",
    fiyat: 45000,
    yenileme: YILLIK_YENILEME,
    ozet: "Birden çok sayfası olan, içeriğini yönetim panelinden kendiniz değiştirdiğiniz, her şeyin dahil olduğu kurumsal site.",
    maddeler: [
      "İhtiyaca göre çok sayfalı yapı",
      "Yönetim paneli: sayfa, metin ve görsel düzenleme",
      "Blog, haber ve referans bölümleri",
      "Teklif ve iletişim formları, gelen mesaj kutusu",
      "Türkçe, İngilizce ve istenen diğer diller",
      "Gelişmiş SEO, site haritası ve Search Console kurulumu",
      "Ziyaret istatistikleri",
      "WhatsApp, harita ve sosyal medya bağlantıları",
      "SSL sertifikası ve düzenli yedek",
    ],
  },
  {
    kod: "e-ticaret",
    ad: "E-ticaret sitesi",
    hizmet: "e-ticaret",
    fiyat: 65000,
    yenileme: YILLIK_YENILEME,
    ozet: "Ürünlerinizi kendiniz yönettiğiniz panelli online mağaza: sepet, ödeme, sipariş ve kargo bir arada.",
    maddeler: [
      "Ürün, kategori ve varyant (renk, beden) yönetimi",
      "Stok takibi ve tükenen ürün uyarısı",
      "Sepet ve hızlı ödeme adımı",
      "iyzico ya da PayTR ile kartla ödeme",
      "Havale / EFT ve kapıda ödeme seçenekleri",
      "Kupon, indirim ve kampanya",
      "Sipariş paneli, durum ve kargo takip numarası",
      "Sipariş bildirimleri (e-posta, WhatsApp)",
      "Ürün sayfalarında SEO ve paylaşım görselleri",
      "Mesafeli satış ve KVKK sayfaları için taslak",
    ],
  },
  {
    kod: "qr-menu",
    ad: "QR menü",
    hizmet: "qr-menu",
    fiyat: 9999,
    baslangic: true,
    yenileme: YILLIK_YENILEME,
    ozet: "Restoran, kafe ve pastaneler için masadan okutulan dijital menü; fiyatları panelden anında değiştirirsiniz.",
    maddeler: [
      "Kategorili dijital menü",
      "Ürün fotoğrafları ve açıklamaları",
      "Porsiyona göre fiyat (1 porsiyon, 1,5 porsiyon gibi)",
      "Panelden anında fiyat ve ürün güncelleme",
      "Masalar için baskıya hazır QR kodlar",
      "Arama ve WhatsApp sipariş düğmeleri",
      "İşletmenizin logosu ve renkleri",
      "İsterseniz birden çok dil",
    ],
  },
  {
    kod: "otomasyon",
    ad: "Web otomasyonu",
    hizmet: "web-otomasyonu",
    fiyat: null,
    yenileme: null,
    ozet: "Sipariş, fatura, randevu ve bildirim gibi tekrar eden işler için kurulan akışlar. Fiyat, bağlanacak sistemlere göre belirlenir.",
    maddeler: [
      "WhatsApp, SMS ve e-posta bildirimleri",
      "Muhasebe ve e-fatura bağlantısı",
      "Pazaryeri ürün ve stok eşitleme",
      "Randevu ve hatırlatma akışları",
      "Kendiliğinden hazırlanan raporlar",
      "Mevcut sitenize eklenebilir",
    ],
  },
];

/** Yıllık yenilemeye dahil olanlar (fiyatlar sayfası). */
export const YENILEMEYE_DAHIL = [
  "Sunucu (barındırma) ve trafik",
  "SSL sertifikasının yenilenmesi",
  "Güvenlik ve yazılım güncellemeleri",
  "Yedekleme",
  "Erişim kesintisi izleme",
  "Küçük metin ve görsel değişiklikleri için destek",
];

export function paketBul(kod: PaketKodu) {
  return PAKETLER.find((p) => p.kod === kod)!;
}

const tl = new Intl.NumberFormat("tr-TR");
/** 9999 → "₺9.999" */
export function fiyatYaz(tutar: number) {
  return `₺${tl.format(tutar)}`;
}

// Fiyatlar KDV hariç (Yusuf, 22 Ekim 2026). Görünen her fiyatın yanında kısa ek, fiyat bölümlerinde not.
export const KDV_EKI = "+KDV";
export const KDV_NOTU = "Fiyatlara KDV dahil değildir.";

/** Fiyatın arkasındaki ek: "+KDV", başlangıç fiyatında "+KDV'den" (ek "KDV" ile bittiği için "'den"). */
export function kdvEki(baslangic = false) {
  return baslangic ? `${KDV_EKI}'den` : KDV_EKI;
}

/** 9999 → "₺9.999 +KDV"; başlangıç fiyatında "₺9.999 +KDV'den" */
export function kdvHaricYaz(tutar: number, baslangic = false) {
  return `${fiyatYaz(tutar)} ${kdvEki(baslangic)}`;
}

export const HIZMETLER: Hizmet[] = [
  {
    kod: "eticaret",
    adres: "e-ticaret",
    ad: "E-ticaret sitesi",
    baslik: "Gece yarısı da satış yapan mağaza.",
    metin:
      "Ürün, sepet, ödeme ve kargo tek yerde. Müşteriniz telefondan birkaç dokunuşla sipariş verir, siz siparişi panelden anında görürsünüz.",
    maddeler: [
      "iyzico ya da PayTR ile kartla ödeme",
      "Varyant, stok ve kampanya yönetimi",
      "Sipariş, kargo ve fatura takibi",
      "Ürünleri kendiniz eklediğiniz panel",
    ],
    sayfaBasligi: "Uyurken de satan mağaza.",
    sayfaMetni:
      "Ürünlerinizi kendiniz eklediğiniz, kartla ödeme alan, siparişi ve kargoyu tek panelden yönettiğiniz e-ticaret sitesi.",
    seoBasligi: "E-ticaret sitesi",
    seoAciklamasi:
      "Panelli e-ticaret sitesi: ürün ve stok yönetimi, iyzico/PayTR ile ödeme, sipariş ve kargo takibi. ₺65.000 +KDV, yıllık yenileme ₺2.399 +KDV.",
    kimlerIcin: ["Üretici markalar", "Butik mağazalar", "Baskı ve promosyon", "Pazaryerinden kendi sitesine geçenler"],
    ozellikler: [
      {
        baslik: "Ürün ve stok",
        maddeler: [
          "Sınırsız ürün ve kategori",
          "Renk, beden gibi varyantlar",
          "Stok takibi, tükenen ürün uyarısı",
          "Toplu fiyat güncelleme",
        ],
      },
      {
        baslik: "Ödeme ve sepet",
        maddeler: [
          "iyzico ya da PayTR ile kartla ödeme",
          "Havale / EFT ve kapıda ödeme",
          "Kupon, indirim ve kampanya",
          "Ücretsiz kargo eşiği",
        ],
      },
      {
        baslik: "Sipariş ve kargo",
        maddeler: [
          "Sipariş paneli ve durum takibi",
          "Kargo takip numarası müşteriye gider",
          "Sipariş bildirimleri (e-posta, WhatsApp)",
          "İade ve iptal kayıtları",
        ],
      },
      {
        baslik: "Bulunurluk",
        maddeler: [
          "Ürün sayfalarında SEO",
          "Paylaşım görselleri",
          "Site haritası ve Search Console",
          "Telefonda hızlı açılan sayfalar",
        ],
      },
    ],
    paketler: ["e-ticaret"],
    referans: "dijitalbaskimerkezim",
    sss: [
      {
        soru: "Kartla ödeme için ne gerekiyor?",
        cevap:
          "iyzico ya da PayTR'de işletmeniz adına bir üye işyeri hesabı açılması gerekir. Başvuruyu birlikte yaparız; para doğrudan sizin hesabınıza geçer.",
      },
      {
        soru: "Ürünleri kim yükleyecek?",
        cevap:
          "Panelden kendiniz ekleyebilirsiniz. İlk ürünlerinizi bir tablo hâlinde gönderirseniz yayına alırken biz yükleriz.",
      },
      {
        soru: "Pazaryerlerinde de satıyorum, ikisi birlikte olur mu?",
        cevap: "Olur. Trendyol ya da Hepsiburada ile ürün ve stok eşitlemesi web otomasyonu olarak ayrıca kurulabilir.",
      },
    ],
  },
  {
    kod: "kurumsal",
    adres: "kurumsal-site",
    ad: "Kurumsal web sitesi",
    baslik: "Firmanızı ilk bakışta doğru anlatan site.",
    metin:
      "Hazır tema yerine size göre çizilen, telefonda hızlı açılan ve Google'da bulunan bir site. Metinleri ve görselleri panelden kendiniz değiştirirsiniz.",
    maddeler: [
      "Sektörünüze göre sıfırdan tasarım",
      "Teknik SEO ve site haritası",
      "Türkçe, İngilizce ve başka diller",
      "Teklif ve iletişim formları",
    ],
    sayfaBasligi: "İlk bakışta güven veren site.",
    sayfaMetni:
      "Tek sayfalık bir tanıtım sitesinden yönetim panelli, çok dilli kurumsal siteye kadar. Firmanızı doğru anlatan, telefonda hızlı açılan ve Google'da bulunan bir site.",
    seoBasligi: "Kurumsal web sitesi",
    seoAciklamasi:
      "Kurumsal web sitesi: tek sayfa site ₺9.999 +KDV, yönetim panelli tam paket ₺45.000 +KDV; yıllık yenileme ₺2.399 +KDV. Sıfırdan tasarım, SEO, çok dil.",
    kimlerIcin: ["Üretim ve sanayi", "Klinik ve ofisler", "Restoran ve kafeler", "Hizmet işletmeleri"],
    ozellikler: [
      {
        baslik: "Tasarım",
        maddeler: [
          "Hazır tema yok, size göre çizilir",
          "Telefon, tablet ve bilgisayara uyumlu",
          "Kurumsal renk ve yazı düzeni",
          "Fotoğraf ve galeri düzenlemesi",
        ],
      },
      {
        baslik: "Yönetim paneli",
        maddeler: [
          "Sayfa, metin ve görsel düzenleme",
          "Blog, haber ve referanslar",
          "Gelen form mesajları",
          "Teknik bilgi gerekmez",
        ],
      },
      {
        baslik: "Google'da bulunmak",
        maddeler: [
          "Başlıklar, açıklamalar ve site haritası",
          "Search Console ve işletme profili bağlantısı",
          "Paylaşım görselleri",
          "Hızlı açılan sayfalar",
        ],
      },
      {
        baslik: "İletişim",
        maddeler: [
          "Teklif ve iletişim formları",
          "WhatsApp ve tek dokunuşla arama",
          "Google Haritalar konumu",
          "Çok dilli sayfalar",
        ],
      },
    ],
    paketler: ["tek-sayfa", "kurumsal"],
    referans: "ayyildizrobotics",
    sss: [
      {
        soru: "Tek sayfa ile tam paket arasındaki fark ne?",
        cevap:
          "Tek sayfa site işletmenizi tek, uzun bir sayfada anlatır ve içeriği biz güncelleriz. Tam pakette istediğiniz kadar sayfa, yönetim paneli, blog ve çok dil vardır; içeriği kendiniz değiştirirsiniz.",
      },
      {
        soru: "Tek sayfayla başlayıp sonra büyütebilir miyim?",
        cevap:
          "Evet. Tek sayfa site, ileride tam pakete geçerken yeni tasarımın temeli olur; aradaki fark üzerinden ilerleriz.",
      },
      {
        soru: "Mevcut sitemin Google sıralaması kaybolur mu?",
        cevap: "Eski adreslerden yenilerine yönlendirme kurarız; sayfalarınız Google'da bulunmaya devam eder.",
      },
    ],
  },
  {
    kod: "qrmenu",
    adres: "qr-menu",
    ad: "QR menü",
    baslik: "Masadaki kod, telefondaki menü.",
    metin:
      "Müşteri masadaki QR kodu okutur, menünüz telefonunda açılır. Fiyatı panelden değiştirirsiniz; menüyü yeniden bastırmanız gerekmez.",
    maddeler: [
      "Kategoriler, fotoğraflar ve porsiyonlar",
      "Panelden anında fiyat güncelleme",
      "Telefonla ve WhatsApp'tan sipariş",
      "İsterseniz birden çok dilde",
    ],
    sayfaBasligi: "Masadaki kod, telefondaki menü.",
    sayfaMetni:
      "Restoran, kafe ve pastaneler için dijital menü. Müşteri okutur, menü açılır; fiyatı panelden değiştirirsiniz, kod aynı kalır.",
    seoBasligi: "QR menü",
    seoAciklamasi:
      "Restoran ve kafeler için QR menü: kategoriler, fotoğraflar, porsiyon fiyatları, anında güncelleme. ₺9.999 +KDV'den başlayan fiyatlar, yıllık yenileme ₺2.399 +KDV.",
    kimlerIcin: ["Restoranlar", "Kafeler", "Pastaneler", "Otel ve plaj işletmeleri"],
    ozellikler: [
      {
        baslik: "Menü",
        maddeler: [
          "Kategoriler ve ürün sıralaması",
          "Ürün fotoğrafları ve açıklamaları",
          "Porsiyona göre fiyat",
          "Günün önerisi ve tükendi işareti",
        ],
      },
      {
        baslik: "Panel",
        maddeler: [
          "Fiyatı anında değiştirme",
          "Ürün ekleme, gizleme, sıralama",
          "Telefondan da kullanılır",
          "Kod değişmez, yeniden baskı yok",
        ],
      },
      {
        baslik: "Masada",
        maddeler: [
          "Baskıya hazır QR kodlar",
          "İşletmenizin logosu ve renkleri",
          "Arama ve WhatsApp sipariş düğmesi",
          "İsterseniz birden çok dil",
        ],
      },
    ],
    paketler: ["qr-menu"],
    referans: "emrepide",
    sss: [
      {
        soru: "Fiyatı değiştirince QR kodu yeniden bastırmam gerekir mi?",
        cevap:
          "Hayır. Kod menünün adresini taşır; panelden değiştirdiğiniz fiyat aynı kodla açılan menüde hemen görünür.",
      },
      {
        soru: 'Fiyat neden "başlayan"?',
        cevap:
          "Başlangıç fiyatı tek dilli, standart sayıda ürünlü bir menü içindir. Çok şubeli, çok dilli ya da masadan sipariş alan menülerde fiyat kapsama göre artar.",
      },
      {
        soru: "Müşterinin uygulama indirmesi gerekir mi?",
        cevap: "Hayır. Telefonun kamerasıyla okutmak yeterli; menü tarayıcıda açılır.",
      },
    ],
  },
  {
    kod: "otomasyon",
    adres: "web-otomasyonu",
    ad: "Web otomasyonu",
    baslik: "Tekrar eden işi siteye devredin.",
    metin:
      "Sipariş gelince stok düşsün, fatura kesilsin, kargo etiketi çıksın, müşteriye WhatsApp'tan haber gitsin. Siz yalnız sonucu görün.",
    maddeler: [
      "WhatsApp, SMS ve e-posta bildirimleri",
      "Muhasebe ve e-fatura bağlantısı",
      "Randevu ve hatırlatma akışları",
      "Kendiliğinden hazırlanan raporlar",
    ],
    sayfaBasligi: "Tekrar eden işi siteye devredin.",
    sayfaMetni:
      "Her gün elle yaptığınız işleri birbirine bağlayan akışlar: sipariş, fatura, kargo, randevu ve bildirimler kendiliğinden yürür.",
    seoBasligi: "Web otomasyonu",
    seoAciklamasi:
      "Web otomasyonu: sipariş, fatura, kargo, randevu ve WhatsApp bildirim akışları. Fiyat, bağlanacak sistemlere göre teklifle belirlenir.",
    kimlerIcin: ["E-ticaret siteleri", "Randevulu işletmeler", "Pazaryeri satıcıları", "Ofis ve muhasebe işleri"],
    ozellikler: [
      {
        baslik: "Bildirimler",
        maddeler: [
          "WhatsApp, SMS ve e-posta",
          "Sipariş ve kargo durumları",
          "Randevu hatırlatmaları",
          "Size ve ekibinize anlık uyarı",
        ],
      },
      {
        baslik: "Bağlantılar",
        maddeler: [
          "Muhasebe ve e-fatura",
          "Pazaryeri ürün ve stok eşitleme",
          "Kargo firmaları",
          "Google Takvim ve E-Tablolar",
        ],
      },
      {
        baslik: "Raporlar",
        maddeler: [
          "Günlük, haftalık satış özetleri",
          "Stok ve sipariş raporları",
          "E-posta ya da WhatsApp ile gönderim",
          "Elle tablo doldurmaya son",
        ],
      },
    ],
    paketler: ["otomasyon"],
    sss: [
      {
        soru: "Fiyat neden teklif üzerine?",
        cevap:
          "Her akış farklı sistemlere bağlanır; birkaç bildirim ile muhasebe ve pazaryeri bağlantısı aynı iş değildir. İhtiyacı dinledikten sonra yazılı fiyat veririz.",
      },
      {
        soru: "Mevcut siteme eklenebilir mi?",
        cevap: "Çoğu zaman evet. Sitenizin altyapısına bakar, eklenebilecek akışları birlikte belirleriz.",
      },
    ],
  },
];

export function hizmetBul(adres: string) {
  return HIZMETLER.find((h) => h.adres === adres);
}

/** Hizmetin en düşük paket fiyatı: "₺9.999 +KDV'den başlayan", "₺65.000 +KDV" ya da "Teklif üzerine". */
export function hizmetFiyatEtiketi(adres: HizmetAdresi) {
  const paketler = PAKETLER.filter((p) => p.hizmet === adres);
  const fiyatlar = paketler.map((p) => p.fiyat).filter((f): f is number => f !== null);
  if (fiyatlar.length === 0) return "Teklif üzerine";
  const enDusuk = Math.min(...fiyatlar);
  const baslangic = paketler.length > 1 || paketler.some((p) => p.baslangic);
  return baslangic ? `${kdvHaricYaz(enDusuk, true)} başlayan` : kdvHaricYaz(enDusuk);
}

export type Referans = {
  kod: string;
  ad: string;
  alanAdi: string;
  adres: string;
  tur: string;
  sehir: string;
  ozet: string;
  maddeler: string[];
  /** Öne çıkan sayı (sitedeki bilgiden). */
  sayi?: { deger: number; onEk?: string; sonEk?: string; aciklama: string };
  masaustu: { src: string; genislik: number; yukseklik: number };
  telefon: { src: string; genislik: number; yukseklik: number; aciklama: string };
};

export const REFERANSLAR: Referans[] = [
  {
    kod: "dijitalbaskimerkezim",
    ad: "Dijital Baskı Merkezim",
    alanAdi: "dijitalbaskimerkezim.com",
    adres: "https://dijitalbaskimerkezim.com",
    tur: "E-ticaret",
    sehir: "Düzce",
    ozet: "Promosyon ürünleri, UV, DTF ve dijital baskı için online mağaza. Müşteri logosunu yükler, ürünün üzerinde görür, fiyatı teklif beklemeden öğrenir.",
    maddeler: [
      "Logonuzla deneyin: ürün üzerinde önizleme",
      "Adet seçince anında fiyat",
      "iyzico ve 3D Secure ile ödeme",
      "Kargo takibi ve aynı gün kargo bilgisi",
    ],
    masaustu: { src: "/isler/dijitalbaskimerkezim-masaustu.webp", genislik: 1440, yukseklik: 5200 },
    telefon: {
      src: "/isler/dijitalbaskimerkezim-telefon.webp",
      genislik: 780,
      yukseklik: 5200,
      aciklama: "Dijital Baskı Merkezim'in telefondaki görünümü",
    },
  },
  {
    kod: "ayyildizrobotics",
    ad: "Ayyıldız Robotics",
    alanAdi: "ayyildizrobotics.com",
    adres: "https://ayyildizrobotics.com",
    tur: "Kurumsal site ve parça kataloğu",
    sehir: "Düzce",
    ozet: "Membran pres yedek parça ve CNC hassas torna üreticisi için kurumsal site ve ölçü şemalı parça kataloğu. Fiyatlar onaylı firma üyelerine açılır.",
    maddeler: [
      "336 parça ailesi, ölçü şemasıyla",
      "Varyant tabloları ve kategori gezinmesi",
      "Türkçe, İngilizce ve Almanca",
      "Çizime göre üretim için teklif formu",
    ],
    sayi: { deger: 3305, aciklama: "varyant katalogda" },
    masaustu: { src: "/isler/ayyildizrobotics-masaustu.webp", genislik: 1440, yukseklik: 5200 },
    telefon: {
      src: "/isler/ayyildizrobotics-telefon.webp",
      genislik: 780,
      yukseklik: 5200,
      aciklama: "Ayyıldız Robotics'in telefondaki görünümü",
    },
  },
  {
    kod: "emrepide",
    ad: "Emre Pide Salonu",
    alanAdi: "emrepide.com.tr",
    adres: "https://emrepide.com.tr",
    tur: "Kurumsal site ve QR menü",
    sehir: "Düzce",
    ozet: "Azmimilli'de 25 yılı aşkın taş fırın pide salonu için site, blog ve masadan okutulan QR menü. Müşteri menüden seçer, telefonla ya da WhatsApp'tan sipariş verir.",
    maddeler: [
      "QR menü: menu.emrepide.com.tr",
      "Porsiyona göre fiyatlar ve kategoriler",
      "Telefonla ve WhatsApp'tan sipariş",
      "Blog ve sıkça sorulan sorular",
    ],
    sayi: { deger: 40, sonEk: "+", aciklama: "çeşit ürün menüde" },
    masaustu: { src: "/isler/emrepide-masaustu.webp", genislik: 1440, yukseklik: 4413 },
    telefon: {
      src: "/isler/emrepide-menu-telefon.webp",
      genislik: 780,
      yukseklik: 5200,
      aciklama: "Emre Pide'nin QR menüsü telefonda",
    },
  },
];

export const SUREC = [
  {
    fiil: "Dinliyoruz",
    metin:
      "İşinizi, müşterinizi ve hedefinizi konuşuruz. Görüşmenin sonunda kapsamı ve fiyatı yazılı olarak alırsınız.",
  },
  {
    fiil: "Çiziyoruz",
    metin: "Hazır tema kullanmadan ilk taslağı sizin için çizeriz. Beğenene kadar birlikte düzeltiriz.",
  },
  {
    fiil: "Kodluyoruz",
    metin: "Onaylanan tasarım koda dönüşür; telefonda, tablette ve bilgisayarda tek tek denenir.",
  },
  {
    fiil: "Yayında tutuyoruz",
    metin: "Sunucu, SSL, yedek ve güncellemeler bizde. Bir değişiklik istediğinizde yazmanız yeter.",
  },
];

export const SSS = [
  {
    soru: "Hangi işleri yapıyorsunuz?",
    cevap:
      "E-ticaret siteleri, kurumsal web siteleri, QR menüler, yönetim panelleri ve işinizi kendiliğinden yürüten web otomasyonları. Mevcut sitenizi yenilemek de bu işlerden biri.",
  },
  {
    soru: "Bir site ne kadar sürede hazır olur?",
    cevap:
      "Kapsama göre değişir: tek sayfalık bir tanıtım sitesiyle yüzlerce ürünlü bir mağaza aynı sürede bitmez. Görüşmeden sonra yazılı bir takvim verir, ona göre ilerleriz.",
  },
  {
    soru: "Fiyatlar neye göre belirleniyor?",
    cevap: `Paket fiyatlarımız Fiyatlar sayfasında açıkça yazılı. ${KDV_NOTU} Paketin dışında kalan bir istek olursa görüşmeden sonra yazılı teklif alırsınız; teklifte olmayan bir kalem sonradan faturaya eklenmez.`,
  },
  {
    soru: "Yıllık yenileme ne demek?",
    cevap:
      "Site yayına girdikten sonra her yıl ödenen ₺2.399'luk ücrettir; bu tutar da KDV hariçtir. Sunucu, SSL sertifikası, güvenlik güncellemeleri, yedekleme ve küçük değişiklikler için destek bu ücrete dahildir.",
  },
  {
    soru: "Siteyi kendim güncelleyebilir miyim?",
    cevap:
      "Evet. Yönetim panelinden metin, görsel, ürün ve fiyatları teknik bilgi gerekmeden değiştirirsiniz. İsterseniz güncellemeleri biz yaparız.",
  },
  {
    soru: "QR menüdeki fiyatı değiştirince kodu yeniden bastırmak gerekir mi?",
    cevap:
      "Hayır. QR kod menünün adresini taşır; panelden değiştirdiğiniz fiyat aynı kodla açılan menüde hemen görünür.",
  },
  {
    soru: "Şehir dışındayız, birlikte çalışabilir miyiz?",
    cevap:
      "Evet. Görüşmeler telefonla ya da görüntülü yapılır, taslaklar bağlantıyla paylaşılır. Referanslarımız Düzce'de ama işin hiçbir adımı aynı şehirde olmayı gerektirmiyor.",
  },
];
