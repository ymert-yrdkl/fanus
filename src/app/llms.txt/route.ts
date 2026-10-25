// /llms.txt: yapay zekâ aramaları (ChatGPT, Claude, Perplexity, Gemini) için sitenin düz metin özeti
// (llmstxt.org biçimi). Bütün bilgi src/site'tan okunur; sitede ne yazıyorsa burada da o yazar.

import { SITE } from "@/site/ayarlar";
import { fiyatYaz, HIZMETLER, PAKETLER, REFERANSLAR, YENILEMEYE_DAHIL, YILLIK_YENILEME } from "@/site/icerik";
import { MARKA, SEHIR, tamAdres } from "@/site/seo";

export const dynamic = "force-static";

export function GET() {
  const paketFiyati = (fiyat: number | null, baslangic?: boolean) =>
    fiyat === null ? "fiyat teklif üzerine" : `${fiyatYaz(fiyat)}${baslangic ? "'dan başlayan" : ""} (+KDV)`;

  const satirlar = [
    `# ${MARKA}`,
    "",
    `> ${SITE.aciklama}`,
    "",
    `${MARKA}, ${SEHIR} merkezli bir yazılım ve teknoloji stüdyosudur; Türkiye'nin her yerindeki işletmelere web sitesi, e-ticaret, QR menü, NFC kart sistemleri, mobil uygulama ve özel yazılım kurar. Fiyatlar sitede açıkça yazılıdır ve KDV hariçtir. Adres: ${SITE.adres}`,
    "",
    "## Hizmetler",
    "",
    ...HIZMETLER.map((h) => `- [${h.ad}](${tamAdres(`/hizmetler/${h.adres}`)}): ${h.seoAciklamasi}`),
    "",
    "## Paketler ve fiyatlar",
    "",
    ...PAKETLER.map((p) => `- ${p.ad}: ${paketFiyati(p.fiyat, p.baslangic)}. ${p.ozet}`),
    `- Yıllık yenileme: ${fiyatYaz(YILLIK_YENILEME)} (+KDV). Dahil olanlar: ${YENILEMEYE_DAHIL.join("; ")}.`,
    `- Bütün paketler: ${tamAdres("/fiyatlar")}`,
    "",
    "## Yayındaki işler",
    "",
    ...REFERANSLAR.map((r) => `- [${r.ad}](${r.adres}) (${r.tur}${r.sehir ? `, ${r.sehir}` : ""}): ${r.ozet}`),
    "",
    "## Sayfalar",
    "",
    `- [Ana sayfa](${tamAdres("/")})`,
    `- [Hizmetler](${tamAdres("/hizmetler")}): her hizmetin canlı örneği`,
    `- [Fiyatlar](${tamAdres("/fiyatlar")})`,
    `- [İşler](${tamAdres("/isler")}): yayındaki siteler ve uygulamalar`,
    `- [İletişim ve teklif](${tamAdres("/iletisim")})`,
    "",
    "## İletişim",
    "",
    `- E-posta: ${SITE.eposta}`,
    ...(SITE.telefon ? [`- Telefon: ${SITE.telefon}`] : []),
    ...(SITE.whatsapp ? [`- WhatsApp: https://wa.me/${SITE.whatsapp}`] : []),
    `- Teklif formu: ${tamAdres("/iletisim")}`,
    "",
  ];

  return new Response(satirlar.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
