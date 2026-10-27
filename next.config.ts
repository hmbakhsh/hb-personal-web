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
      {
        source: "/schedule/36-cto-first-interview",
        destination: "https://cal.com/haroon-bakhsh/36-cto-first-interview",
        permanent: false,
      },
      {
        source: "/schedule/36c",
        destination:
          "https://calendar.google.com/calendar/appointments/schedules/AcZssZ25Zl5yONUH44Ynh7ofsDQTgF3fir4_RvVLiMEcyIwPl5Y87I1kSVq4Ky2P8NOwSgHIooiGqUF2",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
