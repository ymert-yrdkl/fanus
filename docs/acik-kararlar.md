# Açık kararlar (Yusuf)

Sitede şu an yer tutucu ya da onay bekleyen bilgiler. Değerler `src/site/ayarlar.ts` içinde.

| Konu | Şu an | Not |
|---|---|---|
| WhatsApp numarası | boş | Boşken WhatsApp düğmeleri gizli, teklif e-postayla gider. Biçim: `905xxxxxxxxx`. |
| Telefon | boş | Altbilgide ve teklif bölümünde gösterilir. |
| E-posta | `merhaba@fanus.tr` | Kutunun açılmış olması gerekir; açılmadıysa gerçek adresle değiştirin. |
| Instagram | boş | Altbilgide gösterilir. |
| Alan adı | fanustr.ahmcloud.com (geçici) | fanus.tr bağlanınca Coolify'da alan adı ve `NEXT_PUBLIC_SITE_ADRESI` güncellenir. |
| Süreç ve SSS metinleri | taslak | "Görüşmeden sonra yazılı teklif ve takvim", "teklifte olmayan kalem faturaya eklenmez", "alan adı, sunucu, yedek ve güncellemeler bizde" birer taahhüttür; doğru değilse `src/site/icerik.ts`'te düzeltin. |
| Fiyatlar | Yusuf'un verdiği (20 Ekim 2026) | Tek sayfa ₺9.999, tam paket kurumsal ₺25.000, e-ticaret ₺25.000, QR menü ₺9.999'dan; yenileme ₺2.399/yıl. Web otomasyonu "teklif üzerine" (fiyat verilmedi). `src/site/icerik.ts` › PAKETLER. |
| KDV | belirtilmedi | Fiyatlar KDV dahil mi, hariç mi? Tüketiciye satışta KDV dahil gösterim gerekir; netleşince kartlara yazılır. |
| İlk yıl | belirtilmedi | ₺9.999 / ₺25.000 ilk yılın barındırmasını kapsıyor mu, yenileme 2. yıldan mı başlıyor? Sayfada yalnız "yıllık yenileme ₺2.399" yazıyor. |
| Yenilemeye dahil olanlar | taslak | Sunucu, SSL, güncelleme, yedekleme, izleme, küçük değişiklik desteği yazıldı (`YENILEMEYE_DAHIL`). Alan adı ücreti yazılmadı. |
| Paket özellikleri | taslak | Özellik listeleri Claude'un önerisi (`PAKETLER`, `HIZMETLER[].ozellikler`). Örn. tek sayfada "içeriği biz güncelleriz", QR'da "başlangıç fiyatı tek dilli standart menü için" birer taahhüt. |

## Referans sitelerde görülen sorun
- emrepide.com.tr: Next görsel iyileştiricisi `kavurmalı pide.png` için 400 dönüyor (dosya adındaki Türkçe
  karakter). Ana sayfada Kavurmalı Pide görseli boş görünüyor. Dosya adı ASCII yapılırsa (`kavurmali-pide.png`)
  düzelir. Buradaki ekran görüntüsünde görsel, sitenin kendi ham dosyasıyla gösterildi (`scripts/referans-gorselleri.mjs`).
