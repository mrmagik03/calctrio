import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/salary/:amount/after-tax/:state/:city",
        destination: "/salary/:amount/:state/:city",
        permanent: true,
      },
      {
        source: "/salary/:amount/after-tax/:state",
        destination: "/salary/:amount/:state",
        permanent: true,
      },
      {
        source: "/salary/:amount/after-tax",
        destination: "/salary/:amount",
        permanent: true,
      },
      {
        source: "/loan/:amount(\\d+)",
        destination: "/loan",
        permanent: true,
      },
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
