// Site denetimi: bütün sayfaları gerçek Chrome'da birkaç ekran genişliğinde gezer, etkileşim senaryolarını
// oynatır, bağlantıları ve site haritasını dener; yalnız sorunları raporlar.
//
//   npm run denetim                          → http://localhost:3400 (önce: npm run build && npx next start -p 3400)
//   npm run denetim -- https://fanussoft.com → canlı site (yönlendirmeler de denenir)
//   npm run denetim -- <adres> --hizli       → yalnız telefon (390) ve masaüstü (1440)
//
// Rapor: .denetim/rapor.md. Hata varsa çıkış kodu 1.

import { mkdirSync, writeFileSync } from "node:fs";
import { tarayiciAc } from "./cdp.mjs";
import { sayfayiDenetle } from "./sayfa.mjs";
import { SENARYOLAR, yonlendirmeSenaryosu } from "./senaryolar.mjs";

const ASIL_ADRES = "https://fanussoft.com";
const DIGER_ADRESLER = ["https://www.fanussoft.com", "https://fanustr.ahmcloud.com"];

const argumanlar = process.argv.slice(2);
const kok = (argumanlar.find((a) => !a.startsWith("--")) ?? "http://localhost:3400").replace(/\/$/, "");
const hizli = argumanlar.includes("--hizli");
const canli = new URL(kok).host === new URL(ASIL_ADRES).host;
const GENISLIKLER = hizli ? [390, 1440] : [320, 390, 768, 1024, 1440];
const AYNI_ANDA = 2;

const bulgular = []; // { onem, tur, mesaj, sayfa, genislik }
const gecenSenaryolar = [];
const baslangic = Date.now();

/**
 * İşleri en çok `adet` tanesi aynı anda çalışacak şekilde yürütür. Her işçi işe kendi numarasını verir:
 * tarayıcı isteyen işler o işçinin AYRI Chrome'unu kullanır (aynı Chrome'daki arka sekmede tarayıcı
 * animasyon karelerini durdurur; sayfa yavaş değil "donmuş" görünür).
 */
async function havuz(isler, adet) {
  const kuyruk = [...isler];
  await Promise.all(
    Array.from({ length: adet }, async (_, isci) => {
      while (kuyruk.length) await kuyruk.shift()(isci);
    }),
  );
}

const yolu = (adres) => {
  const u = new URL(adres, kok);
  return u.pathname.replace(/\/$/, "") || "/";
};

// ---- 1. Sayfa listesi: site haritası + sayfalarda bulunan site içi bağlantılar ----
const haritaYaniti = await fetch(`${kok}/sitemap.xml`);
const haritaMetni = haritaYaniti.ok ? await haritaYaniti.text() : "";
if (!haritaYaniti.ok)
  bulgular.push({
    onem: "hata",
    tur: "SEO",
    mesaj: `sitemap.xml açılmıyor (${haritaYaniti.status})`,
    sayfa: "/sitemap.xml",
  });
const haritadakiler = [...haritaMetni.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => yolu(m[1]));
for (const adres of [...haritaMetni.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])) {
  if (!adres.startsWith(ASIL_ADRES))
    bulgular.push({
      onem: "hata",
      tur: "SEO",
      mesaj: `Site haritasında asıl alan adı dışında adres: ${adres}`,
      sayfa: "/sitemap.xml",
    });
}
const robots = await (await fetch(`${kok}/robots.txt`)).text().catch(() => "");
if (!/^Sitemap:\s*\S+/im.test(robots))
  bulgular.push({ onem: "hata", tur: "SEO", mesaj: "robots.txt site haritasını göstermiyor", sayfa: "/robots.txt" });
if (/Disallow:\s*\/\s*$/im.test(robots))
  bulgular.push({ onem: "hata", tur: "SEO", mesaj: "robots.txt bütün siteyi kapatıyor", sayfa: "/robots.txt" });

