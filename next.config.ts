import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "monthlypaymentcalc.co" }],
        destination: "https://calctrio.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.monthlypaymentcalc.co" }],
        destination: "https://calctrio.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "mysalarycalculator.co" }],
        destination: "https://calctrio.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.mysalarycalculator.co" }],
        destination: "https://calctrio.com/:path*",
        permanent: true,
      },
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
