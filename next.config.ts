import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // Menggunakan wildcard (*) untuk menangkap lh3, lh4, lh5, dll.
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '*.googleusercontent.com', // Berjaga-jaga jika URL kamu masih menggunakan http biasa
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