const sayfalar = new Set(haritadakiler.length ? haritadakiler : ["/"]);
const bulunanBaglantilar = new Set();

// ---- 2. Sayfa denetimi: her işçiye bir Chrome ----
const tarayicilar = await Promise.all(Array.from({ length: AYNI_ANDA }, () => tarayiciAc()));
try {
  const sayfaIsleri = (yollar) =>
    yollar.flatMap((yol) =>
      GENISLIKLER.map((genislik) => async (isci) => {
        const derin = genislik === 390 || genislik === 1440;
        const sekme = await tarayicilar[isci].sekmeAc();
        try {
          const sonuc = await sayfayiDenetle(sekme, kok + yol, {
            genislik,
            yukseklik: genislik < 768 ? 844 : 900,
            kaydir: derin,
            axe: derin,
            seo: genislik === 1440,
            koken: kok,
            asilAdres: ASIL_ADRES,
          });
          sonuc.bulgular.forEach((b) => bulgular.push({ ...b, sayfa: yol, genislik }));
          sonuc.baglantilar.forEach((b) => bulunanBaglantilar.add(b));
        } catch (hata) {
          bulgular.push({
            onem: "hata",
            tur: "Denetim",
            mesaj: `Sayfa denetlenemedi: ${hata.message}`,
            sayfa: yol,
            genislik,
          });
        } finally {
          await sekme.kapat();
        }
        process.stdout.write(".");
      }),
    );

  await havuz(sayfaIsleri([...sayfalar]), AYNI_ANDA);

  // Haritada olmayan ama bağlantısı verilen site içi sayfalar: onlar da denetlenir ve uyarı yazılır
  const yeniler = [...bulunanBaglantilar]
    .filter((b) => new URL(b).origin === new URL(kok).origin)
    .map(yolu)
    .filter((y) => !sayfalar.has(y) && !/\.(png|jpe?g|webp|svg|xml|txt|ico)$/.test(y));
  const benzersiz = [...new Set(yeniler)];
  benzersiz.forEach((y) => {
    sayfalar.add(y);
    bulgular.push({ onem: "uyari", tur: "SEO", mesaj: "Sayfaya bağlantı var ama site haritasında yok", sayfa: y });
  });
  await havuz(sayfaIsleri(benzersiz), AYNI_ANDA);

  // ---- 3. Bağlantılar ----
  const icler = [
    ...new Set(
      [...bulunanBaglantilar].filter((b) => new URL(b).origin === new URL(kok).origin).map((b) => kok + yolu(b)),
    ),
  ];
  const dislar = [
    ...new Set([...bulunanBaglantilar].filter((b) => /^https?:/.test(b) && new URL(b).origin !== new URL(kok).origin)),
  ];
  await havuz(
    icler.map((adres) => async () => {
      const y = await fetch(adres, { redirect: "manual" }).catch(() => null);
      if (!y) bulgular.push({ onem: "hata", tur: "Bağlantı", mesaj: "Açılmıyor", sayfa: yolu(adres) });
      else if (y.status >= 400)
        bulgular.push({
          onem: "hata",
          tur: "Bağlantı",
          mesaj: `Kırık site içi bağlantı (${y.status})`,
          sayfa: yolu(adres),
        });
      else if (y.status >= 300)
        bulgular.push({
          onem: "uyari",
          tur: "Bağlantı",
          mesaj: `Site içi bağlantı yönleniyor (${y.status} → ${y.headers.get("location")})`,
          sayfa: yolu(adres),
        });
    }),
    6,
  );
  await havuz(
    dislar.map((adres) => async () => {
      const y = await fetch(adres, {
        redirect: "follow",
        signal: AbortSignal.timeout(12000),
        headers: { "user-agent": "Mozilla/5.0 fanussoft-denetim" },
      }).catch(() => null);
      if (!y || y.status >= 400)
        bulgular.push({
          onem: "uyari",
          tur: "Bağlantı",
          mesaj: `Dış bağlantı açılmıyor (${y ? y.status : "bağlantı yok"}): ${adres}`,
          sayfa: "-",
        });
    }),
    6,
  );

  // ---- 4. Senaryolar ----
  const senaryolar = canli ? [...SENARYOLAR, yonlendirmeSenaryosu(ASIL_ADRES, DIGER_ADRESLER)] : SENARYOLAR;
  await havuz(
    senaryolar.map((senaryo) => async (isci) => {
      const sekme = await tarayicilar[isci].sekmeAc();
      const tutmayanlar = [];
      try {
        await sekme.gonder("Page.enable");
        await sekme.gonder("Runtime.enable");
        await sekme.boyut(senaryo.genislik, senaryo.genislik < 768 ? 844 : 900);
        await senaryo.calistir(sekme, kok, (kosul, mesaj) => {
          if (!kosul) tutmayanlar.push(mesaj);
        });
      } catch (hata) {
        tutmayanlar.push(`Senaryo yarıda kaldı: ${hata.message}`);
      } finally {
        await sekme.kapat();
      }
      if (tutmayanlar.length) {
        tutmayanlar.forEach((m) =>
          bulgular.push({ onem: "hata", tur: "Senaryo", mesaj: `${senaryo.ad}: ${m}`, sayfa: "-" }),
        );
      } else {
        gecenSenaryolar.push(senaryo.ad);
      }
      process.stdout.write("s");
    }),
    AYNI_ANDA,
  );
} finally {
  tarayicilar.forEach((t) => t.kapat());
}

