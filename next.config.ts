import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: ["admin.swaggold.co", "localhost", "swag.ivadso.com"],
  },
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/favicon.png",
        permanent: true,
      },
    ];
  },
  env: {
    // Provide a fallback for the API base URL during build time
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://swag.ivadso.com",
  },
  // experimental: {
  //   appDir: true,
  // },
};

export default nextConfig;
