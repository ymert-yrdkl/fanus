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
  İşaret köşeli parantez içinde alev (3B'de iki kalın cam parça, manifestoda kapı gibi açılır). Renk: antrasit
  gece (#1a1b1e) + açık gri gündüz, mercan vurgu; lacivert ve degrade yok; koyu yalnız 3B sahnede. Ayrıntı
  `docs/tasarim-dili.md`. Tema/palet seçici kaldırıldı. Telefon sabit görseli ve paylaşım görseli yeni hâlden çekildi.
  Fiyatlar 21 Ekim: tam paket kurumsal ₺45.000, e-ticaret ₺65.000. DNS ve Coolify ayrıntısı `docs/yayina-alma.md`.
  Bekleyen: fanussoft.com.tr'nin .tr kayıt sisteminde açılması (sonra Coolify'a eklenir), e-posta kutusu
  (`merhaba@fanussoft.com`), İHS'de alan adı kilidinin tekrar açılması.
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
- SIRADAKİ: SEO aşaması (sayfa başlıkları kısa: denetim uyarısı; Search Console + Bing doğrulaması; anahtar kelimeler;
  Google İşletme Profili); Yusuf'un beğenmediği telefon animasyonları listesi; fanussoft.com.tr (.tr kayıt sistemi ad
  sunucusunu işleyince Coolify › Domains › Add Domain); telefonda hız için JS küçültme (Lenis yalnız farede, GSAP
  eklentileri gerektiğinde).
- YAYINDA (20 Ekim 2026): https://fanustr.ahmcloud.com (Coolify Root Team › fanus, Let's Encrypt). Ayrıntı
  `docs/yayina-alma.md`; push sonrası Coolify'da elle Deploy. Sıradaki: fanus.tr alan adı, iletişim bilgileri,
  `docs/acik-kararlar.md` (KDV, ilk yıl, paket özellikleri).
