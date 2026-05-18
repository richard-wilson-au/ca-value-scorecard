import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin Turbopack's workspace root to this project so the parent-dir lockfile
  // at C:\Users\richa\package-lock.json doesn't confuse it.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
