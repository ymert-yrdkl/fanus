// Sayfadaki metinler. Referans bilgileri sitelerin kendisinden alındı (20 Ekim 2026);
// sayı ya da iddia eklerken kaynağını bu dosyaya not düşün.

export type HizmetKodu = "eticaret" | "kurumsal" | "otomasyon" | "qrmenu";

export type Hizmet = {
  kod: HizmetKodu;
  ad: string;
  baslik: string;
  metin: string;
  maddeler: string[];
};

export const HIZMETLER: Hizmet[] = [
  {
    kod: "eticaret",
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
  },
  {
    kod: "kurumsal",
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
  },
  {
    kod: "otomasyon",
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
  },
  {
    kod: "qrmenu",
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
  },
];

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
    metin: "Alan adı, sunucu, yedek ve güncellemeler bizde. Bir değişiklik istediğinizde yazmanız yeter.",
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
    soru: "Fiyat nasıl belirleniyor?",
    cevap:
      "Sayfa sayısına, özelliklere ve bağlanacak sistemlere göre. Görüşmeden sonra yazılı teklif alırsınız; teklifte olmayan bir kalem sonradan faturaya eklenmez.",
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
