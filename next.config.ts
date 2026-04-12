import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/car-payment/:price/:rate/:term",
        destination: "/loan",
        permanent: true,
      },
      {
        source: "/boat-payment/:price/:rate/:term",
        destination: "/loan",
        permanent: true,
      },
      {
        source: "/rv-payment/:price/:rate/:term",
        destination: "/loan",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;