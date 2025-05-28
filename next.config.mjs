/** @type {import('next').NextConfig} */

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
  };
  
  export default nextConfig;  