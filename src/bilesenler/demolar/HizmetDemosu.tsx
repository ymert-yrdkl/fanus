"use client";

import type { HizmetKodu } from "@/site/icerik";
import EticaretDemo from "./EticaretDemo";
import KurumsalDemo from "./KurumsalDemo";
import MobilDemo from "./MobilDemo";
import OtomasyonDemo from "./OtomasyonDemo";
import QrMenuDemo from "./QrMenuDemo";

/** Hizmetin canlı örneği (QR menü için sunucuda üretilen QR kodu gerekir). */
export default function HizmetDemosu({ kod, qrSvg }: { kod: HizmetKodu; qrSvg: string }) {
  if (kod === "eticaret") return <EticaretDemo />;
  if (kod === "kurumsal") return <KurumsalDemo />;
  if (kod === "otomasyon") return <OtomasyonDemo />;
  if (kod === "mobil") return <MobilDemo />;
  return <QrMenuDemo qrSvg={qrSvg} />;
}
