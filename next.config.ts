import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* otras opciones de config */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // hostname: "r3hmpzqpd69hxuq9.public.blob.vercel-storage.com", // Opción específica (si estás seguro)
        hostname: "*.public.blob.vercel-storage.com", // Opción con comodín (recomendada)
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pency-images.nyc3.digitaloceanspaces.com", // Mantenido por si lo usas
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
