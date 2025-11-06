import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Add these two lines for GitHub Pages deployment
  output: 'export',
  basePath: '/<your-repository-name>', // <--- CHANGE THIS

  /* Your existing config options below */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // This is important for static export
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
