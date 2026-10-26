// Rehber yazıları: arama niyetine cevap veren, uydurma sayı içermeyen yazılar. Fiyat ve süreler src/site/icerik.ts ile aynı.
// Paragraf içinde iç bağlantı: [metin](/yol)
//
// Yasal bilgilerin kaynakları (26 Ekim 2026'da okundu):
// - ETBİS: ticaret.gov.tr/ic-ticaret/sikca-sorulan-sorular/elektronik-ticaret (faaliyete başlamadan önce kayıt, e-Devlet,
//   KEP adresi, ücretsiz, yurt içi pazaryeri satıcısına yükümlülük yok) ve
//   ticaret.gov.tr/duyurular/elektronik-ticaret-bilgi-sistemine-etbis-kayit-ve-bildirim-esaslari (değişiklik 30 gün içinde).
// - Mesafeli Sözleşmeler Yönetmeliği, güncel metin: mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=20237&mevzuatTur=KurumVeKurulusYonetmeligi&mevzuatTertip=5
//   (m.5 ön bilgilendirme, m.6/2-b gönderim kısıtlaması ve ödeme araçları, m.7 teyit, m.9 14 gün cayma, m.12 14 gün iade,
//   m.15 istisnalar, m.16 en çok 30 gün teslim).
// - KVKK aydınlatma: kvkk.gov.tr/Icerik/2033/Aydinlatma-Yukumlulugu- ; çerez: kvkk.gov.tr/Icerik/7595/2022-1358
// - 6563 sayılı Kanun m.3 (tanıtıcı bilgiler) ve m.6 (ticari ileti için önceden onay): mevzuat.gov.tr/MevzuatMetin/1.5.6563.pdf
// - İYS kaydı: iys.org.tr/iys/sss
// - e-Arşiv'de “Bu satış internet üzerinden yapılmıştır.” ifadesi: VUK 509 Sıra No.lu Tebliğ güncel metni (gib.gov.tr, 2026)
// - Üye işyeri belgeleri ve site şartları: iyzico.com/destek/yardim-merkezi/basvuru/gerekli-evraklar , paytr.com/en/virtual-pos
// - .com.tr belgesiz tahsis (14 Eylül 2022): trabis.gov.tr/content/belgesizeGecis
// - Fiyat Etiketi Yönetmeliği m.8, güncel metin: mevzuat.gov.tr/MevzuatMetin/yonetmelik/7.5.19819.pdf
//   (RG 11/10/2025-33044: giriş kapısı ve masa, karekod, talep hâlinde liste; RG 30/1/2026-33153: servis/masa/kuver ücreti)
import type { HizmetAdresi } from "./icerik";

export type RehberBolumu = { baslik: string; paragraflar: string[]; maddeler?: string[] };
export type RehberYazisi = {
  adres: string;
  baslik: string;
  seoBasligi: string;
  aciklama: string;
  ozet: string;
  /** ISO tarih */
  tarih: string;
  okumaDakika: number;
  ilgiliHizmet: HizmetAdresi;
  bolumler: RehberBolumu[];
  sss: { soru: string; cevap: string }[];
};

