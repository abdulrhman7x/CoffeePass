import type { NextConfig } from "next";

const replitDevDomain = process.env.REPLIT_DEV_DOMAIN;
const allowedDevOrigins = ["127.0.0.1", "localhost", ...(replitDevDomain ? [replitDevDomain] : [])];

const nextConfig: NextConfig = {
  allowedDevOrigins,
};

export default nextConfig;
