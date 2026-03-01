import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ... otras configuraciones si las tienes ... */

  // Agrega este bloque de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc', // Permitimos este dominio
        port: '',
        pathname: '/**',           // Permitimos cualquier ruta dentro del dominio
      },
      // Aquí agregarás tu dominio real de producción en el futuro (ej: aws s3, cloudinary)
    ],
  },
};

export default nextConfig;