/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Permite subir imágenes de hasta ~8 MB desde el panel de administración.
      // (El límite por defecto de Next.js es solo 1 MB y hacía fallar la subida de fotos.)
      bodySizeLimit: '8mb',
    },
  },
};

export default nextConfig;
