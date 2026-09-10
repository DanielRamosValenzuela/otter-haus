import type { NextConfig } from "next";
import { ALLOWED_IMAGE_HOSTS } from "./src/lib/images/allowed-hosts";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Pins the project root explicitly — without this, Turbopack's
  // auto-detection can walk up and find an unrelated package-lock.json
  // outside the repo (e.g. in the user's home directory) and warn about it.
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: ALLOWED_IMAGE_HOSTS.map((hostname) => ({
      protocol: "https" as const,
      hostname,
      pathname: "/**",
    })),
  },
};

export default nextConfig;
