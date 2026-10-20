import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import PuruzsuzKaydirma from "@/hareket/PuruzsuzKaydirma";
import { SITE } from "@/site/ayarlar";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin", "latin-ext"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"] });
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "wdth"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.adres),
  title: SITE.baslik,
  description: SITE.aciklama,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: SITE.alanAdi,
    title: SITE.baslik,
    description: SITE.aciklama,
  },
  twitter: { card: "summary_large_image", title: SITE.baslik, description: SITE.aciklama },
};

export const viewport: Viewport = {
  themeColor: "#0d0c0b",
  colorScheme: "dark",
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
        <script dangerouslySetInnerHTML={{ __html: HAREKET_BETIGI }} />
      </head>
      <body className="tane">
        <a href="#icerik" className="atla">
          İçeriğe geç
        </a>
        <PuruzsuzKaydirma />
        {children}
      </body>
    </html>
  );
}
