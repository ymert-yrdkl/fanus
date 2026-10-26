@AGENTS.md

# fanussoft (eski adı fanus.tr) — proje bağlamı

fanus.tr: Yusuf'un web stüdyosunun tanıtım sitesi (tek sayfa). İşler: e-ticaret, kurumsal site, web otomasyonu,
QR menü. Referanslar: dijitalbaskimerkezim.com (e-ticaret), ayyildizrobotics.com (kurumsal + katalog),
emrepide.com.tr (+ menu.emrepide.com.tr QR menü). Örnek alınan seviye: ahmcloud.com (Ahmet'in sitesi; kod ya da
metin kopyalanmaz). Hedef: ziyaretçi "keşke bende de olsa" desin; ağır, amaçlı animasyon.

## Çalışma kuralları

1. Dil: arayüz, metin ve kod adları Türkçe; teknik terimler İngilizce kalabilir. Yusuf TypeScript öğreniyor: sade,
   az soyutlamalı kod.
2. Tasarım dili `docs/tasarim-dili.md`. Renk yalnız `src/app/globals.css` token'larıyla (Tailwind'in hazır paleti
   kapalı: `bg-gece`, `text-krem`, `text-alev`...). Uzun çizgi (—) yok, şişirme sözcük yok, uydurma sayı/iddia yok.
   Referans bilgileri sitelerin kendisinden; yeni iddia eklenirse `src/site/icerik.ts` içinde kaynağı yazılır.
3. İletişim ve kimlik ayarları tek yer: `src/site/ayarlar.ts` ("ONAY BEKLİYOR" yazanlar Yusuf'un kararı; liste
   `docs/acik-kararlar.md`). WhatsApp numarası boşken WhatsApp düğmeleri gizlenir, teklif e-postayla gider.
4. Hareket: GSAP 3.15 (ScrollTrigger, SplitText, MotionPath; hepsi `src/hareket/gsap.ts`'den) + Lenis + three.js.
   - Her animasyon `gsap.matchMedia()` içinde `HAREKET_ACIK` koşuluyla; hareket azaltma tercihinde içerik durağan
     ve tam görünür. Ön durumlar yalnız `.hareket` sınıfıyla gizlenir (head betiği ekler; JS yoksa her şey görünür).
   - GSAP'in canlandırdığı öğede Tailwind `scale-*` / `rotate-*` kullanılmaz (CSS `scale` özelliği GSAP transform'una
     eklenir). Başlangıç durumu gerekiyorsa `globals.css`'te `transform` ile yazılır.
   - GSAP, bir zaman çizelgesinin geri çağrısında yaratılan animasyonu o çizelgenin kapsamına bağlar: başka
     bileşene olay yayınlarken `setTimeout` ile ayrı turda yayınla (`Acilis.tsx`), seçici yerine öğe ver.
   - 3B sahne (`src/sahne/`) `sahneDurumu` düz nesnesini okur; giriş+manifesto TEK zaman çizelgesinde
     (`Manifesto.tsx`), teklif bölümü `son` pozu + `sonKarisim` ile (iki tetik aynı değeri yazmasın).
5. Sunucu (Coolify) Ahmet'in; dağıtım ve DNS değişikliği Yusuf/Ahmet onayıyla. Commit mesajları Türkçe.
6. Bu proje bağımsızdır; başka projelerden kod/yapı taşınmaz.

## Komutlar

