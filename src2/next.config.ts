
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@react-email/render'],
  },
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NODE_ENV === 'development'
      ? 'http://localhost:9002'
      : 'https://<your-production-url>.com', // Replace with your actual production URL
  },
};

export default nextConfig;
