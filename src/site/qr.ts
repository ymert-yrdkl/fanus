import QRCode from "qrcode";

/** Emre Pide'nin gerçek QR menüsü (referans): sitedeki QR kodları buraya gider. */
export const QR_MENU_ADRESI = "https://menu.emrepide.com.tr";

/** Derleme anında SVG olarak üretilir (sunucu bileşenlerinde kullanılır). */
export function qrSvgUret(adres = QR_MENU_ADRESI) {
  return QRCode.toString(adres, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#0d0c0b", light: "#00000000" },
  });
}
