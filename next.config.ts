import type { NextConfig } from "next";
import { ALLOWED_IMAGE_HOSTS, ALLOWED_IMAGE_HOST_SUFFIX } from "./src/lib/images/allowed-hosts";

const nextConfig: NextConfig = {
  cacheComponents: true,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      ...ALLOWED_IMAGE_HOSTS.map((hostname) => ({
        protocol: "https" as const,
        hostname,
        pathname: "/**",
      })),
      {
        protocol: "https" as const,
        hostname: `*${ALLOWED_IMAGE_HOST_SUFFIX}`,
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
