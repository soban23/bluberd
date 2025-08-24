import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['ecpwdbjgvnlmvcbwburq.supabase.co'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};