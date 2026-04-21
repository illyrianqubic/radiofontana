import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // next-sanity and the Sanity Studio use some packages that need transpilation
  transpilePackages: ['next-sanity'],
};

export default nextConfig;
