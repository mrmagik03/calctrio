import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/payment",
        destination: "/loan",
        permanent: true,
      },
      {
        source: "/payment/:amount",
        destination: "/loan/:amount",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
