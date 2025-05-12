import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {  
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rybwefx6jybsfaoy.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pency-images.nyc3.digitaloceanspaces.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
