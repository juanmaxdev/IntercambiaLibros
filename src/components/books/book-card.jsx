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
    if (book && book.id) {
      router.push(`/views/books/bookId/${book.id}`)
    } else {
      alert("No se puede mostrar la información del libro porque no tiene un ID válido.")
    }
  }

  return (
    <div
      className="card h-100 shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ borderRadius: "8px", overflow: "hidden" }}
    >
      <div
        className="position-relative overflow-hidden d-flex justify-content-center align-items-center"
        style={{
          height: "300px",
          transition: "all 0.3s ease",
        }}
      >
        {imageError || !book.imagenes ? (
          <div className="text-center p-3">
            <div className="mb-2" style={{ fontSize: "3rem" }}>
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
            style={{
              objectFit: "contain",
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
