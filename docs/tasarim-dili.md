# fanussoft tasarım dili

**Okuma:** yazılım ve teknoloji çözümleri sunan bir stüdyonun tanıtım sitesi; kitle Türkiye'de küçük ve orta
işletme sahipleri ile üretim yapan firmalar; dil sıcak, somut, abartısız. Sistem (22 Ekim 2026): **kâğıt ve
mürekkep** üstünde **afiş tipografisi**; 3B fanus da kâğıt üstünde yanar (22 Ekim gece, Yusuf: giriş açık olsun);
koyu yalnız sayfanın ortasındaki fiyat tahtasında ve karo/çerçeve gibi küçük bloklarda. Kadranlar: çeşitlilik 7,
hareket 8, yoğunluk 5.

## Metafor ve işaret

Fanus, ışığı rüzgârdan koruyan camdır. İşletmenin ışığı (emeği) internette kolay söner; fanus onu korur, büyütür,
uzaktan görünür kılar. Işık bir **ateşböceği**dir (23 Ekim 2026, Yusuf'un fikri): fanusun içinde yavaşça dolaşır,
ara ara göz kırpar, arkasında sönen bir iz bırakır; rüzgâr çıkınca telaşlanır, cam inince sakinleşir. Sosyal medyada
da aynı karakter konuşur. İşaret: `[ · ]` — iki köşeli parantez (fanusun iki cam duvarı; aynı zamanda kod, klavyeyle
yazılır) ve ortada ateşböceğinin **ışık noktası** (sarı-yeşil `--color-isik`, soluk halesiyle). Düz metinde `[.]`.
Parantezler mürekkep ya da kâğıt rengindedir; işaret vurgu renginden bağımsızdır. Yazım: **fanus**soft ("soft" soluk).
Ateş/alev imgesi bırakıldı: herkesin simgesi ("ucuz", kampanya ve simya çağrışımı); fanus ve ateşböceği markaya özgü.
3B'de cam (22 Ekim 2026): **kapalı bir silindir**, üstte ve altta omuz gibi daralıp ortada dar birer delikle açılır
(lamba camı); bilezik ya da pencere yok. İçinde ateşböceği: cam üstüne çizilen doygun sarı-yeşil disk ve beyaz öz,
küçük hale, geriye doğru küçülüp sönen iz noktaları, kâğıda düşen ve onunla kayan leke (`src/sahne/fanus3b.ts`).
Eski fener "falcı fanusu", parçalı cam anlaşılmaz, alev ucuz bulunduğu için bırakıldı.

## Neden bu sistem

Önceki hâl (gri zemin, beyaz yuvarlak kartlar, gri paragraflar, her bölümde aynı "sol başlık + paragraf + kart
ızgarası" kalıbı) "silik", "tasarımcı yapmamış gibi", "Wikipedia gibi tekdüze" bulundu. Çözüm renk değil kompozisyon:

1. Gri yerine kâğıt beyazı, gri yazı yerine mürekkep; ayraçlar belirgin ince çizgi.
2. Başlıklar afiş gibi: Bricolage Grotesque'in genişlik ekseni (wdth 86-92) ile hafif sıkışık, daha büyük.
3. Her bölüm "bölüm başı" ile açılır (`BolumBasi`: üstte çizgi, solda mono etiket, sağda başlık ve metin).
4. Kart yerine iki şey: **koyu karolar** (hizmet vitrini, paket kartlarının üst yarısı, fiyat kutuları) ve
   **çizgili satırlar** (SSS, kanallar, diğer hizmetler, kapsam listeleri). Ana sayfanın ortasında tek koyu tahta
   (fiyat listesi) ritmi kurar: gece › kâğıt › tahta › kâğıt.
5. İmleci izleyen pencere, kart üstünde ışık, dev dış çizgili şerit yazı gibi "gösteri" efektleri yok; hareket
   belirme, sabitlenen vitrin ve 3B sahneyle sınırlı.
6. Telefon ayrı tasarlanır: yana kaydırılan vitrin (işler), tek sütun karolar, kısa belirmeler; küçültülmüş masaüstü değil.

## Renk (yalnız token)

Gece (koyu tahta, karolar, çerçeveler): antrasit #1a1b1e (Discord'un koyu tonları). Gündüz: kâğıt #f4f3ee, mürekkep
#141416. Tek vurgu "vurgu" (23 Ekim 2026, Yusuf'un seçimi): gündüzde **güven mavisi #1d5fb8** (canlı ve sempatik; koyu petrol
"basık" bulundu), koyu zeminde açık mavi #8ab8ff (koyu kutularda yazı ve rakam okunsun diye). Mavi "herkeste var";
bizde yalnız düğme, bağlantı ve vurgu kelimede kalır, kimliği parantez ve ateşböceği taşır. Ateşböceğinin ışığı
sarı-yeşil #e8f266 (nokta için koyusu #cfe02e) yalnız işarette ve 3B'de. Lacivert, degrade, saf siyah/beyaz yok.
Bütün sayfalar kâğıt üstünde başlar (`main` `data-zemin="acik"`); 3B sahnenin zemini de kâğıt (`--sahne-zemin`), cam
tamamen berrak (gri gövde istenmedi), parıltı ve hale normal karışımla sıcak turuncu leke bırakır (toplamalı karışım
açık zeminde beyaza gider). Üç kapsam: varsayılan gece (`@theme`; yalnız kapsam dışı kalan parçalar),
`data-zemin="acik"` (token'lar `--g-*` değerlerine eşlenir), gündüz içinde `data-zemin="koyu"` (token'lar `--n-*`
kopyasına geri döner; tahta, karo, çerçeve). Bütün çiftler WCAG AA (en az 4,5:1).

| Token                                  | Gece              | Gündüz             | Kullanım                                                          |
| -------------------------------------- | ----------------- | ------------------ | ----------------------------------------------------------------- |
| `gece`                                 | #1a1b1e           | #f4f3ee            | zemin (tahta / kâğıt); 3B sahnenin arkası kâğıt (`--sahne-zemin`) |
| `gece-2..4`                            | #232428 → #34363b | #fbfaf7 → #e1dfd6  | yüzeyler (az kullanılır)                                          |
| `cukur`                                | #141518           | #fdfcfa            | gömülü paneller, form alanları                                    |
| `krem`                                 | #f4f3ee           | #141416            | ana metin                                                         |
| `soluk`                                | #b9bcc3           | #44454b            | ikincil metin                                                     |
| `silik`                                | #a3a7b0           | #67686f            | küçük yardımcı metin                                              |
| `vurgu` (+ `vurgu-acik`, `vurgu-koyu`) | #8ab8ff           | #1d5fb8            | TEK vurgu: birincil düğme, vurgu kelime, bağlantı                 |
| `isik` (+ `isik-koyu`)                 | #e8f266 / #cfe02e | #e8f266 / #cfe02e  | ateşböceği: işaretin noktası, 3B ışık, yedek ışık                 |
| `canli`                                | #6fcf8f           |                    | yalnız "yayında" durum noktası                                    |
| `cizgi`, `cizgi-guclu`                 | beyaz %10 / %22   | mürekkep %14 / %30 | ayraç ve çerçeve; gündüzde belirgin                               |

İş vitrinindeki tarayıcı ve telefon çerçeveleri her zeminde koyu gri (`data-zemin="koyu"`). 3B'de ateşböceği markanın sabit rengindedir (`ISIK_RENKLERI`; kâğıtta okunsun diye gövde doygun). Gündüz zeminde süs ışıkları yok. Hizmet örneklerinin içindeki minyatür siteler
kendi kâğıt renklerini kullanır (müşterinin sitesini temsil eder).

## Yazı

- Başlık: Bricolage Grotesque, eksenler opsz 96 + wdth (next/font `axes: ["opsz", "wdth"]`). Gövde: Geist. Etiket: Geist Mono büyük harf, 0,75 rem, geniş aralık.
- Sınıflar `globals.css`'te: `.dev-baslik` (giriş, sayfa başı, çağrı; 6,9vw'ye kadar, wdth 86), `.bolum-baslik`
  (wdth 88), `.ara-baslik` (wdth 92), `.cumle` (manifesto), `.rakam` (fiyat ve sayı: tablo rakamları), `.etiket`.
