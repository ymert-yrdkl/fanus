"use client";

import dynamic from "next/dynamic";
import type { HizmetKodu } from "@/site/icerik";

/*
  Her canlı örnek ayrı parça: hizmet sayfası yalnız kendi örneğini indirir (önceden beşi birden iniyordu, telefonda
  açılışı yavaşlatıyordu). Sunucuda yine çizilir, yalnız JavaScript'i ayrı gelir.
*/
const EticaretDemo = dynamic(() => import("./EticaretDemo"));
const KurumsalDemo = dynamic(() => import("./KurumsalDemo"));
const MobilDemo = dynamic(() => import("./MobilDemo"));
const OtomasyonDemo = dynamic(() => import("./OtomasyonDemo"));
const QrMenuDemo = dynamic(() => import("./QrMenuDemo"));

/** Hizmetin canlı örneği (QR menü için sunucuda üretilen QR kodu gerekir). */
export default function HizmetDemosu({ kod, qrSvg }: { kod: HizmetKodu; qrSvg: string }) {
  if (kod === "eticaret") return <EticaretDemo />;
  if (kod === "kurumsal") return <KurumsalDemo />;
  if (kod === "otomasyon") return <OtomasyonDemo />;
  if (kod === "mobil") return <MobilDemo />;
  return <QrMenuDemo qrSvg={qrSvg} />;
}
