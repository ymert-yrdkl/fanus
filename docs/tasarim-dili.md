# fanus tasarım dili

**Okuma:** tanıtım sayfası; kitle Türkiye'de küçük ve orta işletme sahipleri; dil sıcak, somut, abartısız;
sistem koyu "gece" zemin + tek "alev" vurgusu. Kadranlar: çeşitlilik 8, hareket 9, yoğunluk 4.

## Metafor
Fanus, alevi rüzgârdan koruyan camdır. İşletmenin ışığı (emeği) internette kolay söner; fanus onu korur,
büyütür, uzaktan görünür kılar. Görsel dil buradan gelir: koyu zemin, sıcak tek ışık, cam yansımaları.

## Renk (yalnız token)
Seçilen tema (20 Ekim 2026): **D, koyu lacivert + kor kırmızısı** (`data-tema="lacivert-kor"`, `globals.css`).
Sayfa zemini lacivert; kartlar ve iç paneller nötr grafit/siyah (lacivert yalnız zeminde). Diğer temalar (eski kahve,
kor, gece, lacivert) yalnız geliştirmedeki seçicide karşılaştırma için durur (`src/site/tema.ts`).

| Token | D değeri | Kullanım |
|---|---|---|
| `gece` | #050d1e | sayfa zemini (koyu lacivert), 3B sahnenin arkası |
| `gece-2..4` | #111215 → #232428 | kartlar ve yükseltilmiş yüzeyler (nötr grafit) |
| `cukur` | #09090b | kart içindeki gömülü paneller, form alanları |
| `krem` | #f3f5f8 | ana metin (soğuk beyaz) |
| `soluk` | #9ca1ab | ikincil metin |
| `silik` | #6c7079 | yalnız yer tutucu ve büyük yazı |
| `alev` (+ `alev-acik`, `alev-koyu`) | #ff4a2b | TEK vurgu: birincil düğme, vurgu kelime, ışık |
| `canli` | #6fcf8f | yalnız "yayında" durum noktası |
| `cizgi`, `cizgi-guclu` | beyaz %8 / %16 | ayraç ve çerçeve |

3B sahnenin renkleri temaya göre `src/sahne/fanus3b.ts` › SAHNE_TEMALARI'nda (alev ortası sarı, kenarı kızıl; metal
gümüş). Işık ve parlamalar elle renk yazmaz: CSS'te `color-mix(..., var(--color-alev) ...)`, GSAP'te `vurgu()`.

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
