/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true, // ✅ Désactive ESLint lors du build
    },
  };
  
  export default nextConfig; // ✅ Utilisation correcte en `.mjs`
  