import type { NextConfig } from "next";

const nextConfig = {
  output: 'standalone', // <--- This is the key line
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
};
module.exports = nextConfig;
