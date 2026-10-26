import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import Acilis from "@/bilesenler/Acilis";
import Alt from "@/bilesenler/Alt";
import { IsletmeAdiSaglayici } from "@/bilesenler/IsletmeAdi";
import UstMenu from "@/bilesenler/UstMenu";
import GecisYoneticisi from "@/hareket/GecisYoneticisi";
import PuruzsuzKaydirma from "@/hareket/PuruzsuzKaydirma";
import SayfaEtkileri from "@/hareket/SayfaEtkileri";
import { SITE } from "@/site/ayarlar";
import { cekirdekVeri, jsonLd, MARKA } from "@/site/seo";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin", "latin-ext"] });
// Mono etiketlerde ve sayfa başı kırıntısında: öncelikli indirilir. Ön yüklemesi kapatılınca geç gelen yazı tipi
// kırıntıyı iki satıra kırıp altındaki her şeyi itiyordu (PageSpeed: düzen kayması 0,19)
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"] });
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
  // opsz: büyük boy çizimi; wdth: başlıklar hafif sıkışık (afiş gibi), etiketler geniş
  axes: ["opsz", "wdth"],
});

// Sayfaların kendi başlığı, açıklaması ve paylaşım etiketleri src/site/seo.ts › sayfaMetasi ile yazılır.
const { google, bing, yandex } = SITE.dogrulama;
export const metadata: Metadata = {
  metadataBase: new URL(SITE.adres),
  title: { default: SITE.baslik, template: `%s | ${MARKA}` },
  description: SITE.aciklama,
  applicationName: MARKA,
  creator: MARKA,
  publisher: MARKA,
  category: "technology",
  // Büyük görsel önizlemesi ve sınırsız alıntı: aramada ve yapay zekâ özetlerinde daha çok yer
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
  verification: {
    ...(google ? { google } : {}),
    ...(yandex ? { yandex } : {}),
    ...(bing ? { other: { "msvalidate.01": bing } } : {}),
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f3ee",
  colorScheme: "light",
};

// Boyamadan önce çalışır: hareket azaltma tercihi yoksa `hareket` sınıfı eklenir (animasyon ön durumları
// yalnız bu sınıfla gizlenir). Hareket altyapısı 6 sn içinde kurulmazsa sınıf kaldırılır, içerik görünür kalır.
const HAREKET_BETIGI = `(function(){var d=document.documentElement;try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('hareket');if(sessionStorage.getItem('fanus-acildi'))d.classList.add('tekrar');setTimeout(function(){if(!window.__fanusHazir)d.classList.remove('hareket')},6000)}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${bricolage.variable}`}
    >
      <head>
        {/* Boyamadan önce çalışmalı: next/script beforeInteractive bunu geciktirir. Geliştirme modunda React
            "script etiketi" uyarısı verir; yalnız geliştirmede görünür, zararsızdır. */}
        <script dangerouslySetInnerHTML={{ __html: HAREKET_BETIGI }} />
      </head>
      <body className="tane">
        {/* İşletme ve site: bütün sayfalarda aynı çekirdek (sayfalar kendi düğümlerini ekler) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@graph": cekirdekVeri() }) }}
        />
        <a href="#icerik" className="atla">
          İçeriğe geç
        </a>
        <PuruzsuzKaydirma />
        <Acilis />
        <IsletmeAdiSaglayici>
          <UstMenu />
          {children}
          <Alt />
        </IsletmeAdiSaglayici>
        <GecisYoneticisi />
        <SayfaEtkileri />
      </body>
    </html>
  );
}
