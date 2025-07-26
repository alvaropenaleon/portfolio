// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Enable gzip/Brotli compression on the Next.js server
  compress: true,

  images: {
    // external hosts:
    domains: [
    ],
    // wildcard fallback:
    // remotePatterns: [
    //   { protocol: 'https', hostname: '**', pathname: '/**' },
    // ],
  },

  // far‑future cache headers
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          // { key: 'ETag', value: '' }
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=60, stale-while-revalidate=300' },
        ],
      },
    ];
  },
};

export default nextConfig;
