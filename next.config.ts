import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      // {
      //   protocol: "http",
      //   hostname: "localhost",
      //   port: "8000",
      //   pathname: "/storage/**",
      // },
      {
        protocol: "https",
        hostname: "api-business-card.neti.com.ph",
        port: "",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
