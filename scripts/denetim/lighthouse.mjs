// Lighthouse ölçümü (PageSpeed'in kullandığı araç): seçili sayfalar telefon ve masaüstü için.
//
//   npm run denetim:lighthouse                          → http://localhost:3400
//   npm run denetim:lighthouse -- https://fanussoft.com → canlı site
//
// Rapor: .denetim/lighthouse.md (puanlar, ölçümler, en çok kazandıracak iyileştirmeler, geçemeyen denetimler).
// Lighthouse ilk çalıştırmada npx ile indirilir; sistemdeki Chrome kullanılır.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const kok = (process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "http://localhost:3400").replace(/\/$/, "");
const SAYFALAR = ["/", "/hizmetler/e-ticaret"];
const CHROME = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "/usr/bin/google-chrome"].find((y) => existsSync(y));

mkdirSync(".denetim", { recursive: true });
const satirlar = [`# Lighthouse ölçümü`, ``, `- Adres: ${kok}`, `- Tarih: ${new Date().toLocaleString("tr-TR")}`, ``];
const ms = (a) => (a?.numericValue != null ? `${(a.numericValue / 1000).toFixed(1)} sn` : "-");

for (const yol of SAYFALAR) {
  for (const cihaz of ["telefon", "masaustu"]) {
    const cikti = `.denetim/lh-${yol.replace(/\W+/g, "_") || "ana"}-${cihaz}.json`;
    const argumanlar = [
      "-y",
      "lighthouse@12",
      kok + yol,
      "--output=json",
      `--output-path=${cikti}`,
      "--quiet",
      "--chrome-flags=--headless=new",
      "--only-categories=performance,accessibility,best-practices,seo",
      ...(cihaz === "masaustu" ? ["--preset=desktop"] : []),
    ];
    process.stdout.write(`${yol} ${cihaz} … `);
    try {
      execFileSync("npx", argumanlar, {
        stdio: "ignore",
        shell: process.platform === "win32",
        env: { ...process.env, ...(CHROME ? { CHROME_PATH: CHROME } : {}) },
        timeout: 240000,
      });
    } catch {
      console.log("ölçülemedi");
      satirlar.push(`## ${yol} · ${cihaz}`, ``, `Ölçülemedi.`, ``);
      continue;
    }
    const r = JSON.parse(readFileSync(cikti, "utf8"));
    const puan = (k) => Math.round((r.categories[k]?.score ?? 0) * 100);
    const a = r.audits;
    console.log(`hız ${puan("performance")}`);
    satirlar.push(
      `## ${yol} · ${cihaz}`,
      ``,
      `Hız **${puan("performance")}** · Erişilebilirlik ${puan("accessibility")} · En iyi uygulamalar ${puan("best-practices")} · SEO ${puan("seo")}`,
      ``,
      `FCP ${ms(a["first-contentful-paint"])} · LCP ${ms(a["largest-contentful-paint"])} · TBT ${Math.round(a["total-blocking-time"]?.numericValue ?? 0)} ms · CLS ${(a["cumulative-layout-shift"]?.numericValue ?? 0).toFixed(3)} · Speed Index ${ms(a["speed-index"])}`,
      ``,
    );
    const lcp = a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node;
    if (lcp) satirlar.push(`LCP öğesi: \`${(lcp.snippet ?? "").slice(0, 140)}\``, ``);
    // En çok kazandıracak iyileştirmeler (tahmini kazanç)
    const firsatlar = Object.values(a)
      .filter((x) => x.details?.type === "opportunity" && (x.details.overallSavingsMs ?? 0) > 50)
      .sort((x, y) => y.details.overallSavingsMs - x.details.overallSavingsMs)
      .slice(0, 6);
    if (firsatlar.length) {
      satirlar.push(`İyileştirmeler:`);
      firsatlar.forEach((x) => satirlar.push(`- ${x.title} (~${Math.round(x.details.overallSavingsMs)} ms)`));
      satirlar.push(``);
    }
    // Ana iş parçacığını en çok meşgul edenler
    const isler = a["bootup-time"]?.details?.items?.slice(0, 4) ?? [];
    if (isler.length) {
      satirlar.push(`En çok işlemci kullanan betikler:`);
      isler.forEach((x) => satirlar.push(`- ${String(x.url).replace(kok, "")}: ${Math.round(x.total)} ms`));
      satirlar.push(``);
    }
    // Geçemeyen erişilebilirlik / SEO / en iyi uygulama denetimleri
    const kalanlar = ["accessibility", "best-practices", "seo"].flatMap((k) =>
      r.categories[k].auditRefs.filter((ref) => ref.weight > 0 && a[ref.id]?.score !== null && a[ref.id]?.score < 1).map((ref) => `${k}: ${a[ref.id].title}`),
    );
    if (kalanlar.length) {
      satirlar.push(`Geçemeyen denetimler:`);
      kalanlar.forEach((k) => satirlar.push(`- ${k}`));
      satirlar.push(``);
    }
  }
}

writeFileSync(".denetim/lighthouse.md", satirlar.join("\n"));
console.log("Rapor: .denetim/lighthouse.md");
