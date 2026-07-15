import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'visaplus-be-production.up.railway.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '/**',
      },
    ],
    // Skip Next.js image optimizer so remote images (e.g. flagcdn) load in production
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
};

export default nextConfig;
