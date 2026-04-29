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
    // Custom loader rewrites Sanity CDN URLs to width/format/quality variants.
    // Required because `output: 'export'` disables Next's built-in optimizer;
    // without this every <Image> ships the original asset.
    loader: 'custom',
    loaderFile: './src/lib/sanityImageLoader.ts',
  },
  // next-sanity and the Sanity Studio use some packages that need transpilation
  transpilePackages: ['next-sanity'],
};

export default nextConfig;
