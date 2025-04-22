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
            {
                protocol: 'https',
                hostname: 'heythjlroyqoqhqbmtlc.supabase.co',
                pathname: '/storage/v1/object/public/portada-libros/generos/**',
            },
            {
                protocol: 'https',
                hostname: 'heythjlroyqoqhqbmtlc.supabase.co',
                pathname: '/storage/v1/object/public/portada-libros/subidas/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '/**',
            },
            
        ],
        
    },
    env: {
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    },
    async rewrites() {
        return [
            {
                source: "/api/proxy-books",
                destination: "https://intercambialibros-omega.vercel.app/api/libros",
            },
            {
                source: "/api/proxy-books/comentarios",
                destination: "https://intercambialibros-omega.vercel.app/api/valoraciones/libros",
            },
            {
                source: "/api/reportes",
                destination: "https://intercambialibros-omega.vercel.app/api/contacto"
            }
        ];
    },
};

export default nextConfig;