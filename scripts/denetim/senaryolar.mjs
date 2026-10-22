// Etkileşim senaryoları: gerçek fare, dokunma ve klavye girdisiyle kullanıcı yolları. Her senaryo bir dizi
// beklenti dener; tutmayan her beklenti bir bulgudur. Yeni bir hata türü yakalandığında buraya senaryo eklenir.

import { bekle } from "./cdp.mjs";

const PANEL = "header li.group\\/acilir > div";

/** Sayfa geçişi bitti mi: örtü kapalı, içerik kaydırılmamış. */
const GECIS_DURUMU = `(() => {
  const ortu = document.querySelector(".gecis-ortusu");
  return {
    yol: location.pathname + location.search,
    ortuAcik: ortu ? getComputedStyle(ortu).display !== "none" : false,
    icerikKaymis: (document.querySelector("#icerik")?.style.transform ?? "") !== "",
  };
})()`;

/** Sayfa geçişinin bitmesini bekler (en çok 8 sn; makine yüklüyken geçiş yavaşlayabilir), son durumu döndürür. */
async function gecisiBekle(sekme) {
  let d;
  for (let i = 0; i < 40; i++) {
    await bekle(200);
    d = await sekme.degerlendir(GECIS_DURUMU).catch(() => null);
    if (d && !d.ortuAcik && !d.icerikKaymis && i >= 4) break;
  }
  return d;
}

const panelGorunur = (sekme) =>
  sekme.degerlendir(`getComputedStyle(document.querySelector(${JSON.stringify(PANEL)})).visibility === "visible"`);

