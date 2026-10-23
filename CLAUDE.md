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
- Referans görselleri: `npm run referanslar [site-kodu]` → `public/isler/*.webp` (canlı sitelerden; çerez bandı
  yalnız görüntüde gizlenir, hiçbir şey kabul edilmez).

## Sayfalar

`/` ana sayfa (3B giriş, manifesto, hizmet kartları, işler, fiyat listesi) · `/hizmetler` (canlı örnekler + süreç) ·
`/hizmetler/[e-ticaret|kurumsal-site|qr-menu|web-otomasyonu]` (örnek, özellikler, paketler, referans, SSS) ·
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
- Marka (23 Ekim 2026, Yusuf'un kararı): ateş gitti. İşaret `[ · ]` (parantez + amber ışık noktası, `Logo.tsx`,
  `icon.svg`), vurgu rengi koyu mavi-petrol #063236 (koyu zeminde açık petrol #6fc3b5; token adı `alev` → `vurgu`,
  `--color-isik` amber), 3B'de alev yerine sprite ışık (cam üstüne çizilir; kırılma dokusunda kenar halkası çıkıyordu),
  cam yansıması azaltıldı ("fazla gri"). Menü çubuğu yalnız `#icerik` içindeki açık bölümlere bakar (menü penceresi
  ve açılış perdesi açık zeminli olunca tetikleyici sönüyordu). Marka taslakları scratchpad'de (`marka-taslak*.html`,
  `yesiller.html`, `petroller.html`, `mavi-petroller.html`).
- SIRADAKİ: Yusuf'un tasarım geri bildirimi (3B cam ve alev dahil); SEO aşaması Yusuf'un kararıyla sonraya kaldı (sayfa
  başlıkları kısa: denetim uyarısı; Search Console + Bing; anahtar kelimeler; Google İşletme Profili); telefonda hız
  için JS küçültme (Lenis yalnız farede, GSAP eklentileri gerektiğinde).
- YAYINDA (20 Ekim 2026): https://fanustr.ahmcloud.com (Coolify Root Team › fanus, Let's Encrypt). Ayrıntı
  `docs/yayina-alma.md`; push sonrası Coolify'da elle Deploy. Sıradaki: fanus.tr alan adı, iletişim bilgileri,
  `docs/acik-kararlar.md` (KDV, ilk yıl, paket özellikleri).
