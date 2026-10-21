// Tek sayfanın denetimi: konsol ve ağ hataları, yatay taşma, takılı kalan giriş animasyonları, görseller,
// SEO etiketleri ve erişilebilirlik (axe-core). Her bulgu { onem, tur, mesaj } nesnesidir.

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { bekle } from "./cdp.mjs";

const AXE = readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");

/** Headless Chrome'un yazılım çizicisinden gelen, siteyle ilgisi olmayan konsol satırları. */
const GURULTU = [/GL Driver Message/i, /GPU stall/i, /WebGL/i, /swiftshader/i, /Automatic fallback to software/i];

/** Kaydırınca belirmesi gereken öğeler (ön durumları globals.css › .hareket). */
const BELIREN = "[data-belir], [data-giris], [data-giris-baslik], [data-giris-metin], [data-dolum]";

/**
 * @param {object} sekme cdp.mjs › sekmeAc
 * @param {string} adres tam adres
 * @param {{ genislik: number, yukseklik: number, kaydir: boolean, seo: boolean, axe: boolean, koken: string }} secenek
 */
export async function sayfayiDenetle(sekme, adres, secenek) {
  const bulgular = [];
  const ekle = (onem, tur, mesaj) => bulgular.push({ onem, tur, mesaj });
  const koken = secenek.koken;

  await sekme.gonder("Page.enable");
  await sekme.gonder("Runtime.enable");
  await sekme.gonder("Log.enable");
  await sekme.gonder("Network.enable");
  const istekler = new Map(); // istek kimliği → adres (yüklenemeyen dosyayı adıyla yazmak için)
  const birak = [
    sekme.dinle("Network.requestWillBeSent", (p) => istekler.set(p.requestId, p.request.url)),
    sekme.dinle("Runtime.exceptionThrown", (p) =>
      ekle(
        "hata",
        "JS",
        `Yakalanmamış hata: ${(p.exceptionDetails.exception?.description ?? p.exceptionDetails.text).split("\n")[0]}`,
      ),
    ),
    sekme.dinle("Runtime.consoleAPICalled", (p) => {
      const metin = p.args.map((a) => a.value ?? a.description ?? "").join(" ");
      if (GURULTU.some((g) => g.test(metin))) return;
      if (p.type === "error") ekle("hata", "Konsol", metin.slice(0, 220));
      else if (p.type === "warning") ekle("uyari", "Konsol", metin.slice(0, 220));
    }),
    sekme.dinle("Log.entryAdded", ({ entry }) => {
      if (entry.level !== "error" || GURULTU.some((g) => g.test(entry.text))) return;
      // Ağ hataları ayrıca yazılır; burada yalnız tarayıcının kendi hataları
      if (entry.source === "network") return;
      ekle("hata", "Konsol", entry.text.slice(0, 220));
    }),
    sekme.dinle("Network.responseReceived", ({ response }) => {
      if (response.status >= 400 && response.url.startsWith(koken)) {
        ekle("hata", "Ağ", `${response.status}: ${response.url.replace(koken, "")}`);
      }
    }),
    sekme.dinle("Network.loadingFailed", (p) => {
      const url = istekler.get(p.requestId) ?? p.requestId;
      if (!p.canceled && p.type !== "Ping")
        ekle("hata", "Ağ", `Yüklenemedi (${p.errorText}): ${url.replace(koken, "")}`);
    }),
  ];

  try {
    await sekme.boyut(secenek.genislik, secenek.yukseklik);
    await sekme.git(adres);
    await sekme.hazirBekle();

    if (secenek.kaydir) {
      // Sayfayı ekran ekran gez: ekrana giren her öğe kısa sürede görünür olmalı
      const toplam = await sekme.degerlendir("document.documentElement.scrollHeight");
      const adim = Math.round(secenek.yukseklik * 0.7);
      const takilanlar = new Set();
      for (let y = 0; y < toplam; y += adim) {
        await sekme.degerlendir(`(window.__lenis?.scrollTo?.(${y}, { immediate: true }), scrollTo(0, ${y}))`);
        await bekle(1100);
        // Ekranda olup görünmeyenleri işaretle; makine yavaşsa animasyon geç bitebilir, 2,5 sn sonra bir daha bak
        const gorunmeyen = `[...document.querySelectorAll(${JSON.stringify(BELIREN)})].filter((el) => {
            const r = el.getBoundingClientRect();
            // Tetik çizgisi ekranın %88'inde: üstü ekranın %80'inin üstüne çıkmış öğe artık görünür olmalı
            if (r.height === 0 || r.width === 0 || r.top < 0 || r.top > innerHeight * 0.8) return false;
            const st = getComputedStyle(el);
            return st.visibility === "hidden" || Number(st.opacity) < 0.05;
          })`;
        if ((await sekme.degerlendir(`${gorunmeyen}.length`)) === 0) continue;
        await bekle(2500);
        const gorunmeyenler = await sekme.degerlendir(`${gorunmeyen}
          .map((el) => el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + " «" + el.textContent.trim().slice(0, 40) + "»")`);
        gorunmeyenler.forEach((g) => takilanlar.add(g));
      }
      takilanlar.forEach((t) => ekle("hata", "Animasyon", `Ekrana girdiği hâlde görünmüyor: ${t}`));
      await sekme.degerlendir("(window.__lenis?.scrollTo?.(0, { immediate: true }), scrollTo(0, 0))");
      await bekle(900);
    }

    // Yatay taşma: sayfa ekrandan geniş mi, ekranın dışına taşan görünür öğe var mı
    const tasma = await sekme.degerlendir(`(() => {
      const gen = document.documentElement.clientWidth;
      // Ekrana sığan bir atası taşanı kırpıyorsa (hidden/clip) ya da yana kaydırılan bir vitrinse (auto/scroll) taşma değildir
      const kirpan = (el) => {
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          const st = getComputedStyle(a);
          if (/(hidden|clip|auto|scroll)/.test(st.overflowX) && a.getBoundingClientRect().right <= gen + 1) return true;
        }
        return false;
      };
      const tasanlar = [...document.querySelectorAll("body *")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0 || r.right <= gen + 1) return false;
          const st = getComputedStyle(el);
          if (st.position === "fixed" || st.visibility === "hidden" || Number(st.opacity) === 0) return false;
          if (el.closest("[aria-hidden=true], dialog:not([open])")) return false;
          return !kirpan(el);
        })
        .slice(0, 5)
        .map((el) => el.tagName.toLowerCase() + "." + String(el.className).split(" ").slice(0, 3).join(".") + " (sağ kenar " + Math.round(el.getBoundingClientRect().right) + "px)");
      return { sayfaGenis: document.documentElement.scrollWidth > gen + 1, tasanlar };
    })()`);
    if (tasma.sayfaGenis) ekle("hata", "Taşma", "Sayfa ekrandan geniş: yana kaydırma çıkıyor");
    tasma.tasanlar.forEach((t) => ekle("hata", "Taşma", `Ekran dışına taşan öğe: ${t}`));

    // Görseller: alt metni olmayan ve yüklenemeyen
    const gorseller = await sekme.degerlendir(`[...document.images].map((i) => ({
      src: i.currentSrc || i.src, alt: i.hasAttribute("alt"), bozuk: i.complete && i.naturalWidth === 0 && !!i.src
    }))`);
    gorseller
      .filter((g) => !g.alt)
      .forEach((g) => ekle("hata", "Görsel", `alt metni yok: ${g.src.replace(koken, "")}`));
    gorseller.filter((g) => g.bozuk).forEach((g) => ekle("hata", "Görsel", `Yüklenemedi: ${g.src.replace(koken, "")}`));

    if (secenek.seo) for (const b of await seoDenetle(sekme, adres, secenek)) bulgular.push(b);
    if (secenek.axe) for (const b of await erisilebilirlik(sekme)) bulgular.push(b);

    // Taramada kullanılacak site içi bağlantılar
    const baglantilar = await sekme.degerlendir(`[...document.querySelectorAll("a[href]")].map((a) => a.href)`);
    return { bulgular, baglantilar };
  } finally {
    birak.forEach((b) => b());
  }
}