- Gövde en az 16 px, satır 1,6; ikincil metin `soluk`. Telefonda başlıklar ayrı ölçekte (`@media (max-width: 767px)`).

## Bileşen dili

- `BolumBasi`: her bölümün başı. Bölüm iç boşluğu `pt-10 pb-16 md:pt-14 md:pb-24`; bölümler arasında ek boşluk yok
  (üst üste binen büyük boşluklar "neden boşluk var" eleştirisini getirdi).
- Köşe yarıçapı 1,25 rem (`--radius-kart`); 2 rem'lik yuvarlak kartlar kaldırıldı.
- Düğmeler hap biçimli (`dugme.ts`): birincil vurgu, ikincil ince çerçeve.
- Koyu karo: `data-zemin="koyu"` + `rounded-[1.25rem]`; içinde token'lar gece değerlerindedir.

## Hareket

- Her animasyonun işi var: anlatı (manifesto: cam kalkar, rüzgâr, cam iner; her cümleyle o cümleyi anlatan üç
  küçük örnek kart gelir, boş sahne kalmaz), kanıt (işler), geri bildirim
  (örnekler), yön (menü). Sayfada tek kayan şerit (ince, tek renk, nokta ayraçlı).
- Kaydırmaya bağlı sahneler `scrub`, belirmeler bir kez (`once`). Telefonda sabitleme ve yatay şerit yok;
  işler yana kaydırılır, telefon ekranı CSS ile kendi kendine kayar.
- Hareket azaltma tercihinde: Lenis, sabitleme ve yatay şerit kapalı; içerik durağan ve tam görünür.
- Yalnız transform/opacity/clip-path; GSAP'in canlandırdığı öğede Tailwind `scale-*` yok.

## Yasaklar

Uzun çizgi (—), bölüm numarası etiketi (01, 02), sahte istatistik, "devrim yaratın / sorunsuz / yeni nesil"
gibi dolgu sözcükler, emoji ikon, alev/ateş ikonu, özel imleç, imleci izleyen pencere, büyük gradyan metin,
saf siyah/beyaz, gri üstüne gri.