// ---- 5. Rapor: aynı bulgu birden çok genişlikte çıktıysa tek satırda birleşir ----
const birlesik = new Map();
for (const b of bulgular) {
  const anahtar = `${b.onem}|${b.tur}|${b.sayfa}|${b.mesaj}`;
  if (!birlesik.has(anahtar)) birlesik.set(anahtar, { ...b, genislikler: new Set() });
  if (b.genislik) birlesik.get(anahtar).genislikler.add(b.genislik);
}
const liste = [...birlesik.values()].sort((a, b) => a.tur.localeCompare(b.tur, "tr") || a.sayfa.localeCompare(b.sayfa));
const hatalar = liste.filter((b) => b.onem === "hata");
const uyarilar = liste.filter((b) => b.onem === "uyari");
const satir = (b) =>
  `- **${b.tur}** \`${b.sayfa}\`${b.genislikler.size ? ` (${[...b.genislikler].sort((x, y) => x - y).join(", ")} px)` : ""}: ${b.mesaj}`;

const sure = Math.round((Date.now() - baslangic) / 1000);
const rapor = `# Site denetimi

- Adres: ${kok}
- Tarih: ${new Date().toLocaleString("tr-TR")}
- Sayfa: ${sayfalar.size} · genişlik: ${GENISLIKLER.join(", ")} px · senaryo: ${gecenSenaryolar.length + new Set(hatalar.filter((h) => h.tur === "Senaryo").map((h) => h.mesaj.split(":")[0])).size} · süre: ${sure} sn
- Sonuç: **${hatalar.length} hata, ${uyarilar.length} uyarı**

## Hatalar
${hatalar.map(satir).join("\n") || "Yok."}

## Uyarılar
${uyarilar.map(satir).join("\n") || "Yok."}

## Geçen senaryolar
${gecenSenaryolar.map((s) => `- ${s}`).join("\n") || "Yok."}
`;

mkdirSync(".denetim", { recursive: true });
writeFileSync(".denetim/rapor.md", rapor);
console.log(`\n\n${hatalar.length} hata, ${uyarilar.length} uyarı (${sure} sn). Rapor: .denetim/rapor.md`);
for (const b of hatalar.slice(0, 40)) console.log(satir(b));
if (hatalar.length > 40) console.log(`… ve ${hatalar.length - 40} hata daha`);
process.exitCode = hatalar.length ? 1 : 0;
