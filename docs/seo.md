# fanussoft SEO

Hedef: "Düzce web tasarım", "e-ticaret sitesi yaptırma", "kurumsal web sitesi fiyatları", "QR menü" gibi aramalarda
ve yapay zekâ aramalarında (ChatGPT, Claude, Perplexity, Gemini, Google'ın yapay zekâ özetleri) fanussoft'un
çıkması. Teknik taraf sitede hazır (25 Ekim 2026). Sıralamayı bundan sonra en çok üç şey belirler: Google İşletme
Profili ve yorumlar, başka sitelerden gelen bağlantılar, düzenli yeni içerik. Bunlar zaman ister (haftalar, aylar).

## Anahtar kelime planı

Her sayfa tek bir arama niyetine bakar. Başlık ve açıklama `src/site/seo.ts` › `sayfaMetasi` ile yazılır; hizmet
sayfalarınınki `src/site/icerik.ts` › `seoBasligi`, `seoAciklamasi`.

| Sayfa                       | Ana arama                         | Başlık                                           |
| --------------------------- | --------------------------------- | ------------------------------------------------ |
| `/`                         | düzce web tasarım, düzce yazılım  | Düzce Web Tasarım, E-ticaret ve Özel Yazılım     |
| `/hizmetler`                | web tasarım hizmetleri            | Web Tasarım ve Yazılım Hizmetleri                |
| `/hizmetler/e-ticaret`      | e-ticaret sitesi yaptırma, fiyatı | E-ticaret Sitesi Yaptırma ve Fiyatı              |
| `/hizmetler/kurumsal-site`  | kurumsal web sitesi yaptırma      | Kurumsal Web Sitesi Yaptırma ve Fiyatı           |
| `/hizmetler/qr-menu`        | qr menü, restoran dijital menü    | QR Menü: Restoran ve Kafe İçin Dijital Menü      |
| `/hizmetler/web-otomasyonu` | özel yazılım, iş otomasyonu       | Özel Yazılım ve İş Otomasyonu                    |
| `/hizmetler/mobil-uygulama` | mobil uygulama geliştirme         | Mobil Uygulama Geliştirme: iOS ve Android        |
| `/fiyatlar`                 | web sitesi fiyatları (yıl)        | Web Sitesi ve E-ticaret Fiyatları (derleme yılı) |
| `/isler`                    | referanslar                       | Referanslar: Yayındaki Siteler ve Uygulamalar    |
| `/iletisim`                 | teklif                            | İletişim ve Teklif Al                            |

Kurallar: başlık 60 karakteri, açıklama 160 karakteri geçmez (denetim uyarır); açıklamada fiyat varsa
PAKETLER'den gelir; sayfada yazmayan bir iddia başlığa ya da açıklamaya girmez. Altbilgide "Düzce merkezli
yazılım stüdyosu" her sayfada yerel sinyal verir.

## Sitede olanlar

- **Başlık, açıklama, kanonik adres** her sayfada ayrı. **Paylaşım etiketleri** (Open Graph, X) her sayfada ayrı:
  önceden iç sayfalar paylaşılınca ana sayfanın başlığı ve adresi çıkıyordu (Next bu alanları birleştirmiyor).
- **Yapılandırılmış veri** (schema.org, `src/site/seo.ts`): her sayfada işletme (ProfessionalService: ad, logo,
  Düzce adresi, hizmet bölgesi Düzce + Türkiye, fiyat aralığı, hizmet kataloğu) ve web sitesi; her sayfanın kendi
  düğümü (WebPage, CollectionPage, ContactPage); kırıntı yolu; hizmet sayfalarında Service + fiyatlı Offer + SSS
  (FAQPage); fiyatlarda paket kataloğu; işlerde her referans (WebSite / MobileApplication).
- **Site haritası** `/sitemap.xml`: her sayfa, derleme tarihi, sayfadaki görseller (Google Görseller).
- **robots.txt**: her arayıcıya açık (yapay zekâ arayıcıları dahil), site haritası adresi.
- **/llms.txt**: yapay zekâ aramaları için sitenin düz metin özeti (hizmetler, fiyatlar, işler, iletişim);
  `src/app/llms.txt/route.ts`, bilgiler src/site'tan okunur.
- **Arama motoru ayarları**: büyük görsel önizlemesi, sınırsız alıntı (`max-image-preview: large`,
  `max-snippet: -1`), dil `tr`, logo `/logo.png` (512), Apple simgesi, uygulama bildirimi (`manifest.webmanifest`).
- **IndexNow**: `public/<anahtar>.txt` ve `npm run indexnow`. Bing, Yandex, Seznam ve Naver'e "bu adresler
  değişti" bildirir; her yayından sonra çalıştırılır.
- **Doğrulama etiketleri**: `src/site/ayarlar.ts` › `dogrulama` (Google, Bing, Yandex). Boşken yazılmaz.
- **Hız**: üç boyutlu sahne ilk etkileşimde yüklenir; Lenis yalnız fareli cihazda iner; MotionPath eklentisi yalnız
  otomasyon örneğinde; sonsuz animasyonlar yalnız ekrandayken oynar; telefon posteri HTML'e gömülü. Google sıralamada
  gerçek kullanıcı ölçümlerini (Core Web Vitals) kullanır; Lighthouse'un telefon puanı bir tahmindir ve oynar.
  Ayrıntı CLAUDE.md'de.

## Yusuf'un yapacakları (hesap gerektirir; önem sırasıyla)

1. **Google Search Console**: search.google.com/search-console › Mülk ekle › Alan adı `fanussoft.com` › verilen TXT
   kaydını İHS DNS'e ekle (ya da "URL öneki" › HTML etiketi › kodu `ayarlar.ts` › `dogrulama.google`'a yaz, yayına
   al). Sonra Site haritaları › `sitemap.xml` gönder.
2. **Google İşletme Profili** (yerel aramada en etkili adım): business.google.com › "fanussoft" › kategori
   "Web sitesi tasarımcısı" (ek: "Yazılım şirketi", "İnternet pazarlama hizmeti") › hizmet bölgesi işletmesi, bölge
   Düzce + Türkiye › web sitesi fanussoft.com › hizmetler ve fiyatlar › logo (`public/logo.png`) ve iş görselleri
   (`public/isler/`). Doğrulama kartı ya da video ile gelir.
3. **Yorumlar**: Emre Pide, Dijital Baskı Merkezim, Ayyıldız Robotics'ten İşletme Profili'ne birer yorum.
4. **Referans sitelerden bağlantı**: müşteri sitelerinin altbilgisine "Tasarım ve yazılım: fanussoft" bağlantısı
   (müşterinin onayıyla). En güçlü bağlantılar bunlar; her biri ayrı projede yapılır.
5. **Bing Webmaster Tools**: bing.com/webmasters › Search Console'dan içe aktar (tek tık). **Yandex Webmaster**:
   webmaster.yandex.com › site ekle › meta etiketi kodunu `dogrulama.yandex`'e yaz.
6. **Telefon ve sosyal hesap**: `ayarlar.ts` › `telefon`, `whatsapp`, `instagram` dolunca hem sitede görünür hem
   yapılandırılmış veriye (telephone, sameAs) girer. Yerel aramada ad, adres ve telefonun her yerde aynı olması önemli.
7. **İçerik**: ayda bir-iki yazı ("e-ticaret sitesi kurmak için neler gerekir", "QR menü nasıl çalışır", "web sitesi
   fiyatı neye göre değişir"). Yazılar için `/rehber` bölümü açılabilir; uydurma sayı yok, kendi işlerimizden örnek.

## Her yayından sonra

```bash
npm run indexnow
```
