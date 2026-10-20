// Referans sitelerin gerçek ekran görüntülerini `public/isler/` altına çeker.
//   node scripts/referans-gorselleri.mjs
// Her site için: masaüstü tam sayfa (1440 genişlik) ve telefon ilk ekranları (390 genişlik, 2x).
// Çerez bandı ve sohbet balonu gibi sabit katmanlar yalnız görüntüde gizlenir; sitede hiçbir şey kabul edilmez.

import { ekranGoruntusu } from "./ekran.mjs";

const SITELER = [
  { ad: "dijitalbaskimerkezim", adres: "https://dijitalbaskimerkezim.com/" },
  { ad: "ayyildizrobotics", adres: "https://ayyildizrobotics.com/" },
  { ad: "emrepide", adres: "https://emrepide.com.tr/" },
  { ad: "emrepide-menu", adres: "https://menu.emrepide.com.tr/" },
];

const SABITLERI_GIZLE = `(() => {
  // content-visibility: auto ekran dışındaki bölümleri çizmez; tam sayfa çekimde boş kalır
  const stil = document.createElement("style");
  stil.textContent = "* { content-visibility: visible !important; }";
  document.head.append(stil);
  for (const el of document.querySelectorAll("body *")) {
    const stil = getComputedStyle(el);
    if (stil.position !== "fixed") continue;
    const metin = (el.textContent || "").toLocaleLowerCase("tr");
    const cerez = metin.includes("çerez") || metin.includes("cookie");
    const kucukBalon = el.getBoundingClientRect().width < 120 && el.getBoundingClientRect().top > innerHeight / 2;
    const balon = metin.trim() === "whatsapp" || (el.getBoundingClientRect().width < 200 && el.getBoundingClientRect().top > innerHeight / 2);
    if (cerez || balon) el.style.setProperty("display", "none", "important");
  }
  // Next görsel iyileştiricisinin döndüremediği görseller (ör. Türkçe karakterli dosya adı): sitenin ham dosyasını göster
  for (const img of document.images) {
    const kaynak = img.currentSrc || img.src;
    if (img.complete && img.naturalWidth === 0 && kaynak.includes("/_next/image?url=")) {
      const ham = new URL(kaynak).searchParams.get("url");
      img.removeAttribute("srcset");
      img.src = new URL(ham, location.origin).href;
    }
  }
  // Kaydırınca beliren bölümler tam sayfa çekimde görünmez kalıyor: görünür yap
  for (const el of document.querySelectorAll("main *, section *, footer *")) {
    const stil = getComputedStyle(el);
    if (Number(stil.opacity) < 0.05 && el.getBoundingClientRect().height > 0) {
      el.style.setProperty("opacity", "1", "important");
      el.style.setProperty("transform", "none", "important");
      el.style.setProperty("filter", "none", "important");
    }
  }
})()`;

const secilen = process.argv[2];
for (const site of SITELER.filter((s) => !secilen || s.ad === secilen)) {
  const masaustu = await ekranGoruntusu({
    adres: site.adres,
    cikti: `public/isler/${site.ad}-masaustu.webp`,
    genislik: 1440,
    yukseklik: 900,
    tam: true,
    enCokYukseklik: 5200,
    bekle: 6000,
    betik: SABITLERI_GIZLE,
  });
  console.log(masaustu);

  const telefon = await ekranGoruntusu({
    adres: site.adres,
    cikti: `public/isler/${site.ad}-telefon.webp`,
    genislik: 390,
    yukseklik: 844,
    telefon: true,
    tam: true,
    enCokYukseklik: 2600,
    bekle: 6000,
    betik: SABITLERI_GIZLE,
  });
  console.log(telefon);
}
