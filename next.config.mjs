/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.tiktok.com https://*.tiktok.com https://*.ttwstatic.com https://*.neutral.ttwstatic.com https://*.tiktokcdn.com https://*.byteoversea.com https://*.ibytedtos.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://res.cloudinary.com https://*.googleusercontent.com https://*.tiktok.com https://*.tiktokcdn.com https://*.ttwstatic.com https://*.neutral.ttwstatic.com; font-src 'self' data:; connect-src 'self' https://res.cloudinary.com https://*.tiktok.com https://*.tiktokcdn.com https://*.byteoversea.com https://*.ibytedtos.com https://*.ttwstatic.com https://*.neutral.ttwstatic.com; frame-src 'self' https://www.tiktok.com https://*.tiktok.com https://www.google.com https://www.youtube.com; object-src 'none'; base-uri 'self';",
          },
        ],
      },
      {
        source: '/uploads/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
