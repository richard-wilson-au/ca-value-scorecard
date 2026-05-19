import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin Turbopack's workspace root to this project so the parent-dir lockfile
  // at C:\Users\richa\package-lock.json doesn't confuse it.
  turbopack: {
    root: path.join(__dirname),
  },
  // Ship the TP TTF font files inside the /api/pdf serverless function bundle
  // on Vercel. Without this, public/ is served as static assets only and the
  // function's process.cwd()/public/fonts/*.ttf paths don't resolve at
  // runtime. Each glob is relative to the project root.
  outputFileTracingIncludes: {
    "/api/pdf": ["./public/fonts/*.ttf"],
  },
};

export default nextConfig;