- `npm run dev` (:3300) · `npm run build` · `npm run lint` · `npm run typecheck` · `npm run format`
- Ekran görüntüsü (sistem Chrome'u, ek paket yok): `npm run ekran -- <adres> <çıktı.png> [genişlik] [yükseklik]
[--tam] [--telefon] [--bekle=ms]`. Paylaşım görseli `src/app/opengraph-image.png` böyle çekildi (1200x630,
  `--bekle=7000`).
- SEO: `npm run indexnow` her yayından sonra (Bing, Yandex'e değişen adresleri bildirir). Ayrıntı `docs/seo.md`.
- Referans görselleri: `npm run referanslar [site-kodu]` → `public/isler/*.webp` (canlı sitelerden; çerez bandı
  yalnız görüntüde gizlenir, hiçbir şey kabul edilmez).

## Sayfalar

`/` ana sayfa (3B giriş, manifesto, hizmet kartları, işler, fiyat listesi) · `/hizmetler` (canlı örnekler + süreç) ·
`/hizmetler/[e-ticaret|kurumsal-site|qr-menu|ozel-yazilim]` (örnek, özellikler, paketler, referans, SSS) ·
`/fiyatlar` · `/isler` · `/iletisim` (3B fanus + teklif formu, `?paket=` ile seçili gelir). Menü, altbilgi, açılış
perdesi ve sayfa geçiş perdesi (`src/hareket/GecisYoneticisi.tsx`) layout'ta; genel kaydırma efektleri her sayfada
yeniden kurulur (`SayfaEtkileri`). Fiyat ve paketler `src/site/icerik.ts` › PAKETLER.

## Durum (20 Ekim 2026)

- Tek sayfa tamam ve tarayıcıda (1280/390) denendi: açılış perdesi, 3B cam fanus (alev, kıvılcım, imleç rüzgârı),
  manifesto (cam kalkar, alev titrer, cam iner, ışığa dalış), kayan şerit, hizmetler (işletme adı yazılınca dört
  canlı örnek: mağaza + panel, kurumsal site düzenleyici + Google önizlemesi, otomasyon akışı, QR menü + gerçek
  Emre Pide QR kodu), yayındaki işler (sabitlenen tarayıcı çerçevesinde gerçek ekran görüntüsü kayar), süreç
  (yatay şerit), SSS, teklif oluşturucu (WhatsApp/e-posta mesajı), altbilgi kelime markası. JSON-LD, site haritası,
  robots, paylaşım görseli, 404.
- Çok sayfalı yapıya geçildi ve fiyatlar eklendi (20 Ekim 2026, Yusuf'un isteği).
- Renk teması D seçildi (20 Ekim 2026): koyu lacivert zemin + kor kırmızısı, nötr grafit kartlar, sarı-kızıl alev.
  Eski kahve tema "yapay zekâ ürünü gibi" bulundu. Tema seçici yalnız `npm run dev`'de sol altta.
- Yeni kimlik (21 Ekim 2026, YAYINDA: https://fanussoft.com): ad **fanus**soft (fanussoft.com ve fanussoft.com.tr,
  İHS'den alındı; asıl adres fanussoft.com, diğerleri ve fanustr.ahmcloud.com 301 ile oraya, `next.config.ts`).
  İşaret köşeli parantez içinde alev. Tema/palet seçici kaldırıldı.
  Fiyatlar 21 Ekim: tam paket kurumsal ₺45.000, e-ticaret ₺65.000. DNS ve Coolify ayrıntısı `docs/yayina-alma.md`.
  fanussoft.com.tr 22 Ekim'de yayında (İHS ad sunucuları knuth/dijkstra.ihsdns.com; Coolify'da domain eklendi,
  fanussoft.com'a 308). Bekleyen: e-posta kutusu (`merhaba@fanussoft.com`), İHS'de alan adı kilidinin tekrar açılması.
- Tasarım revizyonu (22 Ekim 2026): "kâğıt ve mürekkep + afiş tipografisi" sistemi, ayrıntı ve gerekçe
  `docs/tasarim-dili.md`. Ana sayfa: afiş başlık, 3B **kapalı silindir cam** (uçları omuzla daralıp dar delikle açılır; bilezik ve pencere yok) ve gürültülü
  yeni alev (`src/sahne/fanus3b.ts`), ince şerit, koyu karolu hizmet vitrini (`HizmetVitrini`), iş vitrini (telefonda
  yana kaydırma, çerçeveler her zeminde koyu), koyu fiyat tahtası (`FiyatListesi`, `data-zemin="koyu"`), tipografik
  çağrı. İç sayfalar: `SayfaBasi` sade, `BolumBasi` her bölümün başı, paket kartları koyu başlıklı, SSS/kanallar/diğer
  hizmetler çizgili satır. Konumlandırma genişledi: "yazılım ve teknoloji çözümleri"; giriş "Web'den üretime, işinizi
  yürüten yazılım."; "Web otomasyonu" → "Özel yazılım ve otomasyon" (adres aynı); nfcqrkartim referanslara eklendi
  (`REFERANSLAR`, `gosterim` alanı; görselleri `npm run referanslar nfcqrkartim`). Telefon posteri `npm run poster`.
  Yusuf'un beğenmedikleri (tekrarlama): palet listeleri, salt çizgili satır listesi ("Wikipedia"), imleci izleyen
  önizleme, düz alev ikonu, bölümler arası boşluk, parçalı cam.
- Denetim (21 Ekim 2026): `npm run denetim [-- <adres>] [--hizli]` bütün sayfaları 5 genişlikte gezer (konsol/ağ,
  taşma, takılı animasyon, görsel, SEO etiketleri, axe-core, bağlantılar, site haritası) ve 11 etkileşim senaryosunu
  oynatır (`scripts/denetim/`); rapor `.denetim/rapor.md`. Yerelde üretim derlemesine karşı: `npm run build` +
  launch.json `fanus-uretim` (:3400). Son yerel koşu 0 hata; düzeltmeler canlıda. Her değişiklikten sonra çalıştırılır.
- Telefon ve hız (22 Ekim 2026, YAYINDA): telefonda açılış perdesi yok, giriş başlığı hemen görünür, 3B sahne girişin
  parçası (sabit değil), manifesto sabitlenmez (cümleler akışta), belirmeler kısa ve yalnız saydamlıkla, başlıklar
  bölünmez, geçişte bulanıklık yok, sayfa sonu çizimi gizli; sayfa başları (SayfaBasi, Teklif: `data-sayfa-basi`)
  telefonda CSS ile belirir. 3B sahne her cihazda ilk etkileşimde yüklenir (masaüstünde en geç 6 sn). Canlı Lighthouse
  (`npm run denetim:lighthouse -- https://fanussoft.com`): masaüstü 97/95 (önce 60), telefon 85/81 (LCP ~3,5 sn,
  sınırlayan JS boyutu). Masaüstü animasyonları aynı.
- Fiyatlar KDV hariç (22 Ekim 2026, Yusuf): görünen her fiyatın yanında "+KDV", fiyat bölümlerinde ve teklif
  oluşturucuda "Fiyatlara KDV dahil değildir." Metin tek yerde: `src/site/icerik.ts` › `KDV_EKI`, `KDV_NOTU`.
- Canlı Lighthouse yeni tasarımla (22 Ekim gece): ana sayfa telefon 93 (LCP 2,6 sn, önce 85), masaüstü 93; e-ticaret
  91/91. Paylaşım görseli 1200x720 çekilip üstten 630'a kırpılır (alt satır yarım kalmasın).
- Giriş kâğıt üstünde (22 Ekim gece, Yusuf): bütün sayfalar `main data-zemin="acik"` ile açık başlar; 3B sahne kâğıt
  zemine çizer (`--sahne-zemin`), cam berrak (gri gövde yok), parıltı/hale/kıvılcım normal karışım; geçiş yaprağı
  (`GecisBandi`) ve örtünün gece tonu kaldırıldı; menü ve açılış perdesi de açık. Manifesto sahnelerinde her cümleyle
  üç örnek kart (masaüstünde sahnede süzülür, telefonda cümlenin altında); kartlar iddia değil örnek ekrandır.
- Mobil uygulama hizmeti ve PatiSkor (23 Ekim 2026, YAYINDA): `HIZMETLER` › `mobil` (`/hizmetler/mobil-uygulama`,
  paket `mobil` teklifle, `MobilDemo` canlı örnek, minyatür `TelefonGorseli`), ana sayfa vitrini 5 kart (4-2-2-4-6);
  `REFERANSLAR` › `patiskor` (kaynak App Store id6777159876, Ahmet'in uygulaması, iOS, ücretsiz + Premium; mağaza
  görselleri `public/isler/patiskor-1..3.webp`); `Isler` `uygulama` alanlı referansı yan yana telefon çerçeveleriyle
  gösterir, `sehir` isteğe bağlı. Giriş metni, şerit, meta başlık, altbilgi ve JSON-LD "mobil uygulama" ile güncellendi.
- Marka (23-25 Ekim 2026, Yusuf'un kararları): turuncu alev gitti; işaret `[ · ]` (parantez + ışık noktası ve halesi,
  `Logo.tsx`, `icon.svg`; token adı `alev` → `vurgu`). Koyu petrol #063236 yayında "basık" bulunup geri alındı; sarı
  Düzce'deki rakip yüzünden, ateşböceği (sarı-yeşil) "yeşilden komple vazgeçelim" diye elendi. Şimdiki: vurgu
  **güven mavisi #2a6ad0** (koyu zeminde #8fbbff; daha açığı kâğıt rengi düğme yazısıyla AA'yı geçmez), ışık
  `--color-isik` #7f93ff / `--color-isik-koyu` #2f72f5. 3B'de (`fanus3b.ts`) **mavi-mor jet alevi** (ocak/jet motoru:
  gölgelendiriciyle çizilen dik ve güçlü gövde, beyaz-mavi çekirdek, mor uçlar, şok elması düğümleri; profil
  gölgelendiricide analitik, gövde cam üstüne çizilir, kırılma geçişinde kenarlar basamaklıydı). Manifesto masaüstünde:
  fanus ortada (`POZLAR.genis.manifesto` x 0, boy 0,58), cümle altta ortalı, kartlar dört köşeye dağılır (sahne
  başına bir köşe kayar), rüzgâr ipucu üstte. Menü çubuğu yalnız `#icerik` içindeki açık bölümlere bakar.
- Hizmet vitrini (25 Ekim 2026, YAYINDA 6629515): kartlar `DUZEN` sırasıyla (4+2, 2+4, 6; HIZMETLER sırasında
  boşluk kalıyordu), bütün minyatürler aynı çerçeveli panelde (`PANEL`).
- SEO ve hız (25 Ekim 2026, Yusuf: "görünür olalım"): `src/site/seo.ts` (sayfaMetasi, cekirdekVeri, sayfaVerisi,
  jsonLd). Anahtar kelimeli başlık ve açıklamalar (ana sayfa "Düzce Web Tasarım, E-ticaret ve Özel Yazılım"; plan ve
  gerekçe `docs/seo.md`); iç sayfaların paylaşım etiketleri artık kendi (önce hepsi ana sayfayı gösteriyordu, og:image
  her sayfada açıkça); her sayfada işletme (ProfessionalService, Düzce adresi, logo, fiyat aralığı, hizmet kataloğu)
  - WebSite + sayfa düğümü, işlerde WebSite/MobileApplication; site haritasında görseller; `/llms.txt` (yapay zekâ
    aramaları); IndexNow anahtarı `public/<anahtar>.txt` + `npm run indexnow`; doğrulama kodları `ayarlar.ts` ›
    `dogrulama`; `/logo.png`, Apple simgesi, `manifest.webmanifest`. Eski metinler düzeldi ("Dört hizmet" → beş,
    "Üçü de Düzce'den" kalktı). Hız: MotionPath yalnız `OtomasyonDemo`'da, Lenis yalnız fareli cihazda sonradan iner
    (ana sayfa JS 279 → 265 KB gzip). Telefonda açılış: sonsuz CSS animasyonları yalnız ekrandayken oynar
    (`src/hareket/EkrandaOynat.tsx`, document.getAnimations + IntersectionObserver; ekran dışındakiler ilk 6 sn'de ana
    iş parçacığını 3,8 → 2,0 sn meşgul ediyordu), kayan şerit ekrana girince başlar, otomasyon düğümü renk yerine
    saydamlıkla yanar, telefonda belirmeler 49 ScrollTrigger yerine tek IntersectionObserver + CSS (`.belir-bekliyor`),
    telefon posteri ana sayfa HTML'ine gömülü (data: adresi). Gerçek telefon benzetiminde (4x yavaş işlemci) LCP 1,0 sn;
    Lighthouse'un telefon tahmini (simülasyon) oynak: canlıda ana sayfa önce 66-85, bu işlerden sonra 88;
    e-ticaret sayfası telefonda 73 (LCP sayfa başı metni, sıradaki iş); masaüstü 95-96; SEO, erişilebilirlik ve en iyi
    uygulamalar her sayfada 100 (26 Ekim 2026). Yusuf'un yapacakları (Search Console, İşletme Profili, yorumlar, müşteri
    sitelerinden bağlantı, Bing/Yandex, telefon/Instagram, içerik) `docs/seo.md`'de sırayla.
- Google hesapları (26 Ekim 2026, softfanus@gmail.com "FanusSoft", Chrome'un ayrı profili): Search Console mülkü
  https://fanussoft.com/ (URL ön eki) HTML etiketiyle doğrulandı (`ayarlar.ts` › `dogrulama.google`; etiket silinmesin),
  site haritası gönderildi, ana sayfa yeniden taramaya alındı. İşletme Profili "fanussoft" açıldı: kategori Web Sitesi
  Tasarımcısı, ziyaret edilecek konum yok (hizmet bölgesi işletmesi), bölge Türkiye + Düzce, web sitesi, telefonsuz;
  doğrulama için gizli posta adresi ve doğrulama adımı Yusuf'ta. Bing/Yandex hesap açmayı gerektirdiği için Yusuf'ta.
- Telefon hızı (26 Ekim 2026, Google PageSpeed telefon): ana sayfa 85-90, e-ticaret 83 → 90, SEO/erişilebilirlik/en iyi
  uygulamalar 100. Telefonda ilk ekran JavaScript'i beklemeden görünür (yalnız ekranın altındakiler `.belir-bekliyor`
  ile belirir), hizmet sayfası canlı örnekleri `next/dynamic` ile ayrı parça. Denenip alınmayanlar: stili HTML'e gömmek
  (`inlineCss`; Next stili sayfa verisinde ikinci kez yazıyor, HTML 2 kat), posteri gömmek (aynı sebep), etiket ya da
  başlık yazı tipini öncelikten çıkarmak (geç gelince kırıntı ve başlıklar kayıyor), başlık yazı tipinde opsz'yi 96'ya
  sabitlemek (185 → 93 KB ama logo ve küçük yazılar sıkışıyor). Kalan sınır: açılıştaki React + GSAP JavaScript'i;
  büyük adım GSAP'ı gerektiğinde yüklemek (19 dosya).
- Tam SEO ve hız turu (27 Ekim 2026, Yusuf: "mobilde ve webde 100, müthiş SEO"):
  - SEO: iç sayfalarda H1'in küçük ilk satırı aranan kelime (`SayfaBasi` › `ustBaslik`, hizmetlerde `icerik.ts` ›
    `ustBaslik`; görünen kırıntıda yalnız üst sayfalar); "Özel yazılım" adresi `/hizmetler/ozel-yazilim` (eski adres
    kalıcı yönlenir); `/rehber` + 4 yazı (`src/site/rehber.ts`, Article + SSS verisi, yasal iddialar resmi kaynaklı,
    kaynaklar dosyanın başında; hizmet sayfalarında "Rehberden" bağlantıları; menü, altbilgi, site haritası, llms.txt);
    HSTS; hreflang tr-TR/x-default. Ayrı "Düzce web tasarım" sayfası açılmadı (ana sayfayla aynı kelimeye yarışırdı).
  - Yazı tipleri kendi sunucumuzdan, küçültülmüş: `scripts/yazitipi-uret.py` (kaynak `kaynak/yazitipi/`, çıktı
    `public/yazitipi/*.özet.woff2`, `src/app/yazitipleri.css`, `src/site/yazitipleri.ts`), 269 → 104 KB; Bricolage
    opsz 96'ya sabit, logo için ayrı 1,4 KB'lık "Bricolage Logo" (`.logo-yazi`); next/font kaldırıldı.
  - GSAP gerektiğinde yüklenir (`src/hareket/gsap.ts` › `useHareket`, `hareketYukle`; paket `gsap-paketi.ts`):
    masaüstünde hemen, telefonda ilk dokunuş/kaydırmada (telefonda ilk ekran ve aşağıdaki belirmeler GSAP'sız: CSS +
    IntersectionObserver). `@gsap/react` kaldırıldı. Ana sayfa açılış JS 265 → 178 KB gzip.
  - Ölçümler (yerel Lighthouse, telefon tahmini): ana sayfa 85 → 89, e-ticaret 85 → 92, rehber 91-94; masaüstü 99-100;
    gerçek kısıtlamalı telefon ölçümünde ana sayfa 69 → 78 (bloklanma 1,7 → 0,75 sn). Telefonda 100 olmuyor: bütün
    JavaScript engellense bile 98 (yazı tipi + stil + HTML); kalan iş React'ın sayfayı canlandırması.
  - Canlı Google PageSpeed (27 Ekim, yayına alındıktan sonra, ana sayfa): masaüstü 100/100/100/100; telefon hız
    94, 94, 97 (üç koşu), erişilebilirlik/en iyi uygulamalar/SEO 100. Telefonda LCP öğesi poster görseli
    (`fanus-telefon.webp`, 9,5 KB); LCP 2,6-2,9 sn çünkü Lighthouse ilk çizimden önce istenen bütün JS ve yazı
    tiplerini LCP'ye sayıyor (Next/React çalışma zamanı + 104 KB yazı tipi).
  - Search Console'da yeni adresler için dizine ekleme istendi (27 Ekim): `/rehber`, 4 rehber yazısı,
    `/hizmetler/ozel-yazilim`; IndexNow da gönderildi (`npm run indexnow`).
  - Denenip alınmayanlar: Suspense ile parça parça canlandırma (masaüstünde SplitText henüz canlanmamış bölümün
    DOM'unu değiştiriyor, React #418), `content-visibility` (gerçek ölçümde kazanç yok), stili gömmek (HTML 2 kat).
- SIRADAKİ: Yusuf'un tasarım geri bildirimi; sosyal medya görsel dili; hesap gerektiren SEO adımları (`docs/seo.md`:
  İşletme Profili doğrulaması ancak yüz yüze hizmet ve belgeyle, Bing/Yandex); rehbere düzenli yeni yazı; Hakkımızda
  sayfası (Yusuf'un bilgisiyle).
- YAYINDA (20 Ekim 2026): https://fanustr.ahmcloud.com (Coolify Root Team › fanus, Let's Encrypt). Ayrıntı
  `docs/yayina-alma.md`; push sonrası Coolify'da elle Deploy. Sıradaki: fanus.tr alan adı, iletişim bilgileri,
  `docs/acik-kararlar.md` (KDV, ilk yıl, paket özellikleri).
