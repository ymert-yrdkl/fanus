// Denetim için Chrome sekmesi: komut gönder, olayları sürekli dinle, sayfada JS çalıştır, fare ve klavye.
// Chrome'u açan kod ekran görüntüsü betiğiyle ortak (scripts/ekran.mjs › chromeAc).

import { chromeAc } from "../ekran.mjs";

export const bekle = (ms) => new Promise((coz) => setTimeout(coz, ms));

export async function tarayiciAc() {
  const chrome = await chromeAc();
  return {
    port: chrome.port,
    sekmeAc: () => sekmeAc(chrome.port),
    kapat: chrome.kapat,
  };
}

async function sekmeAc(port) {
  const hedef = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
  const soket = new WebSocket(hedef.webSocketDebuggerUrl);
  await new Promise((coz, reddet) => {
    soket.onopen = coz;
    soket.onerror = reddet;
  });

  let sira = 0;
  const bekleyenler = new Map();
  const dinleyiciler = new Map(); // olay adı → işlevler
  soket.onmessage = (mesaj) => {
    const veri = JSON.parse(mesaj.data);
    if (veri.id && bekleyenler.has(veri.id)) {
      const { coz, reddet } = bekleyenler.get(veri.id);
      bekleyenler.delete(veri.id);
      if (veri.error) reddet(new Error(veri.error.message));
      else coz(veri.result);
    } else if (veri.method && dinleyiciler.has(veri.method)) {
      for (const islev of [...dinleyiciler.get(veri.method)]) islev(veri.params);
    }
  };

  const gonder = (method, params = {}) =>
    new Promise((coz, reddet) => {
      sira += 1;
      bekleyenler.set(sira, { coz, reddet });
      soket.send(JSON.stringify({ id: sira, method, params }));
    });

  /** Olayı sürekli dinler; dönen işlev dinlemeyi bırakır. */
  const dinle = (method, islev) => {
    if (!dinleyiciler.has(method)) dinleyiciler.set(method, new Set());
    dinleyiciler.get(method).add(islev);
    return () => dinleyiciler.get(method)?.delete(islev);
  };

  const olayiBekle = (method, zamanAsimi = 30000) =>
    new Promise((coz) => {
      const birak = dinle(method, (params) => {
        birak();
        coz(params);
      });
      setTimeout(() => {
        birak();
        coz(null);
      }, zamanAsimi);
    });

  /** Sayfada JS çalıştırır, sonucu döndürür (Promise beklenir). Sayfadaki hata buraya atılır. */
  const degerlendir = async (ifade) => {
    const sonuc = await gonder("Runtime.evaluate", { expression: ifade, returnByValue: true, awaitPromise: true });
    if (sonuc.exceptionDetails) {
      throw new Error(sonuc.exceptionDetails.exception?.description ?? sonuc.exceptionDetails.text);
    }
    return sonuc.result.value;
  };

  const git = async (adres) => {
    const yuklendi = olayiBekle("Page.loadEventFired", 45000);
    await gonder("Page.navigate", { url: adres });
    await yuklendi;
  };

  /** Ekran boyutu; telefonda dokunmatik ve telefon tarayıcı kimliği de verilir. */
  const boyut = async (genislik, yukseklik, telefon = genislik < 768) => {
    await gonder("Emulation.setDeviceMetricsOverride", {
      width: genislik,
      height: yukseklik,
      deviceScaleFactor: 1,
      mobile: telefon,
    });
    await gonder("Emulation.setTouchEmulationEnabled", { enabled: telefon, maxTouchPoints: telefon ? 5 : 1 });
    if (telefon) {
      await gonder("Emulation.setUserAgentOverride", {
        userAgent:
          "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Mobile Safari/537.36",
      });
    }
  };

  /** Seçicinin ortasına fareyle gelir (ve isterse tıklar). Öğe yoksa hata atar. */
  const fareyle = async (secici, tikla = true) => {
    const nokta = await degerlendir(`(() => {
      const el = document.querySelector(${JSON.stringify(secici)});
      if (!el) return null;
      el.scrollIntoView({ block: "center" });
      const r = el.getBoundingClientRect();
      return [r.x + r.width / 2, r.y + r.height / 2];
    })()`);
    if (!nokta) throw new Error(`Öğe bulunamadı: ${secici}`);
    const [x, y] = nokta;
    await gonder("Input.dispatchMouseEvent", { type: "mouseMoved", x, y, button: "none" });
    if (!tikla) return;
    await gonder("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
    await gonder("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
  };

  /** Açılış perdesi kalkana (ya da hareket yoksa hemen) kadar bekler; en çok 10 sn. */
  const hazirBekle = async () => {
    for (let i = 0; i < 50; i++) {
      const hazir = await degerlendir(`(() => {
        const a = document.querySelector(".acilis");
        return document.readyState === "complete" && (!a || getComputedStyle(a).display === "none");
      })()`).catch(() => false);
      if (hazir) break;
      await bekle(200);
    }
    await bekle(600);
  };

  /** Odaktaki alana metin yazar (gerçek klavye girişi gibi). */
  const yaz = (metin) => gonder("Input.insertText", { text: metin });

  const kapat = async () => {
    soket.close();
    await fetch(`http://127.0.0.1:${port}/json/close/${hedef.id}`).catch(() => undefined);
  };

  return { gonder, dinle, olayiBekle, degerlendir, git, boyut, fareyle, yaz, hazirBekle, kapat };
}
