"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function BookCard({ book }) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const router = useRouter()

  const handleImageError = () => {
    setImageError(true)
  }

  const handleMoreInfo = () => {
    const bookId = book.libro_id || book.id

    if (bookId) {
      router.push(`/libros/${bookId}`)
    } else {
      alert("No se puede mostrar la información del libro porque no tiene un ID válido.")
    }
  }
  const isDonation = book.donacion === true || book.tipoIntercambio === "2"

  return (
    <div
      className="card shadow-sm position-relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ borderRadius: "8px", overflow: "hidden", height: "90%" }}
    >
      {/* Etiqueta de donación */}
      {isDonation && (
        <div
          className="position-absolute badge bg-success"
          style={{
            top: "10px",
            right: "10px",
            zIndex: 10,
            padding: "5px 10px",
            fontSize: "0.8rem",
            fontWeight: "bold",
            borderRadius: "4px",
          }}
        >
          Donación
        </div>
      )}

      <div
        className="position-relative overflow-hidden d-flex justify-content-center align-items-center"
        style={{
          height: "350px",
          transition: "all 0.3s ease",
        }}
      >
        {imageError || !book.imagenes ? (
          <div className="text-center p-3">
            <div className="mb-2" style={{ fontSize: "4rem" }}>
              📚
            </div>
            <span className="text-muted">Imagen no disponible</span>
          </div>
        ) : (
          <Image
            src={book.imagenes || "/placeholder.svg"}
            className="rounded"
            alt={book.titulo || "Portada del libro"}
            onError={handleImageError}
            fill
            sizes="(min-width: 768px) 20vw, 50vw"
            priority={true}
            style={{
              objectFit: "fill",
              transition: "transform 0.3s ease",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <h5
          className="card-title fw-semibold"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "48px",
          }}
          title={book.titulo}
        >
          {book.titulo || "Título desconocido"}
        </h5>
        <p className="card-text text-truncate" title={book.autor}>
          {book.autor || "Autor desconocido"}
        </p>
        <button className="btn btn-dark mt-auto" onClick={handleMoreInfo}>
          Más información
        </button>
      </div>
    </div>
  )
}