export const SENARYOLAR = [
  {
    ad: "Masaüstü menü: Hizmetler'e tıklayınca sayfa açılır, açılır panel yeni sayfada kapalı kalır",
    genislik: 1440,
    async calistir(sekme, kok, beklenti) {
      await sekme.git(`${kok}/fiyatlar`);
      await sekme.hazirBekle();
      await sekme.fareyle('header a[href="/hizmetler"]', false);
      await bekle(500);
      beklenti(await panelGorunur(sekme), "Fare üstündeyken açılır panel açılmalı");
      await sekme.fareyle('header a[href="/hizmetler"]');
      const d = await gecisiBekle(sekme);
      beklenti(d.yol === "/hizmetler", `Hizmetler sayfası açılmalı (açılan: ${d.yol})`);
      beklenti(!d.ortuAcik, "Geçiş örtüsü kapanmalı");
      beklenti(!d.icerikKaymis, "Sayfa içeriği yerine oturmalı");
      beklenti(!(await panelGorunur(sekme)), "Yeni sayfada açılır panel kapalı olmalı (fare hâlâ üstünde)");
    },
  },
  {
    ad: "Açılır menüden alt sayfaya gidilir",
    genislik: 1440,
    async calistir(sekme, kok, beklenti) {
      await sekme.git(`${kok}/`);
      await sekme.hazirBekle();
      await sekme.fareyle('header a[href="/hizmetler"]', false);
      await bekle(500);
      await sekme.fareyle('header a[href="/hizmetler/e-ticaret"]');
      const d = await gecisiBekle(sekme);
      beklenti(d.yol === "/hizmetler/e-ticaret", `E-ticaret sayfası açılmalı (açılan: ${d.yol})`);
      beklenti(!d.ortuAcik, "Geçiş örtüsü kapanmalı");
      beklenti(!(await panelGorunur(sekme)), "Açılır panel kapanmalı");
    },
  },
  {
    ad: "Geri tuşu: önceki sayfa düzgün açılır",
    genislik: 1440,
    async calistir(sekme, kok, beklenti) {
      await sekme.git(`${kok}/isler`);
      await sekme.hazirBekle();
      await sekme.fareyle('header a[href="/fiyatlar"]');
      await bekle(2600);
      await sekme.degerlendir("history.back()");
      const d = await gecisiBekle(sekme);
      beklenti(d.yol === "/isler", `İşler sayfasına dönülmeli (açılan: ${d.yol})`);
      beklenti(!d.ortuAcik, "Geçiş örtüsü kapalı olmalı");
      const h1 = await sekme.degerlendir(`Number(getComputedStyle(document.querySelector("h1")).opacity)`);
      beklenti(h1 > 0.9, "Sayfa başlığı görünür olmalı");
    },
  },
  {
    ad: "Telefon menüsü: açılır, sayfaya gider, kapanır, sayfa kaydırılabilir",
    genislik: 390,
    async calistir(sekme, kok, beklenti) {
      await sekme.git(`${kok}/isler`);
      await sekme.hazirBekle();
      await sekme.fareyle('header button[aria-haspopup="dialog"]');
      await bekle(1200);
      beklenti(await sekme.degerlendir(`document.querySelector("dialog").open`), "Menü penceresi açılmalı");
      await sekme.fareyle('dialog a[href="/fiyatlar"]');
      const d = await gecisiBekle(sekme);
      beklenti(d.yol === "/fiyatlar", `Fiyatlar açılmalı (açılan: ${d.yol})`);
      beklenti(!(await sekme.degerlendir(`document.querySelector("dialog").open`)), "Menü penceresi kapanmalı");
      beklenti(!d.ortuAcik, "Geçiş örtüsü kapanmalı");
      await sekme.gonder("Input.synthesizeScrollGesture", { x: 200, y: 600, yDistance: -500, speed: 2000 });
      await bekle(800);
      beklenti((await sekme.degerlendir("scrollY")) > 100, "Sayfa parmakla kaydırılabilmeli");
    },
  },
  {
    ad: "Teklif formu: ?paket= ile paket seçili gelir, işletme adı mesaja ve bağlantıya girer",
    genislik: 1440,
    async calistir(sekme, kok, beklenti) {
      await sekme.git(`${kok}/iletisim?paket=kurumsal`);
      await sekme.hazirBekle();
      const secili = await sekme.degerlendir(
        `[...document.querySelectorAll('#teklif button[aria-pressed="true"]')].map((b) => b.textContent.trim())`,
      );
      beklenti(
        secili.some((s) => s.includes("Kurumsal site, tam paket")),
        `Kurumsal tam paket seçili gelmeli (seçili: ${secili.join(", ") || "yok"})`,
      );
      await sekme.fareyle("#teklif-ad");
      await sekme.yaz("Deneme Fırın");
      await bekle(400);
      const m = await sekme.degerlendir(`({
        mesaj: document.querySelector('#teklif [aria-live="polite"]')?.textContent ?? "",
        eposta: document.querySelector('#teklif a[href^="mailto:"]')?.getAttribute("href") ?? "",
      })`);
      beklenti(m.mesaj.includes("Deneme Fırın"), "İşletme adı mesaja girmeli");
      beklenti(decodeURIComponent(m.eposta).includes("Deneme Fırın"), "İşletme adı e-posta bağlantısına girmeli");
    },
  },
  {
    ad: "Fiyat kartındaki düğmeden teklif formuna: paket seçili, form görünür",
    genislik: 390,
    async calistir(sekme, kok, beklenti) {
      await sekme.git(`${kok}/fiyatlar`);
      await sekme.hazirBekle();
      await sekme.fareyle('a[href="/iletisim?paket=e-ticaret"]');
      await bekle(3200);
      const d = await sekme.degerlendir(`({
        yol: location.pathname + location.search,
        secili: [...document.querySelectorAll('#teklif button[aria-pressed="true"]')].map((b) => b.textContent.trim()),
        formOpaklik: Number(getComputedStyle(document.querySelector("#teklif form")).opacity),
      })`);
      beklenti(d.yol === "/iletisim?paket=e-ticaret", `Teklif sayfası açılmalı (açılan: ${d.yol})`);
      beklenti(
        d.secili.some((s) => s.includes("E-ticaret")),
        `E-ticaret seçili gelmeli (seçili: ${d.secili.join(", ") || "yok"})`,
      );
      beklenti(d.formOpaklik > 0.9, `Form görünür olmalı (opaklık: ${d.formOpaklik})`);
    },
  },
  {
    ad: "Fiyat sayaçları doğru fiyatta durur",
    genislik: 1440,
    async calistir(sekme, kok, beklenti) {
      await sekme.git(`${kok}/fiyatlar`);
      await sekme.hazirBekle();
      await sekme.degerlendir(`document.querySelector("[data-sayac]").scrollIntoView({ block: "center" })`);
      await bekle(3500);
      const sayaclar = await sekme.degerlendir(`[...document.querySelectorAll("[data-sayac]")].map((el) => ({
        hedef: Number(el.dataset.sayac).toLocaleString("tr-TR"), gorunen: el.textContent.trim(),
        ekranda: el.getBoundingClientRect().top < innerHeight,
      }))`);
      sayaclar
        .filter((s) => s.ekranda)
        .forEach((s) => beklenti(s.gorunen === s.hedef, `Sayaç ${s.hedef} göstermeli (gösterilen: ${s.gorunen})`));
    },
  },
  {
    ad: "Hizmetler: işletme adı yazılınca örnekler o adla çalışır",
    genislik: 1440,
    async calistir(sekme, kok, beklenti) {
      await sekme.git(`${kok}/hizmetler`);
      await sekme.hazirBekle();
      const once = await sekme.degerlendir(`document.body.innerText.split("Deneme Fırın").length - 1`);
      await sekme.fareyle('input[placeholder="Örneğin Yıldız Fırın"]');
      await sekme.yaz("Deneme Fırın");
      await bekle(800);
      const sonra = await sekme.degerlendir(`document.body.innerText.split("Deneme Fırın").length - 1`);
      beklenti(sonra >= once + 3, `Ad en az üç örnekte görünmeli (görünen: ${sonra - once})`);
    },
  },
  {
    ad: "Hareket azaltma tercihi: her şey baştan görünür, açılış perdesi çıkmaz",
    genislik: 1440,
    async calistir(sekme, kok, beklenti) {
      await sekme.gonder("Emulation.setEmulatedMedia", {
        features: [{ name: "prefers-reduced-motion", value: "reduce" }],
      });
      await sekme.git(`${kok}/`);
      await bekle(1500);
      const d = await sekme.degerlendir(`({
        perde: (() => { const a = document.querySelector(".acilis"); return a ? getComputedStyle(a).display !== "none" : false; })(),
        gizli: [...document.querySelectorAll("[data-belir], [data-giris], [data-giris-baslik]")].filter((el) => Number(getComputedStyle(el).opacity) < 0.05).length,
      })`);
      beklenti(!d.perde, "Açılış perdesi görünmemeli");
      beklenti(d.gizli === 0, `Gizli kalan öğe olmamalı (gizli: ${d.gizli})`);
      await sekme.gonder("Emulation.setEmulatedMedia", { features: [] });
    },
  },
  {
    ad: "Renk düzeni: bütün sayfalar kâğıt (açık) zeminde başlar",
    genislik: 1440,
    async calistir(sekme, kok, beklenti) {
      const yollar = [
        "/",
        "/iletisim",
        "/hizmetler",
        "/hizmetler/e-ticaret",
        "/hizmetler/kurumsal-site",
        "/hizmetler/qr-menu",
        "/hizmetler/web-otomasyonu",
        "/fiyatlar",
        "/isler",
      ];
      for (const yol of yollar) {
        await sekme.git(kok + yol);
        await sekme.hazirBekle();
        // Ana içeriğin ilk bölümünün zemini açık olmalı (parlaklık 0-1)
        const parlaklik = await sekme.degerlendir(`(() => {
          const ilk = document.querySelector("#icerik section") ?? document.querySelector("#icerik");
          let el = ilk, renk = "rgba(0, 0, 0, 0)";
          while (el && (renk === "rgba(0, 0, 0, 0)" || renk === "transparent")) { renk = getComputedStyle(el).backgroundColor; el = el.parentElement; }
          const [r, g, b] = renk.match(/[0-9]+/g).map(Number);
          return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        })()`);
        beklenti(parlaklik > 0.8, `${yol} açık zeminde başlamalı (parlaklık ${parlaklik.toFixed(2)})`);
      }
    },
  },
  {
    ad: "Olmayan sayfa 404 döner ve Türkçe sayfa gösterir",
    genislik: 1440,
    async calistir(sekme, kok, beklenti) {
      const yanit = await fetch(`${kok}/olmayan-bir-sayfa`, { redirect: "manual" });
      beklenti(yanit.status === 404, `Durum 404 olmalı (gelen: ${yanit.status})`);
      beklenti((await yanit.text()).includes("Bu sayfa yok"), "Türkçe 404 sayfası gösterilmeli");
    },
  },
];

/** Yalnız canlı sitede: diğer alan adları asıl adrese kalıcı yönlenmeli. */
export const yonlendirmeSenaryosu = (asilAdres, digerleri) => ({
  ad: "Yönlendirmeler: www ve eski adresler asıl adrese kalıcı yönlenir",
  genislik: 1440,
  async calistir(sekme, kok, beklenti) {
    for (const adres of digerleri) {
      const yanit = await fetch(`${adres}/fiyatlar`, { redirect: "manual" }).catch(() => null);
      if (!yanit) {
        beklenti(false, `${adres} açılamadı`);
        continue;
      }
      beklenti([301, 308].includes(yanit.status), `${adres} kalıcı yönlenmeli (gelen: ${yanit.status})`);
      beklenti(
        yanit.headers.get("location") === `${asilAdres}/fiyatlar`,
        `${adres} → ${asilAdres}/fiyatlar olmalı (gelen: ${yanit.headers.get("location")})`,
      );
    }
  },
});
