import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  `connect-src 'self'${isProduction ? "" : " ws: wss:"}`,
  "font-src 'self' data:",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'self' https://www.google.com https://embed.waze.com",
  "img-src 'self' data: blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  ...(isProduction ? ["upgrade-insecure-requests"] : []),
].join("; ");

const globalSecurityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Origin-Agent-Cluster", value: "?1" },
  {
    key: "Permissions-Policy",
    value:
      "accelerometer=(), autoplay=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  ...(isProduction
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains",
        },
      ]
    : []),
] as const;

/**
 * Global Next.js configuration.
 *
 * Keep server secrets out of this file: exported configuration may influence the
 * client build. Feature-specific settings should be documented before adding them.
 */
const nextConfig = {
  async headers() {
    return [
      {
        headers: [...globalSecurityHeaders],
        source: "/:path*",
      },
      {
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, must-revalidate, max-age=0",
          },
          { key: "Expires", value: "0" },
          { key: "Pragma", value: "no-cache" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
        source: "/admin/:path*",
      },
      {
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
        source: "/images/:path*",
      },
      {
        headers: [
          {
            key: "Cache-Control",
            value: isProduction
              ? "public, max-age=86400, stale-while-revalidate=604800"
              : "private, no-cache, no-store, must-revalidate, max-age=0",
          },
        ],
        source: "/logo/:path*",
      },
    ];
  },
  images: {
    deviceSizes: [384, 480, 640, 750, 828, 1080, 1200, 1920, 2048],
    qualities: [60, 75],
  },
  poweredByHeader: false,
  reactStrictMode: true,
} satisfies NextConfig;

export default nextConfig;
