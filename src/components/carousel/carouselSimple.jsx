"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import BookCard from "../books/book-card"

export default function CarouselSimple() {
  const [generos, setGeneros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [groupedGeneros, setGroupedGeneros] = useState([])

  useEffect(() => {
    const fetchGeneros = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/generos", {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Error al obtener los géneros: ${response.status}`)
        }

        const data = await response.json()

        setGeneros(data)

        const groups = []
        for (let i = 0; i < data.length; i += 5) {
          groups.push(data.slice(i, i + 5))
        }
        setGroupedGeneros(groups)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchGeneros()
  }, [])

  useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.textContent = `
      .genre-card {
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .genre-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
      }
      .genre-card:hover .genre-image {
        transform: scale(1.05);
      }
    `
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="border-bottom m-4 pb-2">
          <div className="d-flex justify-content-center justify-content-md-start ps-lg-5 ms-lg-5">
            <Link href="/libros/generos" className="text-decoration-none">
              <h4 className="m-0 ps-1">GÉNEROS</h4>
            </Link>
          </div>
        </div>
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando géneros...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="border-bottom m-4 pb-2">
          <div className="d-flex justify-content-center justify-content-md-start ps-lg-5 ms-lg-5">
            <Link href="/libros/generos" className="text-decoration-none">
              <h4 className="m-0 ps-1">GÉNEROS</h4>
            </Link>
          </div>
        </div>
        <div className="alert alert-danger m-4" role="alert">
          Error al cargar los géneros: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div id="carouselSimpleGenero" className="carousel slide" data-bs-ride="carousel" data-bs-interval="7000">
        <div className="border-bottom m-4 pb-2">
          <div className="d-flex justify-content-center justify-content-md-start ps-lg-5 ms-lg-5">
            <Link href="/libros/generos" className="text-decoration-none">
              <h4 className="m-0 ps-1">GÉNEROS</h4>
            </Link>
          </div>
        </div>

        <div className="carousel-inner">
          {groupedGeneros.length > 0 ? (
            groupedGeneros.map((group, groupIndex) => (
              <div
                key={`group-${groupIndex}`}
                className={`carousel-item ${groupIndex === 0 ? "active" : ""}`}
                data-bs-interval="7000"
              >
                <div className="row justify-content-center px-5 p-md-3">
                  {group.map((genero) => (
                    <div key={`genero-${genero.id}`} className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                      <Link
                        href={`/libros/generos?genre=${encodeURIComponent(genero.nombre)}`}
                        className="text-decoration-none"
                      >
                        <div className="card h-100 genre-card">
                          <div className="position-relative overflow-hidden" style={{ height: "380px" }}>
                            <Image
                              src={genero.imagen || "/placeholder.svg?height=300&width=200"}
                              className="card-img-top genre-image"
                              alt={`Imagen de ${genero.nombre}`}
                              fill
                              style={{
                                objectFit: "cover",
                                transition: "transform 0.3s ease",
                              }}
                            />
                          </div>
                          <div className="card-body d-flex flex-column justify-content-center p-0">
                            <div className="btn border-0 w-100 text-center text-nowrap">
                              {genero.nombre.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="carousel-item active">
              <div className="row justify-content-center px-5 p-md-3">
                <div className="col-12 text-center py-5">
                  <p>No hay géneros disponibles</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botones de navegación */}
        {groupedGeneros.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselSimpleGenero"
              data-bs-slide="prev"
              style={{ top: "20%" }}
            >
              <Image src="/assets/icons/Back.gif" alt="atras" width={65} height={65} unoptimized />
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselSimpleGenero"
              data-bs-slide="next"
              style={{ top: "20%" }}
            >
              <Image src="/assets/icons/Forward1.gif" alt="atras" width={50} height={50} unoptimized />
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

{
  /* ---- Carousel de los ultimos Libros ---- */
}

export function CarouselNuevosLibros() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [groupedBooks, setGroupedBooks] = useState([])

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/libros", {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Error al obtener los libros: ${response.status}`)
        }

        const data = await response.json()

        const sortedBooks = data.sort((a, b) => {
          const dateA = new Date(a.fecha_subida)
          const dateB = new Date(b.fecha_subida)
          return dateB - dateA 
        })

        setBooks(sortedBooks)

        const groups = []
        for (let i = 0; i < Math.min(sortedBooks.length, 15); i += 5) {
          groups.push(sortedBooks.slice(i, i + 5))
        }
        setGroupedBooks(groups)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="border-bottom m-4 pt-3 pb-2">
          <div className="d-flex justify-content-center justify-content-md-start ps-lg-5 ms-lg-5">
            <Link href="/libros/novedades" className="text-decoration-none">
              <h4 className="m-0 ps-1">NUEVOS LIBROS</h4>
            </Link>
          </div>
        </div>
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="border-bottom m-4 pt-3 pb-2">
          <div className="d-flex justify-content-center justify-content-md-start ps-lg-5 ms-lg-5">
            <Link href="/libros/novedades" className="text-decoration-none">
              <h4 className="m-0 ps-1">NUEVOS LIBROS</h4>
            </Link>
          </div>
        </div>
        <div className="alert alert-danger m-4" role="alert">
          Error al cargar los libros: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div id="carouselNuevosLibros" className="carousel slide" data-bs-ride="carousel" data-bs-interval="7000">
        <div className="border-bottom m-4 pt-3 pb-2">
          <div className="d-flex justify-content-center justify-content-md-start ps-lg-5 ms-lg-5">
            <Link href="/libros/novedades" className="text-decoration-none">
              <h4 className="m-0 ps-1">NUEVOS LIBROS</h4>
            </Link>
          </div>
        </div>

        <div className="carousel-inner">
          {groupedBooks.length > 0 ? (
            groupedBooks.map((group, groupIndex) => (
              <div
                key={`group-${groupIndex}`}
                className={`carousel-item ${groupIndex === 0 ? "active" : ""}`}
                data-bs-interval="7000"
              >
                <div className="row justify-content-center px-5 p-md-3">
                  {group.map((book, bookIndex) => (
                    <div key={`book-${book.id || bookIndex}`} className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                      <BookCard book={book} />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="carousel-item active">
              <div className="row justify-content-center px-5 p-md-3">
                <div className="col-12 text-center py-5">
                  <p>No hay libros disponibles</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botones de navegación */}
        {groupedBooks.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselNuevosLibros"
              data-bs-slide="prev"
              style={{ top: "20%" }}
            >
              <Image src="/assets/icons/Back.gif" alt="atras" width={65} height={65} unoptimized />
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselNuevosLibros"
              data-bs-slide="next"
              style={{ top: "20%" }}
            >
              <Image src="/assets/icons/Forward1.gif" alt="atras" width={50} height={50} unoptimized />
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
