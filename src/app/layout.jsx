import Script from 'next/script';
import '/public/assets/bootstrap/css/bootstrap.min.css';
import Nav from '@/components/nav/navbar';
import Footer from '@/components/footer/footer';
import './styles/globals.css';
import { Providers } from '@/utils/providers';
import "@/app/styles/dropdownNav.css"
import "@/app/styles/donations.css"
import "bootstrap-icons/font/bootstrap-icons.css"


export const metadata = {
  title: 'IntercambiaLibros - Intercambia y Encuentra Libros Gratis',
  description: 'Plataforma gratuita para intercambiar libros con personas de todo el país de forma segura y rápida.',
  keywords: [
    'intercambio de libros',
    'libros gratis',
    'trueque de libros',
    'plataforma de intercambio',
    'IntercambiaLibros',
    'libros usados',
    'comunidad de lectores',
    'donaciones de libros',
    'libros en español',
    'libros de segunda mano',
  ],

  // Controlamos si la pagina deben indexarse o no (crawling)
  robots: {
    index: true,
    follow: true, 
    nocache: true, 
    noimageindex: true, 
  },

  referrer: 'no-referrer-when-downgrade',

  openGraph: {
    title: 'IntercambiaLibros - Nueva vida para tus libros usados',
    description: 'Intercambia tus libros usados con otros lectores de forma segura y gratuita.',
    url: 'https://intercambia-libros.vercel.app/',
    siteName: 'IntercambiaLibros',
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: '/assets/img/index/pila_de_libros.png',
        width: 1200,
        height: 630,
        alt: 'IntercambiaLibros Logo',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@intercambialibros', 
    creator: '@intercambialibros',
    title: 'IntercambiaLibros - Intercambia y Encuentra Libros Gratis',
    description: 'Descubre cómo intercambiar libros de manera fácil y segura.',
    images: ['/assets/images/logo.png'],
  },

  //Seguridad
  other: {
    'Content-Security-Policy': "default-src 'self'; img-src 'self' https:; script-src 'self'; object-src 'none';",
    'X-Frame-Options': 'DENY', 
    'X-Content-Type-Options': 'nosniff', 
    'Referrer-Policy': 'strict-origin-when-cross-origin', 
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  },

  icons: {
    icon: '/assets/favicon/favicon.ico',
    apple: '/assets/favicon/apple-touch-icon.png',
    shortcut: '/assets/favicon/favicon-32x32.png',
  },

  alternates: {
    canonical: 'https://intercambia-libros.vercel.app/',
    languages: {
      es: 'https://intercambia-libros.vercel.app/',
    },
  },

  applicationName: 'IntercambiaLibros',
  generator: 'Next.js 15.1',
  metadataBase: new URL('https://intercambia-libros.vercel.app/'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>
        <Nav />
        <main style={{ paddingTop: '50px' }}>{children}</main>
        <Footer />
        </Providers>
        <Script src="/assets/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
