import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/schedule",
        destination: "https://cal.com/haroon-bakhsh",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
