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
| Fiyatlar | yok | ahmcloud.com'daki gibi başlangıç fiyatı istenirse ayrı bölüm eklenir. |

## Referans sitelerde görülen sorun
- emrepide.com.tr: Next görsel iyileştiricisi `kavurmalı pide.png` için 400 dönüyor (dosya adındaki Türkçe
  karakter). Ana sayfada Kavurmalı Pide görseli boş görünüyor. Dosya adı ASCII yapılırsa (`kavurmali-pide.png`)
  düzelir. Buradaki ekran görüntüsünde görsel, sitenin kendi ham dosyasıyla gösterildi (`scripts/referans-gorselleri.mjs`).
