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
      {
        source: "/schedule/15",
        destination: "https://cal.com/haroon-bakhsh/15-min-call",
        permanent: false,
      },
      {
        source: "/schedule/30",
        destination: "https://cal.com/haroon-bakhsh/30-min-call-or-coffee",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
