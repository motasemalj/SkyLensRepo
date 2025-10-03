import type { NextConfig } from "next";

// Log environment variables at build time for debugging
console.log('🔍 Next.js Build Config - Environment Variables:');
console.log('   NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || 'NOT SET - using fallback');
console.log('   NEXT_PUBLIC_IMAGE_BASE_URL:', process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'NOT SET - using fallback');

const nextConfig: NextConfig = {
  // Note: Removed 'output: standalone' to use custom server.js
  serverExternalPackages: ['@prisma/client'],
  
  // Explicitly expose these environment variables to the client
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001',
    NEXT_PUBLIC_IMAGE_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'https://res.cloudinary.com/dm2sd9t1n/image/upload',
  },
  images: {
    unoptimized: true,
    domains: ['localhost', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dm2sd9t1n/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
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
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
