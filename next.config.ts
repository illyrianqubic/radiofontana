import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'next-sanity'],
  },
  images: {
    unoptimized: true,
  },
  // next-sanity and the Sanity Studio use some packages that need transpilation
  transpilePackages: ['next-sanity'],
};

export default nextConfig;
