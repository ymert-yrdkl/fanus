import type { NextConfig } from "next";

// Asıl adres (kanonik). Diğer bilinen alan adları buraya kalıcı (301) yönlenir; böylece Google tek adres görür.
const ASIL_ADRES = process.env.NEXT_PUBLIC_SITE_ADRESI ?? "https://fanus.tr";
const ASIL_HOST = new URL(ASIL_ADRES).host;
const BILINEN_HOSTLAR = ["fanus.tr", "www.fanus.tr", "fanustr.ahmcloud.com", "www.fanustr.ahmcloud.com"];
const YONLENECEK_HOSTLAR = BILINEN_HOSTLAR.filter(
  // Asıl adres fanus.tr değilken fanus.tr'yi yönlendirme (henüz bu sunucuya bağlı olmayabilir)
  (h) => h !== ASIL_HOST && (ASIL_HOST.endsWith("fanus.tr") || !h.endsWith("fanus.tr")),
);

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
