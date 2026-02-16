import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve("."),
  },
  experimental: {
    optimizePackageImports: ["motion", "lucide-react", "radix-ui"],
  },
};

export default nextConfig;
