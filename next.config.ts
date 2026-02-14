import { OFFLINE_APP_FAMFIN_URL } from "@/app/lib/url_paths";
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        port: '8080',
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: '8081',
        pathname: "/**"
      }
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      { source: "/:locale" + OFFLINE_APP_FAMFIN_URL, destination: "/:locale/famfin" }
    ];
  },
  // reactStrictMode: false
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
