"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import BookCard from "../books/book-card"
import Link from "next/link"

export default function CarouselDoble() {
  const [donaciones, setDonaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [groupedDonaciones, setGroupedDonaciones] = useState([])

  useEffect(() => {
    const fetchDonaciones = async () => {
      try {
        setLoading(true)
        // Usar el endpoint de proxy para donaciones
        const response = await fetch("/api/proxy-books/donaciones", {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Error al obtener las donaciones: ${response.status}`)
        }

        const data = await response.json()

        // Ordenar las donaciones por fecha de subida (más recientes primero)
        const sortedDonaciones = data.sort((a, b) => {
          const dateA = new Date(a.fecha_subida || a.fecha_donacion || "")
          const dateB = new Date(b.fecha_subida || b.fecha_donacion || "")
          return dateB - dateA // Orden descendente (más reciente primero)
        })

        // Filtrar donaciones duplicadas basadas en libro_id
        const uniqueDonaciones = []
        const seenIds = new Set()

        sortedDonaciones.forEach((donacion) => {
          const idToCheck = donacion.libro_id || donacion.id
          if (idToCheck && !seenIds.has(idToCheck)) {
            seenIds.add(idToCheck)
            uniqueDonaciones.push({
              ...donacion,
              id: idToCheck, // Asegurar que el campo 'id' exista y sea igual a 'libro_id' o 'id'
            })
          }
        })

        setDonaciones(uniqueDonaciones)

        // Agrupar las donaciones en grupos de 10 (5 por fila, 2 filas) para el carrusel
        const groups = []
        for (let i = 0; i < Math.min(uniqueDonaciones.length, 30); i += 10) {
          groups.push(uniqueDonaciones.slice(i, i + 10))
        }
        setGroupedDonaciones(groups)
      } catch (err) {
        console.error("Error fetching donations:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDonaciones()
  }, [])

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="border-bottom m-4 pt-3 pb-2">
          <div className="d-flex justify-content-center justify-content-md-start ps-lg-5 ms-lg-5">
            <h4 className="m-0 ps-1">DONACIONES</h4>
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
            <h4 className="m-0 ps-1">DONACIONES</h4>
          </div>
        </div>
        <div className="alert alert-danger m-4" role="alert">
          Error al cargar las donaciones: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div id="carouselDonations" className="carousel slide" data-bs-ride="carousel" data-bs-interval="7000">
        <div className="border-bottom m-4 pt-3 pb-2">
          <div className="d-flex justify-content-center justify-content-md-start ps-lg-5 ms-lg-5">
            <Link href="/views/books/donations" className="text-decoration-none">
              <h4 className="m-0 ps-1">DONACIONES</h4>
            </Link>
          </div>
        </div>

        <div className="carousel-inner">
          {groupedDonaciones.length > 0 ? (
            groupedDonaciones.map((group, groupIndex) => (
              <div
                key={`group-${groupIndex}`}
                className={`carousel-item ${groupIndex === 0 ? "active" : ""}`}
                data-bs-interval="7000"
              >
                {/* Primera fila de 5 libros */}
                <div className="row justify-content-center p-3">
                  {group.slice(0, 5).map((book, bookIndex) => (
                    <div
                      key={`book-row1-${groupIndex}-${bookIndex}`}
                      className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3"
                    >
                      <BookCard book={book} />
                    </div>
                  ))}
                </div>

                {/* Segunda fila de 5 libros (si hay suficientes) */}
                {group.length > 5 && (
                  <div className="row justify-content-center p-3 mt-2">
                    {group.slice(5, 10).map((book, bookIndex) => (
                      <div
                        key={`book-row2-${groupIndex}-${bookIndex}`}
                        className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3"
                      >
                        <BookCard book={book} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="carousel-item active">
              <div className="row justify-content-center p-3">
                <div className="col-12 text-center py-5">
                  <p>No hay donaciones disponibles</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botones de navegación */}
        {groupedDonaciones.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselDonations"
              data-bs-slide="prev"
              style={{ top: "30%" }}
            >
              <Image src="/assets/icons/Back.gif" alt="atras" width={65} height={65} unoptimized />
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselDonations"
              data-bs-slide="next"
              style={{ top: "30%" }}
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
