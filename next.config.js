/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Firebase App Hosting compatibility
  output: 'standalone',

  // Optimize for production
  poweredByHeader: false,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Security headers
  async headers() {
    return [
      {
        // don't apply these headers to Next.js static asset routes
        source: '/((?!_next/static|_next/image|_next).*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
