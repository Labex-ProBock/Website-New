import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@react-three/drei"],
  },
  // Brands Labex no longer stocks were removed from content/brands.ts; their old
  // /brands/<slug> detail pages would 404, so send those links to the catalogue.
  async redirects() {
    return ["ohaus", "miele", "salvis"].map((slug) => ({
      source: `/brands/${slug}`,
      destination: "/products",
      permanent: true,
    }));
  },
};

export default nextConfig;
