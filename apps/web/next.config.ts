import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  output: "export",
  transpilePackages: ["@visifold/ui", "@visifold/visualization"],
};

export default nextConfig;