export const REHBER: RehberYazisi[] = [
  {
    adres: "e-ticaret-sitesi-kurmak-icin-gerekenler",
    baslik: "E-ticaret sitesi kurmak için neler gerekir?",
    seoBasligi: "E-ticaret Sitesi Kurmak İçin Gerekenler",
    aciklama:
      "E-ticaret sitesi kurmak için gerekenler: vergi kaydı, ETBİS, sanal POS başvurusu, alan adı, yasal metinler ve kargo. Satışa başlamadan önceki adımlar.",
    ozet: "Vergi kaydından ETBİS'e, sanal POS başvurusundan mesafeli satış sözleşmesine kadar, kendi sitenizden satışa başlamadan önce hazırlamanız gerekenler.",
    tarih: "2026-10-26",
    okumaDakika: 5,
    ilgiliHizmet: "e-ticaret",
    bolumler: [
      {
        baslik: "Önce işletme ve vergi kaydı",
        paragraflar: [
          "Kendi sitenizden düzenli satış yapacaksanız ilk adım bir vergi kaydıdır. Şahıs şirketi mi, limited şirket mi kuracağınız; ciro beklentinize, ortaklık yapınıza ve sorumluluk tercihinize göre değişir. Bu kararı mali müşavirinizle birlikte verin.",
          "Vergi kaydı yalnız fatura kesmek için değil, ödeme altyapısı için de gerekir. Kartla ödeme alan sanal POS hizmetleri genellikle vergi levhası olan bir işletme ister. iyzico gibi kuruluşlar, vergi levhasındaki ad ile paranın yatacağı banka hesabının sahibinin aynı olmasını da şart koşar.",
          "e-Arşiv Fatura uygulamasındaki işletmeler, internetten yaptıkları satışların faturasına “Bu satış internet üzerinden yapılmıştır.” ifadesini yazar. e-Arşiv ve e-Fatura'ya geçiş zorunluluğu ciroya ve defter türüne göre değiştiği için hangi belgeyi düzenleyeceğinizi satışa başlamadan önce mali müşavirinizle netleştirin.",
        ],
      },
      {
        baslik: "ETBİS kaydı: satışa başlamadan önce",
        paragraflar: [
          "Kendi internet sitesinden ya da mobil uygulamasından satış yapan işletmeler, Ticaret Bakanlığı'nın Elektronik Ticaret Bilgi Sistemi'ne (ETBİS) kayıt olmak zorundadır. Bakanlığın açıklamasına göre kayıt, faaliyete başlamadan önce yapılmalıdır.",
          "Kayıt eticaret.gov.tr üzerinden, e-Devlet girişiyle yapılır; evrak ya da ücret istenmez. Başvurudan önce bir KEP (kayıtlı elektronik posta) adresi almanız gerekir. Kayıt sırasında sitenizin alan adını, sattığınız ürün türlerini ve ödeme yöntemlerinizi bildirirsiniz.",
          "Bu bilgiler değişirse 30 gün içinde güncellemeniz istenir. Yalnız yurt içindeki pazaryerlerinde satış yapanların kayıt yükümlülüğü yoktur; kendi sitenizi açtığınızda bu durum değişir.",
        ],
      },
      {
        baslik: "Alan adı, SSL ve ödeme altyapısı",
        paragraflar: [
          "Alan adı kısa, kolay yazılan ve markanıza ait olmalı. .com.tr uzantısı Eylül 2022'den bu yana belge istenmeden, ilk başvurana verilir. Alan adının işletmeniz adına kayıtlı olmasına dikkat edin.",
          "SSL sertifikası (adres çubuğundaki https) bilgilerin şifreli taşınmasını sağlar; ödeme kuruluşları da ödeme sayfasında SSL ister. Kartla ödeme için iyzico ya da PayTR gibi bir ödeme kuruluşunda üye işyeri hesabı açarsınız. Başvuru çevrim içi yapılır, belgeler sonradan yüklenir.",
          "Ödeme kuruluşlarının başvuruda genellikle istedikleri:",
        ],
        maddeler: [
          "Vergi levhası",
          "İmza sirküleri (şahıs işletmelerinde imza beyannamesi)",
          "Yetkililerin ya da ortakların kimlik bilgileri",
          "Hesap sahibinin ve IBAN'ın göründüğü banka belgesi",
          "Ürünleri, fiyatları ve yasal sayfaları hazır, yayında bir site",
          "Sitede unvan ya da ad soyad, MERSİS ya da vergi numarası, adres, KEP adresi, e-posta ve telefon",
        ],
      },
      {
        baslik: "Yasal metinler: sitede olması gerekenler",
        paragraflar: [
          "Tüketiciye internetten satış yapan her site Mesafeli Sözleşmeler Yönetmeliği'ne uymak zorundadır. Müşteri siparişi onaylamadan önce bilgilendirilmeli ve bu bilgileri aldığını onaylamalıdır; yönetmeliğe göre bu teyit alınmazsa sözleşme kurulmamış sayılır.",
          "Elektronik Ticaretin Düzenlenmesi Hakkında Kanun da tanıtıcı bilgilerinizin sitede kolayca ulaşılabilir ve güncel olmasını, uyguladığınız gizlilik kurallarının açıklanmasını ister. Bir meslek odasına bağlıysanız bunu da belirtmeniz gerekir.",
          "Sitenizde en az şu metinler bulunmalı:",
        ],
        maddeler: [
          "Ön bilgilendirme formu: ürünün temel özellikleri, unvanınız ve iletişim bilgileriniz, tüm vergiler dahil toplam fiyat, kargo ücreti, cayma hakkının koşulları",
          "Mesafeli satış sözleşmesi: taraflar, ürün, fiyat, teslimat ve cayma şartları",
          "İade ve cayma koşulları: tüketici kural olarak ürünü teslim aldığı günden başlayarak 14 gün içinde gerekçe göstermeden cayabilir",
          "KVKK aydınlatma metni: hangi kişisel verileri hangi amaçla işlediğiniz, kimlere aktardığınız, verileri nasıl topladığınız ve müşterinin hakları",
          "Çerez bildirimi: analiz ve reklam gibi zorunlu olmayan çerezler için ziyaretçinin onayı",
        ],
      },
      {
        baslik: "İade, kampanya iletileri ve taslak metinler",
        paragraflar: [
          "Kişiye özel üretilen ya da çabuk bozulan ürünler gibi cayma hakkının uygulanmadığı istisnalar vardır. Cayma hâlinde, iade edilen ürün ön bilgilendirmede belirttiğiniz kargo firmasına teslim edildiği günden başlayarak 14 gün içinde ödemeyi geri vermeniz gerekir.",
          "Kampanya e-postası ya da SMS göndermek isterseniz alıcının önceden onayını almanız ve İleti Yönetim Sistemi'ne (İYS) kayıt olmanız gerekir. Onay şartı kampanya ve tanıtım iletileri içindir; bir iletinin bu kapsama girip girmediğinden emin değilseniz danışmanınıza sorun.",
          "[E-ticaret paketimizde](/hizmetler/e-ticaret) mesafeli satış ve KVKK sayfaları için taslak bulunur. Metinleri kendi ürününüze, kargo ve iade düzeninize göre doldurup bir hukukçuya ya da danışmana kontrol ettirmenizi öneririz.",
        ],
      },
      {
        baslik: "Ürün içeriği, kargo ve yönetim paneli",
        paragraflar: [
          "Müşteri ürünü elle tutamadığı için karar fotoğraf ve açıklamayla verilir. Her ürün için aynı ışıkta, sade zeminde çekilmiş birkaç fotoğraf ve ölçü, malzeme, kullanım bilgisi yazılmış bir açıklama hazırlayın. Renk ve beden gibi seçenekleri ayrı ürün yerine varyant olarak girmek stok takibini kolaylaştırır.",
          "Kargo için bir ya da birkaç kargo firmasıyla anlaşırsınız; ücret genellikle paketin ağırlığına ve hacmine (desi) göre belirlenir. Hangi bölgelere gönderim yaptığınızı ve kabul ettiğiniz ödeme yöntemlerini müşteri siparişi vermeden önce açıkça yazmalısınız. Yönetmeliğe göre teslim süresi, kişiye özel ürünler dışında 30 günü geçemez.",
          "Site yayına girdikten sonra işin çoğu panelde geçer. Bizim sitelerimizde ürün, varyant ve stok, kupon ve kampanya, sipariş durumu ve kargo takip numarası aynı paneldedir; yeni sipariş size e-posta ya da WhatsApp ile bildirilir. İlk ürünlerinizi bir tablo hâlinde gönderirseniz yayına alırken biz yükleriz.",
          "Pazaryerlerinde de satıyorsanız ürün ve stok eşitlemesi [özel yazılım ve otomasyon](/hizmetler/ozel-yazilim) olarak ayrıca kurulabilir. E-ticaret paketimiz ₺65.000 +KDV, yıllık yenileme ₺2.399 +KDV; ayrıntılar [fiyatlar sayfasında](/fiyatlar).",
        ],
      },
    ],
    sss: [
      {
        soru: "Pazaryerinde satıyorum, kendi sitem için de ETBİS kaydı gerekir mi?",
        cevap:
          "Ticaret Bakanlığı'nın açıklamasına göre yalnız yurt içindeki pazaryerlerinde satış yapanların kayıt yükümlülüğü yoktur. Kendi sitenizden satışa başlayacaksanız, faaliyete geçmeden önce ETBİS'e kayıt olmanız gerekir.",
      },
      {
        soru: "Şirketim yokken kartla ödeme alabilir miyim?",
        cevap:
          "Sanal POS hizmetleri genellikle vergi kaydı olan bir işletme ister. Bazı ödeme kuruluşlarının şirketi olmayanlar için bağlantıyla ödeme gibi sınırlı seçenekleri var; koşullar değişebildiği için başvurmadan önce kuruluşun güncel şartlarına bakın.",
      },
      {
        soru: "Yasal metinleri hazır bir şablondan alabilir miyim?",
        cevap:
          "Şablon iyi bir başlangıçtır, ama metinler ürününüze, kargo ve iade düzeninize ve işlediğiniz verilere göre uyarlanmalı. Paketimizdeki taslakları kendi bilgilerinizle doldurup bir hukukçuya ya da danışmana kontrol ettirmenizi öneririz.",
      },
    ],
  },
  {
    adres: "qr-menu-nedir-nasil-calisir",
    baslik: "QR menü nedir, nasıl çalışır?",
    seoBasligi: "QR Menü Nedir, Nasıl Çalışır?",
    aciklama:
      "QR menü nedir, nasıl çalışır? Müşteri masadaki kodu okutur, menü telefonda açılır. Fiyat güncelleme, çok dil, masaya yerleşim ve fiyat listesi kuralları.",
    ozet: "Masadaki kodu okutan müşterinin telefonunda menü açılır; fiyatı panelden değiştirirsiniz, kod aynı kalır. Kurulumdan masaya yerleştirmeye ve fiyat listesi kurallarına kadar.",
    tarih: "2026-10-26",
    okumaDakika: 4,
    ilgiliHizmet: "qr-menu",
    bolumler: [
      {
        baslik: "QR menü nedir?",
        paragraflar: [
          "QR menü, restoran, kafe ya da pastanenizin menüsünü taşıyan bir web sayfası ve o sayfanın adresini taşıyan karekoddur. Müşteri masadaki kodu telefonunun kamerasıyla okutur, menü tarayıcıda açılır.",
          "Kategoriler, ürün fotoğrafları, açıklamalar ve fiyatlar telefona uygun bir düzende görünür; müşteri kategoriler arasında gezinerek istediği ürüne ulaşır. Basılı menünün yanında, masadaki fiyat listesini göstermenin ikinci bir yolu olarak kullanılır.",
          "Restoranlar, kafeler, pastaneler, otel ve plaj işletmeleri için uygundur. Fiyatların sık değiştiği dönemlerde basılı menüyü her seferinde yeniden bastırmak hem masraf hem zaman ister; QR menüde değişikliği panelden birkaç dokunuşla yaparsınız.",
        ],
      },
      {
        baslik: "Müşteri tarafında nasıl çalışır?",
        paragraflar: [
          "Güncel telefonların çoğunda kamera uygulaması QR kodu kendisi okur; müşterinin ayrı bir uygulama indirmesi gerekmez. Kamerayı koda tuttuğunda ekranda bir bağlantı belirir, dokununca menü açılır.",
          "Menü internetten açıldığı için telefonun bağlantısı olmalıdır. İşletmenizde çekim zayıfsa misafir Wi-Fi bilgisini kodun yanına yazmak işe yarar. Yazılar telefonda rahat okunacak büyüklükte, fotoğraflar hızlı yüklenecek boyutta olmalı; menü geç açılırsa misafir beklemek yerine garsonu çağırabilir.",
          "Ürün fotoğrafı, menüyü ilk kez gören misafirin seçimini kolaylaştırır. İçindekileri ve alerjen bilgisini açıklamaya yazmak da garsona sorulan soruları azaltabilir.",
          "Menüye telefonla arama ve WhatsApp'tan sipariş düğmeleri de eklenebilir. Örneğin [Emre Pide için yaptığımız QR menüde](/isler) müşteri menüden seçer, telefonla ya da WhatsApp'tan sipariş verir.",
        ],
      },
      {
        baslik: "Fiyatı değiştirince ne olur?",
        paragraflar: [
          "QR kod menünün kendisini değil, adresini taşır. Fiyatı ya da ürünü yönetim panelinden değiştirdiğinizde aynı kodla açılan menü güncel hâliyle görünür; kodu yeniden bastırmanız gerekmez.",
          "Bu yüzden kodun değişmeyecek bir adrese bağlanması önemlidir. Menüyü bir PDF dosyası olarak yükleyip koda o dosyanın bağlantısını vermek kolay görünür, ama dosya yenilendiğinde adres de değişebilir ve masadaki kodlar eski menüyü ya da boş bir sayfayı açabilir.",
          "Masadaki kodların açtığı adres yıllarca aynı kalacağı için onu dikkatle seçin. Menü kendi alan adınızın altında durursa, hizmet sağlayıcınızı değiştirseniz bile masadaki kodlar çalışmaya devam edebilir. Örneğin Emre Pide'nin menüsü kendi alan adının altında, menu.emrepide.com.tr adresinde açılır.",
          "İyi bir QR menü panelinde şunları kendiniz yaparsınız:",
        ],
        maddeler: [
          "Fiyatı anında değiştirmek",
          "Ürün eklemek, gizlemek ve sıralamak",
          "Porsiyona göre fiyat vermek (1 porsiyon, 1,5 porsiyon gibi)",
          "Günün önerisini ve tükenen ürünü işaretlemek",
          "Bunların hepsini telefondan da yapmak",
        ],
      },
      {
        baslik: "Çok dilli menü",
        paragraflar: [
          "Turist ya da yabancı misafir ağırlıyorsanız menü birden çok dilde hazırlanabilir. Misafir dilini seçer, aynı ürünleri ve fiyatları kendi dilinde görür.",
          "Çeviride ürün adını birebir çevirmek yerine kısa bir açıklama eklemek daha anlaşılır olur: yöresel bir yemeğin adı çoğu zaman olduğu gibi kalır, altına içindekiler yazılır. Fiyat tek yerden yönetildiğinde her dilde aynı anda güncellenir.",
          "Dil seçimi menünün başında, kolay görülen bir yerde olmalı. Menünün misafirin telefonundaki dile göre kendiliğinden açılması da mümkündür; misafir isterse dili yine kendisi değiştirir.",
        ],
      },
      {
        baslik: "Kodu masaya yerleştirmek",
        paragraflar: [
          "Kod, oturan birinin telefonu kaldırıp rahatça okutabileceği yerde ve yeterli büyüklükte olmalı. Masa standı, yapışkan etiket ya da masa kartı kullanılabilir; parlak yüzeyler ışığı yansıtıp okutmayı zorlaştırabilir.",
          "Aynı kodu vitrine, paket servis poşetine ya da sosyal medya hesabınıza da koyabilirsiniz; menüye evden bakan müşteri de aynı güncel fiyatları görür. Masadan sipariş gibi işlevler ise menüyü bir sipariş sistemine dönüştürür ve ayrıca planlanır.",
        ],
        maddeler: [
          "Kodun yanına kısa bir yönlendirme yazın: “Menü için kameranızla okutun.”",
          "Kodu peçetelik ya da tuzluk gibi masadaki eşyaların arkasında kalmayacağı bir yere koyun.",
          "Masadan sipariş alacaksanız genellikle her masaya kendi numarasını taşıyan ayrı bir kod verilir.",
          "Kodları bastırmadan önce birkaç farklı telefonla deneyin.",
          "Logonuzu ve renklerinizi kullanın; misafir kodun size ait olduğunu anlasın.",
        ],
      },
      {
        baslik: "Basılı fiyat listesi kuralları",
        paragraflar: [
          "QR menü, fiyat listesi yükümlülüğünü tek başına ortadan kaldırmaz. Fiyat Etiketi Yönetmeliği'ne göre lokanta, restoran, kafe ve pastanelerde fiyat listesi işyerinin giriş kapısının önüne ve masaların üstüne, kolayca görülüp okunacak şekilde konulmalıdır.",
          "Ekim 2025'teki değişiklikle masalardaki fiyat listelerinin karekodla da gösterilebileceği yönetmeliğe eklendi; ancak müşteri isterse fiyat listesini ayrıca vermeniz zorunlu. Bu yüzden basılı listeyi elinizin altında tutun ve fiyat değiştirdiğinizde onu da güncelleyin.",
          "Sunduğunuz bütün ürünler listede yer almalı ve fiyatlar vergiler dahil yazılmalı. Ocak 2026 değişikliğiyle servis, masa ya da kuver ücreti adı altında ek ödeme de istenemiyor. Kurallar son yıllarda birkaç kez değiştiği için güncel hâlini il ticaret müdürlüğünüzden ya da danışmanınızdan teyit edin.",
          "Bizim [QR menü hizmetimizde](/hizmetler/qr-menu) masalar için baskıya hazır kodlar, işletmenizin logosu ve renkleriyle gelir. Fiyat ₺9.999 +KDV'den başlar; çok şubeli, çok dilli ya da masadan sipariş alan menülerde kapsama göre artar. Menünüzü [iletişim sayfamızdan](/iletisim) gönderirseniz kapsamı birlikte belirleriz.",
        ],
      },
    ],
    sss: [
      {
        soru: "Müşterinin uygulama indirmesi gerekir mi?",
        cevap:
          "Hayır. Telefonun kamerasıyla okutmak yeterli; menü tarayıcıda açılır. Kodu okutamayan ya da basılı liste isteyen misafir için listeyi yine elinizin altında tutun.",
      },
      {
        soru: "QR menü varken basılı fiyat listesi tamamen kalkar mı?",
        cevap:
          "Hayır. Giriş kapısındaki fiyat listesi yükümlülüğü sürüyor ve müşteri isterse fiyat listesini ayrıca vermeniz gerekiyor. QR menü, masada güncel fiyatı fotoğraf ve açıklamalarla göstermenin pratik bir yoludur; basılı listenin yerini tutmaz, onu tamamlar.",
      },
      {
        soru: "Fiyatı değiştirince kodu yeniden bastırmam gerekir mi?",
        cevap:
          "Hayır. Kod menünün adresini taşır; panelden değiştirdiğiniz fiyat aynı kodla açılan menüde hemen görünür. Basılı listenizi de aynı gün güncellemeyi unutmayın.",
      },
    ],
  },
  {
    adres: "web-sitesi-fiyatlari-neye-gore-degisir",
    baslik: "Web sitesi fiyatları neye göre değişir?",
    seoBasligi: "Web Sitesi Fiyatları Neye Göre Değişir?",
    aciklama:
      "Web sitesi fiyatları neye göre değişir? Sayfa sayısı, panel, e-ticaret, tasarım, içerik, çok dil ve yıllık giderler. Teklifleri doğru karşılaştırın.",
    ozet: "Aynı “web sitesi” sözü birbirinden çok farklı işleri anlatır. Fiyatı belirleyen kalemler, yıllık giderler ve teklif karşılaştırırken sorulacak sorular.",
    tarih: "2026-10-26",
    okumaDakika: 4,
    ilgiliHizmet: "kurumsal-site",
    bolumler: [
      {
        baslik: "Aynı ad, farklı işler",
        paragraflar: [
          "“Web sitesi” sözü tek sayfalık bir tanıtım sitesini de, yüzlerce ürünlü bir mağazayı da anlatır. Bu yüzden iki teklif arasındaki fark çoğu zaman fiyattan değil, kapsamdan gelir.",
          "“Bir site ne kadar?” sorusunun tek bir cevabı yoktur; “şu sayfalar, şu dil, şu panel ne kadar?” sorusunun vardır. Fiyat sorarken işletmenizi, hedefinizi ve sitede olmasını istediklerinizi anlatırsanız birbiriyle karşılaştırılabilir teklifler alırsınız.",
          "Fiyatı belirleyen kalemleri bilirseniz teklifleri aynı ölçüyle karşılaştırabilirsiniz. Aşağıda bu kalemleri sırayla, kendi açık fiyatlarımızı örnek vererek anlatıyoruz. Bütün fiyatlarımız KDV hariçtir.",
        ],
      },
      {
        baslik: "Sayfa sayısı ve yönetim paneli",
        paragraflar: [
          "Her sayfa ayrı bir tasarım, metin ve görsel düzeni demektir; sayfa arttıkça iş de artar. Tek sayfalık bir site işletmenizi tek, uzun bir sayfada anlatır. Çok sayfalı sitede her hizmetin, ürün grubunun ya da konunun kendi sayfası olur.",
          "Kaç sayfa gerektiğini düşünürken Google'ı da hesaba katın. Google'da ayrı ayrı bulunmak istediğiniz her hizmet, kendi başlığı ve açıklaması olan ayrı bir sayfa ister.",
          "İkinci büyük kalem yönetim panelidir. Panel, metni, görseli ve haberleri teknik bilgi olmadan kendiniz değiştirmenizi sağlar; panelsiz sitede bu değişiklikleri siteyi yapan kişi yapar.",
          "Örnek olarak bizim [tek sayfa kurumsal sitemiz](/hizmetler/kurumsal-site) ₺9.999 +KDV'dir; arama ve WhatsApp düğmesi, Google Haritalar konumu, temel SEO ve SSL dahildir, içeriğini biz güncelleriz. Yönetim panelli, çok sayfalı, blog, form ve çok dil içeren tam paket ₺45.000 +KDV.",
        ],
      },
      {
        baslik: "E-ticaret ve özel işlevler",
        paragraflar: [
          "Satış yapan bir sitede sepet, kartla ödeme, stok, varyant, kupon, sipariş ve kargo takibi gibi parçalar devreye girer. Her biri hem yazılım hem deneme süresi ister; bu yüzden e-ticaret sitesi, benzer büyüklükteki bir tanıtım sitesinden genellikle daha pahalıdır. Bizde e-ticaret sitesi ₺65.000 +KDV.",
          "Ürün sayısı da işi değiştirir: on ürünlü bir mağazayla yüzlerce varyantlı bir katalog aynı sürede kurulmaz. Ödeme kuruluşunun her satıştan aldığı komisyon ise sitenin değil satışın gideridir; bütçenizi yaparken onu ayrıca düşünün.",
          "Muhasebe programına, ERP'ye ya da pazaryerine bağlantı, randevu ya da üretim takibi gibi işlevler işletmeden işletmeye değişir ve genellikle ayrı fiyatlanır. [Özel yazılım ve otomasyon](/hizmetler/ozel-yazilim) işlerinde ihtiyacı dinledikten sonra yazılı teklif veririz; mobil uygulama da böyle fiyatlanır.",
        ],
      },
      {
        baslik: "Tasarım, içerik ve SEO",
        paragraflar: [
          "Hazır temayla kurulan bir site daha hızlı başlar, ama tema izin verdiği kadar değişir; firmanızı rakiplerinizden ayıran bir görünüm zorlaşır. Size göre çizilen tasarımda önce taslak hazırlanır, beğenene kadar düzeltilir; bu emek fiyata yansır.",
          "Sayfaların hızlı açılması, başlık ve açıklamaların düzgün yazılması, site haritası ve Search Console kurulumu da emek ister ve bazı tekliflerde ayrı kalemdir. Bizim tam paketimizde bunlar fiyata dahildir; onaylanan tasarımı kodlarken siteyi telefonda, tablette ve bilgisayarda tek tek deneriz.",
          "İçerik de fiyatı etkiler. Şu işleri kimin yapacağı teklifte açıkça yazmalı:",
        ],
        maddeler: [
          "Metin yazımı ya da mevcut metinlerin düzenlenmesi",
          "Ürün ya da mekân fotoğrafı çekimi",
          "Çok sayıda ürünün siteye girilmesi",
          "İkinci, üçüncü dil için çeviri",
          "Logo ya da kurumsal kimlik çalışması",
        ],
      },
      {
        baslik: "Çok dil ve yıllık giderler",
        paragraflar: [
          "Çok dilli bir sitede her sayfa her dilde ayrıca hazırlanır ve Google'a hangi sayfanın hangi dilde olduğu ayrıca bildirilir. Dil sayısı arttıkça hem çeviri hem kontrol işi büyür.",
          "Site yayına girdikten sonra da her yıl ödenen kalemler vardır. Alan adının yıllık ücreti uzantıya ve kayıt firmasına göre değişir; alan adının işletmeniz adına kayıtlı olmasına ve yenileme tarihine dikkat edin, çünkü süresi dolup yenilenmeyen bir alan adı bir süre sonra başkasının alımına açılabilir.",
          "Sunucu, SSL sertifikası, güvenlik güncellemeleri ve yedekleme de site yayında kaldıkça süren işlerdir. Bunları kimin yaptığı ve ücretin neleri kapsadığı teklifte açıkça yazmalı.",
          "Bizde site yayına girdikten sonra her yıl ödenen yenileme ücreti ₺2.399 +KDV'dir ve şunları kapsar:",
        ],
        maddeler: [
          "Sunucu (barındırma) ve trafik",
          "SSL sertifikasının yenilenmesi",
          "Güvenlik ve yazılım güncellemeleri",
          "Yedekleme",
          "Erişim kesintisi izleme",
          "Küçük metin ve görsel değişiklikleri için destek",
        ],
      },
      {
        baslik: "Teklifleri karşılaştırırken sorun",
        paragraflar: [
          "Yalnız ilk ödemeye bakmak yanıltabilir; birkaç yıllık toplamı hesaplamak daha doğru bir karşılaştırma verir.",
          "Bizim paket fiyatlarımız [fiyatlar sayfasında](/fiyatlar) açıkça yazılı. Paketin dışında kalan bir istek olursa görüşmeden sonra yazılı teklif alırsınız; teklifte olmayan bir kalem sonradan faturaya eklenmez.",
          "Hangi firmayla çalışırsanız çalışın, şu soruların cevabı teklifte yazılı olsun:",
        ],
        maddeler: [
          "Fiyat KDV dahil mi, hariç mi?",
          "Kaç sayfa, hangi bölümler ve kaç dil var?",
          "Yönetim paneli var mı, neleri değiştirebiliyorum?",
          "Metin, fotoğraf ve ürün girişi kimde?",
          "Yıllık yenileme ne kadar ve neleri kapsıyor?",
          "Alan adı kimin adına kayıtlı olacak?",
          "Çalışmayı bırakırsam alan adı, içerik ve görseller bende kalacak mı?",
          "Yayından sonraki değişiklikler nasıl ücretlendiriliyor?",
          "Teslim takvimi ne?",
        ],
      },
    ],
    sss: [
      {
        soru: "Neden bazı siteler çok ucuz, bazıları pahalı?",
        cevap:
          "Fark genellikle kapsamdadır: hazır tema ya da size özel tasarım, yönetim paneli olup olmaması, sayfa ve dil sayısı, içeriği kimin hazırladığı. Teklifleri bu kalemleri yan yana koyarak karşılaştırın.",
      },
      {
        soru: "Küçük başlayıp siteyi sonra büyütebilir miyim?",
        cevap:
          "Evet. Tek sayfa siteyle başlayıp sonra tam pakete geçebilirsiniz; tek sayfa site yeni tasarımın temeli olur ve aradaki fark üzerinden ilerleriz.",
      },
      {
        soru: "Sitenizdeki fiyatlara KDV dahil mi?",
        cevap:
          "Hayır, bütün fiyatlarımız KDV hariçtir ve her fiyatın yanında +KDV yazar. Yıllık yenileme ücreti de aynı şekilde ₺2.399 +KDV'dir.",
      },
    ],
  },
  {
    adres: "tek-sayfa-mi-kurumsal-site-mi",
    baslik: "Tek sayfa site mi, çok sayfalı kurumsal site mi?",
    seoBasligi: "Tek Sayfa Site mi, Kurumsal Site mi?",
    aciklama:
      "Tek sayfa site mi, çok sayfalı kurumsal site mi? Hangi işletmeye hangisi uyar, Google açısından fark ne, sonradan büyütmek mümkün mü? Karar ölçütleri.",
    ozet: "İkisi de işletmenizi anlatır, ama farklı ihtiyaçlara cevap verir. Hangi durumda hangisini seçeceğinizi, Google açısından farkı ve sonradan büyütmeyi anlatıyoruz.",
    tarih: "2026-10-26",
    okumaDakika: 4,
    ilgiliHizmet: "kurumsal-site",
    bolumler: [
      {
        baslik: "İki yapı arasındaki fark",
        paragraflar: [
          "Tek sayfa sitede bütün içerik tek, uzun bir sayfadadır: hakkımızda, hizmetler, galeri ve iletişim alt alta sıralanır, menüdeki bağlantılar sayfanın ilgili bölümüne kaydırır. Ziyaretçi birkaç kaydırmada işletmenizi tanır ve size ulaşır.",
          "Çok sayfalı kurumsal sitede her konu kendi adresinde durur: her hizmetin, ürün grubunun, referansın ve haberin ayrı sayfası olur. Bu yapı genellikle bir yönetim paneliyle birlikte gelir; sayfa, metin ve görselleri kendiniz değiştirirsiniz.",
          "Tek sayfada ziyaretçi kaybolmaz; her şey aynı yerde olduğu için telefonda kaydırarak okunur. Çok sayfalı sitede ise ziyaretçi yalnız ilgilendiği sayfaya gider; hizmet ve ürün çoğaldıkça bu düzen aradığını bulmayı kolaylaştırır.",
        ],
      },
      {
        baslik: "Tek sayfa kimlere uygun?",
        paragraflar: [
          "Tek sayfa site, anlatacağı şey kısa ve net olan işletmeler için yeterlidir. Ziyaretçinin asıl amacı sizi aramak, yol tarifi almak ya da birkaç fotoğrafa bakmaksa uzun bir siteye gerek olmayabilir.",
          "Tek sayfa site daha kısa sürede hazırlanır ve sonrasında yönetecek az şey bırakır. İçeriğiniz birkaç paragraf, bir hizmet listesi ve fotoğraflardan oluşuyorsa bunları ayrı sayfalara bölmek ziyaretçiye bir şey kazandırmaz. Şu durumlarda genellikle yeterlidir:",
        ],
        maddeler: [
          "Yeni açılan ve kendini kısaca tanıtmak isteyen işletmeler",
          "Bir ya da birkaç hizmet sunan esnaf ve ustalar",
          "Kafe, pastane, kuaför gibi mahalle işletmeleri",
          "Randevuyla ya da telefonla çalışan, ziyaretçiden asıl olarak arama bekleyen işletmeler",
          "Bir ürün, etkinlik ya da kampanya için ayrı tanıtım sayfası",
        ],
      },
      {
        baslik: "Çok sayfalı kurumsal site kimlere uygun?",
        paragraflar: [
          "Anlatacak çok şeyi olan ya da Google'da birçok farklı aramada görünmek isteyen işletmeler için çok sayfalı yapı gerekir.",
          "Bir artısı da paylaşımdır: belirli bir hizmetin ya da ürünün bağlantısını müşterinize doğrudan gönderebilirsiniz ve her sayfanın kendi paylaşım görseli ve açıklaması olabilir. Şu işletmeler için uygundur:",
        ],
        maddeler: [
          "Birden çok hizmeti ya da ürün grubu olan firmalar",
          "Katalog, teknik tablo ya da referans listesi yayınlayanlar",
          "Yurt dışına satış yapan, birden çok dilde görünmesi gerekenler",
          "Düzenli haber ya da blog yazısı yayınlayacak olanlar",
          "Teklif ve iletişim formlarından talep toplayanlar",
          "Kurumsal müşterilere, bayilere ya da ihalelere kendini tanıtan firmalar",
        ],
      },
      {
        baslik: "Google açısından fark",
        paragraflar: [
          "Google her sayfayı ayrı değerlendirir ve her sayfanın kendi başlığı ve açıklaması olur. Tek sayfa sitenin tek bir başlığı vardır; bu yüzden en çok işletmenizin adıyla ve ana işinizle yapılan aramalarda iş görür.",
          "Çok sayfalı sitede her hizmete ayrı bir sayfa açarak her birini kendi aramasına hazırlayabilirsiniz: “kurumsal web sitesi” arayan ile “e-ticaret sitesi” arayan farklı sayfalara gelir. Blog yazıları da müşterilerinizin sorduğu sorulara cevap vererek yeni aramalarda görünmeniz için fırsat yaratır.",
          "Yerel aramalarda Google İşletme Profili de önemlidir. Tek sayfa bir site, bu profilden bağlantı verilen derli toplu bir adres olarak da iyi iş görür.",
          "Hangi yapıyı seçerseniz seçin, sayfaların telefonda hızlı açılması, başlık ve açıklamanın işinizi doğru anlatması ve adınızın, adresinizin, telefonunuzun her yerde aynı yazılması önemlidir.",
        ],
      },
      {
        baslik: "Karar verirken sorun",
        paragraflar: [
          "Bütçe ve zaman da hesaba girer. Tek sayfa site, bütçesi sınırlı ya da hemen yayına girmesi gereken bir işletme için iyi bir başlangıçtır; çok sayfalı site daha çok emek ve daha çok içerik ister.",
          "Bunun dışında şu soruların cevabı seçimi büyük ölçüde belirler:",
        ],
        maddeler: [
          "Kaç ayrı hizmetiniz ya da ürün grubunuz var?",
          "Google'da hangi sözcüklerle bulunmak istiyorsunuz?",
          "Site kaç dilde olmalı?",
          "İçeriği kim, ne sıklıkla güncelleyecek?",
          "Ziyaretçiden ne bekliyorsunuz: arama, form, teklif talebi?",
          "Önümüzdeki bir iki yılda siteye neler eklemek istiyorsunuz?",
        ],
      },
      {
        baslik: "Seçim ve sonradan büyütmek",
        paragraflar: [
          "Hizmetiniz az, siteniz tek dilliyse ve içerik nadiren değişiyorsa tek sayfa yeterlidir. Hizmetleriniz çoğalıyorsa, birden çok dil ya da düzenli içerik gerekiyorsa çok sayfalı yapıyı seçin.",
          "Bizim tek sayfa sitemizde hakkımızda, hizmetler, galeri ve iletişim bölümleri, tek dokunuşla arama ve WhatsApp düğmesi, Google Haritalar konumu ve temel SEO bulunur; fiyatı ₺9.999 +KDV. Tam paket kurumsal site ₺45.000 +KDV. Örneğin [Ayyıldız Robotics için yaptığımız site](/isler), ölçü şemalı 336 parça ailesini Türkçe, İngilizce ve Almanca sunuyor; bu içerik tek bir sayfaya sığmazdı.",
          "Bugün tek sayfayla başlamak yarın büyümenize engel değildir. Tek sayfa site, tam pakete geçerken yeni tasarımın temeli olur ve aradaki fark üzerinden ilerleriz. Alan adınız aynı kalır; adresi değişen sayfalar için eski adreslerden yenilerine yönlendirme kurarız, böylece Google'da bulunan sayfalarınız bulunmaya devam eder.",
          "Blog ya da haber bölümü de sonradan eklenebilir; ama baştan planlanırsa menü, tasarım ve adres yapısı ona göre kurulur. İki paketin ayrıntılarını [kurumsal site sayfamızda](/hizmetler/kurumsal-site) karşılaştırabilir, kararsız kaldığınızda [bize yazabilirsiniz](/iletisim).",
        ],
      },
    ],
    sss: [
      {
        soru: "Tek sayfa site Google'da çıkar mı?",
        cevap:
          "Çıkar; özellikle işletmenizin adıyla ve ana işinizle yapılan aramalarda iş görür. Birçok farklı hizmet için ayrı ayrı bulunmak istiyorsanız her hizmetin kendi sayfası olan çok sayfalı yapı daha uygundur.",
      },
      {
        soru: "Tek sayfa sitede içeriği kim değiştirir?",
        cevap:
          "Tek sayfa pakette içeriği biz güncelleriz; değişiklik istediğinizde yazmanız yeter. İçeriği kendiniz sık sık değiştirmek istiyorsanız yönetim panelli tam paket daha uygundur.",
      },
      {
        soru: "Çok sayfalı site daha mı uzun sürede hazır olur?",
        cevap:
          "Genellikle evet, çünkü her sayfa ayrı tasarlanır ve ayrı içerik ister. Kesin süre kapsama göre değişir; görüşmeden sonra yazılı bir takvim veririz.",
      },
    ],
  },
];

export function rehberBul(adres: string) {
  return REHBER.find((y) => y.adres === adres);
}
