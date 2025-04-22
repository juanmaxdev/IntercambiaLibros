"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import CarouselDoble from "@/components/carousel/carouselDouble"
import CarouselSimple, { CarouselNuevosLibros } from "@/components/carousel/carouselSimple"
import Opiniones from "@/components/opiniones/opiniones"
import QuoteCarousel from "@/components/home/quote-carousel"
import FeaturedCategories from "@/components/home/featured-categories"
import WhyChooseUs from "@/components/home/why-choose-us"
import "@/app/styles/home.css"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { data: session } = useSession()
  const isAuthenticated = !!session
  const searchParams = useSearchParams()
  const showLogin = searchParams.get("login") === "true"

  useEffect(() => {
    // Añadir clase home-page al body solo en esta página
    document.body.classList.add("home-page")
    setIsLoaded(true)

    // Mostrar modal de login solo si se solicita Y el usuario NO está autenticado
    if (showLogin && !isAuthenticated && typeof window !== "undefined") {
      // Pequeño retraso para asegurar que el DOM está listo
      setTimeout(() => {
        const modalElement = document.getElementById("modalIniciarSesion")
        if (modalElement && window.bootstrap) {
          const bsModal = new window.bootstrap.Modal(modalElement)
          bsModal.show()
        }
      }, 300)
    }

    // Limpiar al desmontar
    return () => {
      document.body.classList.remove("home-page")
    }
  }, [showLogin, isAuthenticated])

  return (
    <>
      <main className="container-fluid p-0">
        {/* Hero Section con efecto de degradado */}
        <section className="hero-section position-relative overflow-hidden">
          <div className="parallax-bg"></div>
          <div className="hero-content container position-relative z-1 py-5">
            <div className="row align-items-center min-vh-75">
              <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
                <h1 className={`display-4 fw-bold mb-4 text-white hero-title ${isLoaded ? "animate-in" : ""}`}>
                  Descubre historias, comparte experiencias
                </h1>
                <p className={`lead text-white-75 mb-4 hero-subtitle ${isLoaded ? "animate-in" : ""}`}>
                  Intercambia libros con personas que comparten tu pasión por la lectura. Una comunidad donde cada libro
                  encuentra un nuevo hogar.
                </p>
                <div
                  className={`d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start hero-buttons ${isLoaded ? "animate-in" : ""}`}
                >
                  <Link href="/libros/generos" className="btn btn-primary px-4 py-2 rounded-pill">
                    Explorar libros
                  </Link>
                  <Link href="/libros/donaciones" className="btn btn-outline-light px-4 py-2 rounded-pill">
                    Donaciones
                  </Link>
                </div>
              </div>
              <div className="col-lg-6 position-relative book-stack-container">
                <div className={`book-stack ${isLoaded ? "animate-in" : ""}`}>
                  <Image
                    src="/assets/img/index/pila_de_libros.png"
                    alt="Pila de libros"
                    width={400}
                    height={400}
                    className="img-fluid floating"
                    priority
                  />
                  <div className="book-quote">
                    <QuoteCarousel />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Reemplazo del divisor de onda con un degradado suave */}
          <div className="gradient-divider"></div>
        </section>

        {/* Sección de categorías destacadas */}
        <FeaturedCategories />

        {/* Carruseles existentes */}
        <CarouselSimple />
        <CarouselNuevosLibros />
        <CarouselDoble />

        {/* Sección "Por qué elegirnos" */}
        <WhyChooseUs />

        {/* Sección de testimonios */}
        <Opiniones />

        {/* Call to Action con efecto mejorado */}
        <section className="cta-section text-center py-5">
          <div className="container">
            <div className="cta-content p-5 rounded-4">
              <h2 className="mb-3">¿Listo para compartir tus libros?</h2>
              <p className="lead mb-4">Únete a nuestra comunidad y comienza a intercambiar historias hoy mismo.</p>
              <div className="d-flex justify-content-center gap-3">
                {isAuthenticated ? (
                  <Link href="/subirLibro" className="btn btn-light px-4 py-2">
                    Subir un libro
                  </Link>
                ) : (
                  <button className="btn btn-light px-4 py-2" data-bs-toggle="modal" data-bs-target="#modalRegistro">
                    Crear cuenta
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
