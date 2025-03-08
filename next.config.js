/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
    unoptimized: process.env.NODE_ENV !== "production",
  },
  // Remove the output: 'standalone' config to allow dynamic features
};

module.exports = nextConfig;
