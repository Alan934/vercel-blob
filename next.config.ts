import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{  
    remotePatterns:[
      {
        protocol: "https",
        hostname: ".vercel-storage.com",//r3hmpzqpd69hxuq9.public.blob
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
