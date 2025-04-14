/** @type {import('next').NextConfig} */

// Configuración para optimizar el despliegue en Vercel
const nextConfig = {
    compiler: {
        styledComponents: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'heythjlroyqoqhqbmtlc.supabase.co',
                pathname: '/storage/v1/object/public/portada-libros/libros/**',
            },
        ],
        domains: ['lh3.googleusercontent.com'],
    },
    env: {
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    },
    async rewrites() {
        return [
            {
                source: "/api/libros",
                destination: "https://intercambialibros-omega.vercel.app/api/libros",
            },
        ];
    },
};

export default nextConfig;
