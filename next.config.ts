import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A 404 for URLs that match no route at all (the root layout lives under
  // [lang], so there is no single layout to build one from).
  experimental: { globalNotFound: true },
};

export default nextConfig;
