import type { NextConfig } from "next";

// Asıl adres (kanonik). Diğer bilinen alan adları buraya kalıcı (301) yönlenir; böylece Google tek adres görür.
// Asıl adres, Coolify'daki NEXT_PUBLIC_SITE_ADRESI'nden gelir: DNS hazır olmadan fanussoft.com'a çevrilmemeli.
const ASIL_ADRES = process.env.NEXT_PUBLIC_SITE_ADRESI ?? "https://fanussoft.com";
const ASIL_HOST = new URL(ASIL_ADRES).host;
const BILINEN_HOSTLAR = [
  "fanussoft.com",
  "www.fanussoft.com",
  "fanussoft.com.tr",
  "www.fanussoft.com.tr",
  "fanustr.ahmcloud.com",
  "www.fanustr.ahmcloud.com",
];
const YONLENECEK_HOSTLAR = BILINEN_HOSTLAR.filter((h) => h !== ASIL_HOST);

const nextConfig: NextConfig = {
  // Coolify için tek klasörlük Node sunucusu (Dockerfile)
  output: "standalone",
  poweredByHeader: false,
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return YONLENECEK_HOSTLAR.map((host) => ({
      source: "/:yol*",
      has: [{ type: "host" as const, value: host }],
      destination: `${ASIL_ADRES}/:yol*`,
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: "/:yol*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
