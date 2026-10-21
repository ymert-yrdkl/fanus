import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import Acilis from "@/bilesenler/Acilis";
import Alt from "@/bilesenler/Alt";
import { IsletmeAdiSaglayici } from "@/bilesenler/IsletmeAdi";
import UstMenu from "@/bilesenler/UstMenu";
import GecisYoneticisi from "@/hareket/GecisYoneticisi";
import PuruzsuzKaydirma from "@/hareket/PuruzsuzKaydirma";
import SayfaEtkileri from "@/hareket/SayfaEtkileri";
import TemaSecici from "@/bilesenler/TemaSecici";
import { TEMA_SECICI_ACIK, TEMALAR, VARSAYILAN_TEMA } from "@/site/tema";
import { SITE } from "@/site/ayarlar";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin", "latin-ext"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"] });
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.adres),
  title: { default: SITE.baslik, template: "%s | fanus.tr" },
  description: SITE.aciklama,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: SITE.alanAdi,
    title: { default: SITE.baslik, template: "%s | fanus.tr" },
    description: SITE.aciklama,
  },
  twitter: { card: "summary_large_image", title: SITE.baslik, description: SITE.aciklama },
};

export const viewport: Viewport = {
  themeColor: "#050d1e",
  colorScheme: "dark",
};

// Boyamadan önce çalışır: hareket azaltma tercihi yoksa `hareket` sınıfı eklenir (animasyon ön durumları
// yalnız bu sınıfla gizlenir). Hareket altyapısı 6 sn içinde kurulmazsa sınıf kaldırılır, içerik görünür kalır.
const HAREKET_BETIGI = `(function(){var d=document.documentElement;try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('hareket');if(sessionStorage.getItem('fanus-acildi'))d.classList.add('tekrar');setTimeout(function(){if(!window.__fanusHazir)d.classList.remove('hareket')},6000)}catch(e){}})();`;

// Palet denemesi: seçici açıkken bu tarayıcıda seçilen palet boyamadan önce uygulanır (?tema= de olur)
const TEMA_BETIGI = TEMA_SECICI_ACIK
  ? `(function(){try{var g=${JSON.stringify(TEMALAR.map((t) => t.kod))};var a=new URLSearchParams(location.search).get('tema');if(g.indexOf(a)>-1)localStorage.setItem('fanus-tema',a);var t=localStorage.getItem('fanus-tema');if(g.indexOf(t)>-1)document.documentElement.dataset.tema=t;}catch(e){}})();`
  : "";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      data-tema={VARSAYILAN_TEMA}
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${bricolage.variable}`}
    >
      <head>
        {/* Boyamadan önce çalışmalı: next/script beforeInteractive bunu geciktirir. Geliştirme modunda React
            "script etiketi" uyarısı verir; yalnız geliştirmede görünür, zararsızdır. */}
        <script dangerouslySetInnerHTML={{ __html: TEMA_BETIGI + HAREKET_BETIGI }} />
      </head>
      <body className="tane">
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
        {TEMA_SECICI_ACIK && <TemaSecici />}
      </body>
    </html>
  );
}
