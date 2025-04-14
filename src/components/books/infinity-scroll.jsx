"use client"

import { useState, useEffect } from "react"
import BookList from "../book-list"

// Sample fallback data in case the API fails
const FALLBACK_BOOKS = [
  {
    id: 1,
    isbn: "978-84-663-5432-4",
    titulo: "Crónica de una muerte anunciada",
    autor: "Gabriel García Márquez",
    categoria: "Novela",
    imagenes:
      "https://heythjlroyqoqhqbmtlc.supabase.co/storage/v1/object/public/portada-libros/libros/Cronica_de_una_muerte_anunciada.jpg",
  },
  {
    id: 2,
    isbn: "978-84-204-3571-8",
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    categoria: "Novela",
    imagenes:
      "https://heythjlroyqoqhqbmtlc.supabase.co/storage/v1/object/public/portada-libros/libros/Cien_anos_de_soledad.jpg",
  },
]

export default function InfinityScrollBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/proxy-books")

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `API responded with status: ${response.status}`)
        }

        const data = await response.json()

        if (!Array.isArray(data) || data.length === 0) {
          console.warn("API returned empty or invalid data, using fallback data")
          setBooks(FALLBACK_BOOKS)
          setUseFallback(true)
        } else {
          setBooks(data)
          setUseFallback(false)
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching books:", err)
        setError(`Error loading books: ${err.message}. Please try again later.`)
        setBooks(FALLBACK_BOOKS)
        setUseFallback(true)
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  return (
    <div className="book-gallery">
      {useFallback && (
        <div className="alert alert-warning" role="alert">
          Usando datos de muestra debido a problemas de conexión con la API. Algunas funciones pueden estar limitadas.
        </div>
      )}

      <h2 className="my-4 text-center">Biblioteca de Libros</h2>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
          <button className="btn btn-outline-danger btn-sm ms-3" onClick={() => window.location.reload()}>
            Volver a intentar
          </button>
        </div>
      ) : (
        <BookList books={books} isLoading={false} />
      )}
    </div>
  )
}
