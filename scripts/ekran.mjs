// Sistemdeki Chrome ile ekran görüntüsü alır (ek paket yok, Chrome DevTools Protocol).
//
// Komut satırı:
//   node scripts/ekran.mjs <adres> <çıktı.webp|.png> [genişlik] [yükseklik] [--tam] [--telefon] [--bekle=ms]
// Örnek:
//   node scripts/ekran.mjs http://localhost:3000 .ekran/ana.png 1440 900
//   node scripts/ekran.mjs http://localhost:3000 .ekran/ana-tam.png 390 844 --telefon --tam
//
// --tam: sayfanın tamamını çeker (en çok `enCokYukseklik` piksel).
// Bekleme: sayfa yüklendikten sonra aşağı kaydırılır (tembel yüklenen görseller ve kaydırma animasyonları için),
// başa dönülür ve `bekle` kadar beklenir.

import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const CHROME_YOLLARI = [
  process.env.CHROME_YOLU,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

const bekle = (ms) => new Promise((coz) => setTimeout(coz, ms));

async function chromeAc() {
  const { existsSync } = await import("node:fs");
  const yol = CHROME_YOLLARI.find((y) => existsSync(y));
  if (!yol) throw new Error("Chrome bulunamadı. CHROME_YOLU ortam değişkeniyle yolu verin.");

  const profil = mkdtempSync(join(tmpdir(), "fanus-ekran-"));
  const port = 9300 + Math.floor(Math.random() * 500);
  const surec = spawn(
    yol,
    [
      "--headless=new",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profil}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--hide-scrollbars",
      "--disable-extensions",
      "--force-color-profile=srgb",
      "--enable-unsafe-swiftshader",
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  // DevTools ucu açılana kadar bekle
  let surum;
  for (let i = 0; i < 50; i++) {
    try {
      surum = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
      break;
    } catch {
      await bekle(200);
    }
  }
  if (!surum) throw new Error("Chrome DevTools ucuna bağlanılamadı.");

  const kapat = () => {
    surec.kill();
    try {
      rmSync(profil, { recursive: true, force: true });
    } catch {
      // Chrome dosyaları hemen bırakmayabilir; geçici klasör kalırsa sorun değil
    }
  };
  return { port, kapat };
}

/** Bir sekmeye bağlanır ve `gonder(yontem, parametre)` ile komut çalıştırır. */
async function sekmeAc(port) {
  const hedef = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
  const soket = new WebSocket(hedef.webSocketDebuggerUrl);
  await new Promise((coz, reddet) => {
    soket.onopen = coz;
    soket.onerror = reddet;
  });

  let sira = 0;
  const bekleyenler = new Map();
  const olayDinleyicileri = new Map();
  soket.onmessage = (mesaj) => {
    const veri = JSON.parse(mesaj.data);
    if (veri.id && bekleyenler.has(veri.id)) {
      const { coz, reddet } = bekleyenler.get(veri.id);
      bekleyenler.delete(veri.id);
      if (veri.error) reddet(new Error(veri.error.message));
      else coz(veri.result);
    } else if (veri.method && olayDinleyicileri.has(veri.method)) {
      olayDinleyicileri.get(veri.method)(veri.params);
      olayDinleyicileri.delete(veri.method);
    }
  };

  const gonder = (method, params = {}) =>
    new Promise((coz, reddet) => {
      sira += 1;
      bekleyenler.set(sira, { coz, reddet });
      soket.send(JSON.stringify({ id: sira, method, params }));
    });
  const olayiBekle = (method, zamanAsimi = 30000) =>
    new Promise((coz) => {
      olayDinleyicileri.set(method, coz);
      setTimeout(coz, zamanAsimi);
    });

  return { gonder, olayiBekle, kapat: () => soket.close() };
}

/**
 * @param {object} secenek
 * @param {string} secenek.adres
 * @param {string} secenek.cikti
 * @param {number} [secenek.genislik]
 * @param {number} [secenek.yukseklik]
 * @param {boolean} [secenek.tam]
 * @param {boolean} [secenek.telefon]
 * @param {number} [secenek.olcek] cihaz piksel oranı
 * @param {number} [secenek.bekle] ms
 * @param {number} [secenek.enCokYukseklik]
 * @param {string} [secenek.betik] çekimden önce sayfada çalıştırılacak JS (ör. çerez bandını gizlemek)
 */
export async function ekranGoruntusu(secenek) {
  const {
    adres,
    cikti,
    genislik = 1440,
    yukseklik = 900,
    tam = false,
    telefon = false,
    olcek = telefon ? 2 : 1,
    bekle: beklemeSuresi = 1500,
    enCokYukseklik = 12000,
    betik,
  } = secenek;

  const chrome = await chromeAc();
  try {
    const sekme = await sekmeAc(chrome.port);
    await sekme.gonder("Page.enable");
    await sekme.gonder("Emulation.setDeviceMetricsOverride", {
      width: genislik,
      height: yukseklik,
      deviceScaleFactor: olcek,
      mobile: telefon,
    });
    if (telefon) {
      await sekme.gonder("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
      await sekme.gonder("Emulation.setUserAgentOverride", {
        userAgent:
          "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Mobile Safari/537.36",
      });
    }

    const yuklendi = sekme.olayiBekle("Page.loadEventFired");
    await sekme.gonder("Page.navigate", { url: adres });
    await yuklendi;
    await bekle(800);

    // Sayfayı yavaşça aşağı kaydır: tembel görseller ve kaydırmayla açılan bölümler yüklensin
    await sekme.gonder("Runtime.evaluate", {
      awaitPromise: true,
      expression: `(async () => {
        const adim = innerHeight * 0.6;
        for (let y = 0; y < document.documentElement.scrollHeight; y += adim) {
          scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 300));
      })()`,
    });

    if (betik) await sekme.gonder("Runtime.evaluate", { expression: betik, awaitPromise: true });
    await bekle(beklemeSuresi);

    let yakalamaYuksekligi = yukseklik;
    // Tam sayfa değilse görünen alan çekilir (betik sayfayı kaydırmış olabilir)
    const { result: kaydirma } = await sekme.gonder("Runtime.evaluate", {
      expression: "[window.scrollY, document.title]",
      returnByValue: true,
    });
    const [ustY, baslik] = kaydirma.value;
    if (tam) {
      const { result } = await sekme.gonder("Runtime.evaluate", {
        expression: "document.documentElement.scrollHeight",
        returnByValue: true,
      });
      yakalamaYuksekligi = Math.min(result.value, enCokYukseklik);
    }

    const tur = cikti.endsWith(".png") ? "png" : cikti.endsWith(".jpg") ? "jpeg" : "webp";
    const { data } = await sekme.gonder("Page.captureScreenshot", {
      format: tur,
      quality: tur === "png" ? undefined : 82,
      captureBeyondViewport: tam,
      clip: { x: 0, y: tam ? 0 : ustY, width: genislik, height: yakalamaYuksekligi, scale: 1 },
    });
    mkdirSync(dirname(cikti), { recursive: true });
    writeFileSync(cikti, Buffer.from(data, "base64"));
    sekme.kapat();
    return { cikti, genislik, yukseklik: yakalamaYuksekligi, baslik };
  } finally {
    chrome.kapat();
  }
}

// Komut satırından çalıştırıldıysa
if (process.argv[1] && process.argv[1].replaceAll("\\", "/").endsWith("scripts/ekran.mjs")) {
  const [adres, cikti, genislik, yukseklik, ...bayraklar] = process.argv.slice(2);
  if (!adres || !cikti) {
    console.error("Kullanım: node scripts/ekran.mjs <adres> <çıktı> [genişlik] [yükseklik] [--tam] [--telefon]");
    process.exit(1);
  }
  const bekleBayragi = bayraklar.find((b) => b.startsWith("--bekle="));
  const sonuc = await ekranGoruntusu({
    adres,
    cikti,
    genislik: Number(genislik) || 1440,
    yukseklik: Number(yukseklik) || 900,
    tam: bayraklar.includes("--tam"),
    telefon: bayraklar.includes("--telefon"),
    bekle: bekleBayragi ? Number(bekleBayragi.split("=")[1]) : undefined,
  });
  console.log(`${sonuc.cikti} (${sonuc.genislik}x${sonuc.yukseklik})`);
}