async function seoDenetle(sekme, adres, secenek) {
  const b = [];
  const ekle = (onem, mesaj) => b.push({ onem, tur: "SEO", mesaj });
  const s = await sekme.degerlendir(`(() => {
    const meta = (ad) => document.querySelector('meta[name="' + ad + '"], meta[property="' + ad + '"]')?.content ?? null;
    const jsonld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
      try { const j = JSON.parse(s.textContent); return { tur: j["@type"] ?? (j["@graph"] ? "graph" : null) }; }
      catch (h) { return { hata: String(h).slice(0, 80) }; }
    });
    return {
      baslik: document.title, aciklama: meta("description"), kanonik: document.querySelector('link[rel="canonical"]')?.href ?? null,
      dil: document.documentElement.lang, h1: document.querySelectorAll("h1").length,
      ogBaslik: meta("og:title"), ogAciklama: meta("og:description"), ogGorsel: meta("og:image"), ogAdres: meta("og:url"),
      twitter: meta("twitter:card"), robots: meta("robots"), jsonld,
      basliklar: [...document.querySelectorAll("h1, h2, h3, h4")].map((h) => Number(h.tagName[1])),
    };
  })()`);
  const yol = new URL(adres).pathname;
  if (!s.baslik) ekle("hata", "Sayfa başlığı (title) yok");
  else if (s.baslik.length < 25 || s.baslik.length > 65)
    ekle("uyari", `Başlık uzunluğu ${s.baslik.length} (önerilen 25-65): «${s.baslik}»`);
  if (!s.aciklama) ekle("hata", "Meta açıklama yok");
  else if (s.aciklama.length < 70 || s.aciklama.length > 165)
    ekle("uyari", `Açıklama uzunluğu ${s.aciklama.length} (önerilen 70-165)`);
  if (!s.kanonik) ekle("hata", "Kanonik adres yok");
  else if (new URL(s.kanonik).pathname.replace(/\/$/, "") !== yol.replace(/\/$/, ""))
    ekle("hata", `Kanonik adres başka sayfayı gösteriyor: ${s.kanonik}`);
  else if (secenek.asilAdres && !s.kanonik.startsWith(secenek.asilAdres))
    ekle("uyari", `Kanonik adres asıl alan adında değil: ${s.kanonik}`);
  if (s.dil !== "tr") ekle("hata", `html lang "${s.dil}" (tr olmalı)`);
  if (s.h1 !== 1) ekle("hata", `Sayfada ${s.h1} tane h1 var (1 olmalı)`);
  for (const [ad, deger] of [
    ["og:title", s.ogBaslik],
    ["og:description", s.ogAciklama],
    ["og:image", s.ogGorsel],
    ["og:url", s.ogAdres],
    ["twitter:card", s.twitter],
  ]) {
    if (!deger) ekle("uyari", `${ad} yok`);
  }
  if (s.robots && /noindex/i.test(s.robots)) ekle("hata", `Sayfa noindex: ${s.robots}`);
  s.jsonld.filter((j) => j.hata).forEach((j) => ekle("hata", `JSON-LD okunamıyor: ${j.hata}`));
  // Başlık sırası: bir seviye atlanmasın (h2'den h4'e gibi)
  for (let i = 1; i < s.basliklar.length; i++) {
    if (s.basliklar[i] > s.basliklar[i - 1] + 1) {
      ekle("uyari", `Başlık seviyesi atlıyor: h${s.basliklar[i - 1]} → h${s.basliklar[i]}`);
      break;
    }
  }
  return b;
}

async function erisilebilirlik(sekme) {
  await sekme.degerlendir(AXE + ";true");
  const ihlaller = await sekme.degerlendir(`axe.run(document, {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] },
    resultTypes: ["violations"],
  }).then((r) => r.violations.map((v) => ({
    id: v.id, etki: v.impact, yardim: v.help, sayi: v.nodes.length,
    ornek: v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | "),
  })))`);
  return ihlaller.map((v) => ({
    onem: v.etki === "critical" || v.etki === "serious" ? "hata" : "uyari",
    tur: "Erişilebilirlik",
    mesaj: `${v.id} (${v.etki}, ${v.sayi} öğe): ${v.yardim}. Örnek: ${v.ornek}`,
  }));
}
