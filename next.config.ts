import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/** Uploaded blog images (S3). Unset until the bucket is configured. */
const imageBase = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ? new URL(process.env.NEXT_PUBLIC_IMAGE_BASE_URL) : null;

const SITE_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

// The admin has no third-party scripts, so it gets a strict CSP. Next's
// hydration needs inline scripts ('unsafe-inline'); dev also needs eval + HMR.
const ADMIN_CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${imageBase ? ` ${imageBase.origin}` : ""}`,
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const ADMIN_HEADERS = [
  { key: "Content-Security-Policy", value: ADMIN_CSP },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
  { key: "Cache-Control", value: "no-store" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: imageBase
      ? [{ protocol: "https", hostname: imageBase.hostname, pathname: "/blog/**" }]
      : [],
  },
  experimental: {
    serverActions: {
      // Image uploads go through a Server Action; Vercel caps bodies at 4.5 MB
      // and processImage() enforces 4 MB for the file itself.
      bodySizeLimit: "4.5mb",
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: SITE_HEADERS },
      { source: "/admin/:path*", headers: ADMIN_HEADERS },
      { source: "/admin", headers: ADMIN_HEADERS },
    ];
  },
};

export default nextConfig;
