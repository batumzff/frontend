/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [], // İhtiyaç olursa harici resim domainlerini buraya ekleyin
  },
  env: {
    // Burada kullanılacak ortam değişkenleri tanımlanabilir
    APP_URL: process.env.APP_URL || 'http://localhost:3000',
    API_URL: process.env.API_URL || 'http://localhost:8000/api',
  },
  // Özel header'lar eklenebilir
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
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
