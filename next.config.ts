import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const SECURITY_HEADERS = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Turbopack/React requires eval() in development for call-stack reconstruction
      isDev ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" : "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    // Nota: o Next.js aplica automaticamente Cache-Control imutavel aos
    // ativos com hash em /_next/static, por isso nao definimos esse header
    // manualmente (evita o warning de build e nao interfere com o dev server).
    return [
      { source: "/(.*)", headers: SECURITY_HEADERS },
    ];
  },
};

export default nextConfig;
