import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import '/public/assets/bootstrap/css/bootstrap.min.css';
import Nav from '@/components/nav/navbar';
import Footer from '@/components/footer/footer';
import './styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  // ✅ Título y descripción principales para buscadores
  title: 'IntercambiaLibros - Intercambia y Encuentra Libros Gratis',
  description: 'Plataforma gratuita para intercambiar libros con personas de todo el país de forma segura y rápida.',

  // ✅ Palabras clave para mejorar el SEO (máximo 10-15)
  keywords: [
    'intercambio de libros',
    'libros gratis',
    'trueque de libros',
    'plataforma de intercambio',
    'IntercambiaLibros',
  ],

  // ✅ Controla si las páginas deben indexarse o no (crawling)
  robots: {
    index: true, // Permite que los motores de búsqueda indexen la página
    follow: true, // Permite seguir los enlaces de la página
    nocache: true, // No guarda en caché contenido sensible
    noimageindex: true, // No indexa imágenes
  },

  // ✅ Protege tu web de redirecciones maliciosas
  referrer: 'no-referrer-when-downgrade',

  // ✅ Open Graph (para compartir en Facebook, LinkedIn, etc.)
  openGraph: {
    title: 'IntercambiaLibros - Encuentra Nuevas Aventuras',
    description: 'Intercambia tus libros usados con otros lectores de forma segura y gratuita.',
    url: 'https://www.intercambialibros.com',
    siteName: 'IntercambiaLibros',
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: '/assets/images/logo.png', // Imagen principal (1200x630 recomendado)
        width: 1200,
        height: 630,
        alt: 'IntercambiaLibros Logo',
      },
    ],
  },

  // ✅ Twitter Card (optimización para compartir en Twitter)
  twitter: {
    card: 'summary_large_image', // Usa una imagen grande
    site: '@intercambialibros', // Tu cuenta de Twitter
    creator: '@intercambialibros', // El autor del contenido
    title: 'IntercambiaLibros - Intercambia y Encuentra Libros Gratis',
    description: 'Descubre cómo intercambiar libros de manera fácil y segura.',
    images: ['/assets/images/logo.png'],
  },

  // ✅ Seguridad adicional
  other: {
    'Content-Security-Policy': "default-src 'self'; img-src 'self' https:; script-src 'self'; object-src 'none';",
    'X-Frame-Options': 'DENY', // Evita que tu sitio se cargue en un iframe
    'X-Content-Type-Options': 'nosniff', // Protege contra ataques MIME-type
    'Referrer-Policy': 'strict-origin-when-cross-origin', // Controla el envío de información en redirecciones
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()', // Desactiva permisos no necesarios
  },

  // ✅ Favicon (iconos del navegador)
  icons: {
    icon: '/assets/favicon/favicon.ico',
    apple: '/assets/favicon/apple-touch-icon.png',
    shortcut: '/assets/favicon/favicon-32x32.png',
  },

  // ✅ Idioma principal de la web
  alternates: {
    canonical: 'https://www.intercambialibros.com',
    languages: {
      es: 'https://www.intercambialibros.com',
    },
  },

  // ✅ Datos estructurados (schema.org para Google)
  applicationName: 'IntercambiaLibros',
  generator: 'Next.js 15.1',
  metadataBase: new URL('https://www.intercambialibros.com'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Nav />
        <main>{children}</main>
        <Footer />
        <Script src="/assets/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
