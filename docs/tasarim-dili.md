# fanus tasarım dili

**Okuma:** tanıtım sayfası; kitle Türkiye'de küçük ve orta işletme sahipleri; dil sıcak, somut, abartısız;
sistem koyu "gece" zemin + tek "alev" vurgusu. Kadranlar: çeşitlilik 8, hareket 9, yoğunluk 4.

## Metafor
Fanus, alevi rüzgârdan koruyan camdır. İşletmenin ışığı (emeği) internette kolay söner; fanus onu korur,
büyütür, uzaktan görünür kılar. Görsel dil buradan gelir: koyu zemin, sıcak tek ışık, cam yansımaları.

## Renk (yalnız token)
| Token | Değer | Kullanım |
|---|---|---|
| `gece` / `gece-2..4` | #0d0c0b → #2a2621 | zemin ve yüzey katmanları |
| `krem` | #f4ece0 | ana metin |
| `soluk` | #a89f92 | ikincil metin (gecede 7,4:1) |
| `silik` | #7d7468 | yalnız yer tutucu ve büyük yazı (4:1) |
| `alev` (+ `alev-acik`, `alev-koyu`) | #eba04e | TEK vurgu: birincil düğme, vurgu kelime, ışık |
| `canli` | #86c28f | yalnız "yayında" durum noktası |
| `cizgi`, `cizgi-guclu` | krem %10 / %20 | ayraç ve çerçeve |

İstisna: hizmet örneklerinin içindeki minyatür siteler (kurumsal site önizlemesi, QR menü telefonu) kendi
kâğıt renklerini kullanır; bunlar müşterinin sitesini temsil eder, fanus'un paletini değil.

## Yazı
- Başlık: Bricolage Grotesque (opsz 96, sıkı aralık). Gövde: Geist. Küçük etiket: Geist Mono büyük harf.
- `.dev-baslik` (giriş, teklif), `.bolum-baslik`, `.ara-baslik`, `.etiket` sınıfları `globals.css`'te.
- Gövde en az 16 px, satır 1,6; ikincil metin `soluk`.

## Hareket
- Her animasyonun işi var: anlatı (manifesto, süreç), kanıt (işler), geri bildirim (örnekler), yön (menü).
- Sayfada tek kayan şerit. Kaydırmaya bağlı sahneler `scrub`, belirmeler bir kez (`once`).
- Hareket azaltma tercihinde: Lenis, sabitleme ve yatay şerit kapalı; içerik durağan ve tam görünür.
- Yalnız transform/opacity/clip-path; GSAP'in canlandırdığı öğede Tailwind `scale-*` yok.

## Yasaklar
Uzun çizgi (—), bölüm numarası etiketi (01, 02), sahte istatistik, "devrim yaratın / sorunsuz / yeni nesil"
gibi dolgu sözcükler, emoji ikon, özel imleç, büyük gradyan metin, saf siyah/beyaz.
