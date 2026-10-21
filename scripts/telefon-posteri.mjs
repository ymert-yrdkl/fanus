// Telefon sabit görseli (public/fanus-telefon.webp): telefonda 3B sahne ilk etkileşime kadar bu görselle durur.
// 3B sahne (cam, alev, konum) her değiştiğinde yeniden çekilir:
//   node scripts/telefon-posteri.mjs [adres]        → varsayılan http://localhost:3400 (üretim derlemesi)
// 390x844, 2x: sahne yüklenince tuval dışındaki her şey gizlenir, ekran WebP olarak kaydedilir.

import { writeFileSync } from "node:fs";
import { tarayiciAc, bekle } from "./denetim/cdp.mjs";

const kok = (process.argv[2] ?? "http://localhost:3400").replace(/\/$/, "");
const cikti = "public/fanus-telefon.webp";

const t = await tarayiciAc();
try {
  const s = await t.sekmeAc();
  await s.gonder("Page.enable");
  await s.gonder("Runtime.enable");
  await s.gonder("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await s.gonder("Emulation.setTouchEmulationEnabled", { enabled: true });
  await s.git(`${kok}/`);
  await s.hazirBekle();
  // Sahne ilk dokunuşta yüklenir
  await s.gonder("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 200, y: 500 }] });
  await s.gonder("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  for (let i = 0; i < 80; i++) {
    const hazir = await s.degerlendir(
      `(() => { const c = document.querySelector("canvas"); return !!c && getComputedStyle(c.parentElement).opacity === "1"; })()`,
    );
    if (hazir) break;
    await bekle(250);
  }
  // Giriş animasyonu bitsin (cam iner, alev yanar)
  await bekle(3000);
  await s.degerlendir(
    `(() => { for (const e of document.querySelectorAll("header, main, footer, img, #ilerleme")) e.style.visibility = "hidden"; document.body.classList.remove("tane"); })()`,
  );
  await bekle(400);
  const { data } = await s.gonder("Page.captureScreenshot", { format: "webp", quality: 82 });
  writeFileSync(cikti, Buffer.from(data, "base64"));
  console.log("yazıldı", cikti);
  await s.kapat();
} finally {
  t.kapat();
}
