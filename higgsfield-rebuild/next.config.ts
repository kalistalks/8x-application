import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the Turbopack root to this project so Next doesn't pick up a stray
  // lockfile in a parent directory. See build warning about package-lock.json.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
