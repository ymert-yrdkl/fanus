// IndexNow: sitenin bütün adreslerini Bing, Yandex, Seznam, Naver ve IndexNow'a katılan diğer arama motorlarına
// "değişti, gel tara" diye bildirir. Yayından sonra çalıştırılır:
//   npm run indexnow            (canlı site haritasındaki bütün adresler)
//   npm run indexnow -- /fiyatlar /hizmetler/e-ticaret   (yalnız bunlar)
//
// Anahtar herkese açık olmak üzere tasarlanmıştır: public/<anahtar>.txt dosyası sahipliği kanıtlar.

import { readdirSync, readFileSync } from "node:fs";

const ADRES = process.env.NEXT_PUBLIC_SITE_ADRESI ?? "https://fanussoft.com";
const host = new URL(ADRES).host;

const anahtarDosyasi = readdirSync("public").find((d) => /^[0-9a-f]{32}\.txt$/.test(d));
if (!anahtarDosyasi) throw new Error("public/ içinde IndexNow anahtar dosyası yok");
const anahtar = readFileSync(`public/${anahtarDosyasi}`, "utf8").trim();

const verilen = process.argv.slice(2).filter((a) => a.startsWith("/"));
let adresler;
if (verilen.length) {
  adresler = verilen.map((y) => `${ADRES}${y === "/" ? "" : y}`);
} else {
  const harita = await (await fetch(`${ADRES}/sitemap.xml`)).text();
  adresler = [...harita.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const yanit = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: anahtar, keyLocation: `${ADRES}/${anahtarDosyasi}`, urlList: adresler }),
});
console.log(`IndexNow: ${adresler.length} adres gönderildi, yanıt ${yanit.status} ${yanit.statusText}`);
// 200 ve 202 kabul; 403 anahtar dosyası henüz yayında değil; 422 adresler bu alan adına ait değil
if (![200, 202].includes(yanit.status)) process.exitCode = 1;
