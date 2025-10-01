import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
    serverComponentsExternalPackages: ["chrome-aws-lambda", "puppeteer-core"],
  },
};

export default nextConfig;
