# fanussoft tasarım dili

**Okuma:** tanıtım sitesi; kitle Türkiye'de küçük ve orta işletme sahipleri; dil sıcak, somut, abartısız;
sistem yumuşak koyu gri "gece" (3B sahne) + açık gri "gündüz" (içerik) + tek "alev" vurgusu. Kadranlar: çeşitlilik
8, hareket 9, yoğunluk 4.

## Metafor ve işaret
Fanus, alevi rüzgârdan koruyan camdır. İşletmenin ışığı (emeği) internette kolay söner; fanus onu korur, büyütür,
uzaktan görünür kılar. İşaret (21 Ekim 2026): köşeli parantez içinde alev, `[ alev ]`; parantezler fanusun iki cam
yarısı (3B'de iki kalın cam parça) ve aynı zamanda kod. Yazım: **fanus**soft ("soft" soluk renkte). Eski fener
(topuz, pirinç taban, fitil) "eski usul, falcı fanusu" bulunduğu için bırakıldı.

## Renk (yalnız token)
Seçilen (21 Ekim 2026): **Discord grisi + açık gri**, mercan vurgu. Lacivert ve degrade istenmedi: koyular yumuşak
gri, gece ile gündüz arasında renk geçişi yok (gündüz, köşeleri yuvarlak bir sayfa gibi başlar, `.gecis-yaprak`).
Koyu yalnız 3B sahnenin olduğu yerde: ana sayfa girişi + manifesto, iletişim teklif bölümü. Gerisi gündüz
(`data-zemin="acik"`): aynı token adları `--g-*` değerlerine eşlenir. Bütün çiftler WCAG AA (en az 4,5:1).

| Token | Gece | Gündüz | Kullanım |
|---|---|---|---|
| `gece` | #313338 | #f2f3f5 | zemin; gecede 3B sahnenin arkası (`--gece-zemin`) |
| `gece-2..4` | #393b41 → #4a4d55 | #ffffff → #e3e5e8 | kartlar ve yükseltilmiş yüzeyler |
| `cukur` | #2b2d31 | #f6f7f8 | kart içindeki gömülü paneller, form alanları |
| `krem` | #f2f3f5 | #1e1f22 | ana metin |
| `soluk` | #b5bac1 | #4e5058 | ikincil metin |
| `silik` | #aab0b8 | #5c5e66 | küçük yardımcı metin |
| `alev` (+ `alev-acik`, `alev-koyu`) | #ff8266 | #c9321a | TEK vurgu: birincil düğme, vurgu kelime, ışık |
| `canli` | #6fcf8f | | yalnız "yayında" durum noktası |
| `cizgi`, `cizgi-guclu` | beyaz %8 / %16 | koyu gri %10 / %18 | ayraç ve çerçeve |

Gündüzde `alev-acik` düğmenin üzerine gelinceki renktir (koyulaşır). 3B sahnede alev markanın sabit rengindedir
(`src/sahne/fanus3b.ts` › ALEV_RENKLERI: dışı kor kırmızısı, içi sarı); logodaki alev de aynı. Işık ve parlamalar elle
renk yazmaz: CSS'te `color-mix(..., var(--color-alev) ...)`, GSAP'te `vurgu()`. Gündüz zeminde süs ışıkları yok.

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
