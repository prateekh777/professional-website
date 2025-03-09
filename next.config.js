/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'prateek-personal.s3.ap-south-1.amazonaws.com',
      'images.unsplash.com',
      'via.placeholder.com',
      'commondatastorage.googleapis.com',
    ],
    unoptimized: process.env.NODE_ENV !== "production",
  },
  experimental: {
    // This ensures all API routes are treated as dynamic by default
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Remove the output: 'standalone' config to allow dynamic features
};

module.exports = nextConfig;
