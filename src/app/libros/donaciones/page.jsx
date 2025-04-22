"use client"
import { useEffect, useState, useRef } from "react"
import BookCard from "@/components/books/book-card"
import GenreSelector from "@/components/books/genre-selector"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function DonationsPage() {
  const [books, setBooks] = useState([])
  const [visibleBooks, setVisibleBooks] = useState([])
  const [page, setPage] = useState(1)
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const loaderRef = useRef(null)
  const booksPerPage = 10
  const filteredBooksRef = useRef([])
  const [genres, setGenres] = useState(["All"])
  const [showAnimation, setShowAnimation] = useState(false)
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"
  const router = useRouter()

  // Cargar donaciones desde la API
  useEffect(() => {
    async function fetchDonations() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/libros/donaciones")

        if (!response.ok) {
          throw new Error(`Error al obtener las donaciones: ${response.status}`)
        }

        const data = await response.json()

        // Filtrar donaciones duplicadas basadas en libro_id
        const uniqueDonations = []
        const seenIds = new Set()

        data.forEach((donation) => {
          const idToCheck = donation.libro_id || donation.id
          if (idToCheck && !seenIds.has(idToCheck)) {
            seenIds.add(idToCheck)
            uniqueDonations.push({
              ...donation,
              id: idToCheck, // Asegurar que el campo 'id' exista y sea igual a 'libro_id' o 'id'
              donacion: true, // Marcar explícitamente como donación
            })
          }
        })

        setBooks(uniqueDonations)

        // Extraer géneros únicos
        const uniqueGenres = [
          "All",
          ...new Set(uniqueDonations.map((book) => book.categoria || book.nombre_genero).filter(Boolean)),
        ]
        setGenres(uniqueGenres)
      } catch (err) {
        console.error("Error al cargar las donaciones:", err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDonations()
  }, [])

  // Efecto para la animación
  useEffect(() => {
    setShowAnimation(true)
    const timer = setTimeout(() => {
      setShowAnimation(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  // Filtrar libros por género - Modificar para usar categoría o nombre_genero
  const filteredBooks =
    selectedGenre === "All"
      ? books
      : books.filter((book) => {
          // Usar categoría o nombre_genero, lo que esté disponible
          const bookGenre = book.categoria || book.nombre_genero || ""
          return bookGenre === selectedGenre
        })

  // Actualizar la referencia para evitar bucles infinitos
  filteredBooksRef.current = filteredBooks

  // Este useEffect se ejecuta solo cuando cambia selectedGenre o books
  useEffect(() => {
    // Resetear cuando cambia el filtro de género o los libros
    setPage(1)
    setVisibleBooks(filteredBooksRef.current.slice(0, booksPerPage))
  }, [selectedGenre, books, booksPerPage])

  // Este useEffect maneja la carga infinita
  useEffect(() => {
    // Obtener los libros filtrados de la referencia para evitar dependencias cíclicas
    const currentFilteredBooks = filteredBooksRef.current

    // Solo crear el observer si hay más libros para cargar
    if (visibleBooks.length >= currentFilteredBooks.length) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting) {
          // Cargar más libros cuando el loader esté visible
          const startIndex = page * booksPerPage
          const endIndex = startIndex + booksPerPage

          const newBooks = currentFilteredBooks.slice(startIndex, endIndex)

          if (newBooks.length > 0) {
            setVisibleBooks((prevBooks) => [...prevBooks, ...newBooks])
            setPage((prevPage) => prevPage + 1)
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Añadir margen para detectar antes de llegar al final
      },
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current && observer) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [page, visibleBooks.length, booksPerPage])

  // Función para manejar el clic en el botón de donar
  const handleDonateClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault()
      // Redirigir a la página principal y mostrar el modal desde allí
      router.push("/?login=true")
    }
  }

  return (
    <div className="donations-page">
      {/* Hero section para donaciones */}
      <div className="donation-hero">
        <div className="donation-hero-overlay"></div>
        <div className="container position-relative z-1 py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 text-center text-lg-start mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3 text-white donation-title">
                Dona un libro, <span className="text-success">cambia una vida</span>
              </h1>
              <p className="lead text-white-75 mb-4 donation-subtitle">
                Tus libros pueden tener una segunda vida en manos de alguien que los necesita. Únete a nuestra comunidad
                de donantes y haz la diferencia.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <Link href="/subirLibro" className="btn btn-success px-4 py-2 rounded-pill" onClick={handleDonateClick}>
                  <i className="bi bi-heart-fill me-2"></i> Donar ahora
                </Link>
                <a href="#donation-books" className="btn btn-outline-light px-4 py-2 rounded-pill">
                  Ver donaciones
                </a>
              </div>
            </div>
            <div className="col-lg-6 position-relative">
              <div className={`donation-image-container ${showAnimation ? "animate-pulse" : ""}`}>
                <Image
                  src="/assets/img/donaciones.jpg"
                  alt="Donaciones de libros"
                  width={500}
                  height={400}
                  className="img-fluid rounded-4 shadow-lg"
                />
                <div className="donation-stats">
                  <div className="donation-stat">
                    <span className="donation-stat-number">250+</span>
                    <span className="donation-stat-text">Libros donados</span>
                  </div>
                  <div className="donation-stat">
                    <span className="donation-stat-number">120+</span>
                    <span className="donation-stat-text">Vidas impactadas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="donation-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Beneficios de donar */}
      <div className="container my-5">
        <div className="row g-4 justify-content-center">
          <div className="col-md-4">
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="bi bi-heart-fill"></i>
              </div>
              <h3>Ayuda a otros</h3>
              <p>Tus libros pueden inspirar, educar y entretener a personas que no tienen acceso a ellos.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="bi bi-recycle"></i>
              </div>
              <h3>Sostenibilidad</h3>
              <p>Dar una segunda vida a tus libros contribuye a reducir el consumo y cuidar el medio ambiente.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="bi bi-house-heart"></i>
              </div>
              <h3>Libera espacio</h3>
              <p>Haz sitio en tu biblioteca mientras compartes conocimiento con quien más lo necesita.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de libros donados */}
      <div id="donation-books" className="container py-4">
        <h2 className="mb-4 text-center">Libros disponibles para donación</h2>
        <p className="text-center mb-4">
          Estos libros han sido generosamente donados por nuestra comunidad. ¡Encuentra el tuyo!
        </p>

        <GenreSelector genres={genres} selectedGenre={selectedGenre} onSelectGenre={setSelectedGenre} />

        {isLoading && visibleBooks.length === 0 ? (
          <div className="text-center my-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando donaciones...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="alert alert-info text-center" role="alert">
            No se encontraron donaciones en esta categoría.
          </div>
        ) : (
          <>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
              {visibleBooks.map((book, index) => (
                <div className="col" key={`${book.id}-${index}`}>
                  <BookCard book={book} />
                </div>
              ))}
            </div>

            {visibleBooks.length < filteredBooks.length && (
              <div ref={loaderRef} className="text-center my-4 py-3">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Cargando más donaciones...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sección de testimonios */}
      <div className="donation-testimonials py-5">
        <div className="container">
          <h2 className="text-center mb-5">Lo que dicen nuestros donantes</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="testimonial-card">
                <div className="testimonial-quote">
                  <i className="bi bi-quote"></i>
                </div>
                <p>
                  "Donar mis libros ha sido una experiencia increíble. Saber que alguien más está disfrutando de mis
                  historias favoritas me llena de alegría."
                </p>
                <div className="testimonial-author">
                  <Image
                    src="/assets/img/icono_masculino.png"
                    alt="Donante"
                    width={50}
                    height={50}
                    className="rounded-circle"
                  />
                  <div>
                    <h5>Carlos M.</h5>
                    <p>Donante desde 2023</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="testimonial-card">
                <div className="testimonial-quote">
                  <i className="bi bi-quote"></i>
                </div>
                <p>
                  "He donado más de 20 libros y cada vez me siento mejor. La plataforma hace que sea muy fácil y seguro
                  compartir con otros."
                </p>
                <div className="testimonial-author">
                  <Image
                    src="/assets/img/imagen_femenino.jpg"
                    alt="Donante"
                    width={50}
                    height={50}
                    className="rounded-circle"
                  />
                  <div>
                    <h5>Laura P.</h5>
                    <p>Donante desde 2022</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="testimonial-card">
                <div className="testimonial-quote">
                  <i className="bi bi-quote"></i>
                </div>
                <p>
                  "Como profesor, donar libros me permite extender mi impacto más allá del aula. Es una forma
                  maravillosa de compartir conocimiento."
                </p>
                <div className="testimonial-author">
                  <Image
                    src="/assets/img/icono_masculino2.png"
                    alt="Donante"
                    width={50}
                    height={50}
                    className="rounded-circle"
                  />
                  <div>
                    <h5>Miguel R.</h5>
                    <p>Donante desde 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action final */}
      <div className="donation-cta py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 text-center text-lg-start">
              <h2 className="text-white mb-3">¿Listo para donar?</h2>
              <p className="text-white-75 mb-0">
                Tus libros pueden cambiar vidas. Únete a nuestra comunidad de donantes hoy mismo.
              </p>
            </div>
            <div className="col-lg-4 text-center text-lg-end mt-4 mt-lg-0">
              <Link href="/subirLibro" className="btn btn-light btn-lg px-4" onClick={handleDonateClick}>
                Donar ahora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
