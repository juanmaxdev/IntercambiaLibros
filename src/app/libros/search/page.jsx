"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import BookCard from "@/components/books/book-card"
import "@/app/styles/search-results.css"

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get("term") || ""

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm) {
        setResults([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Obtener todos los libros
        const response = await fetch("/api/libros", {
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`Error al obtener los libros: ${response.status}`)
        }

        const books = await response.json()

        const searchLower = searchTerm.toLowerCase()
        const filteredBooks = books.filter((book) => {
          return (
            (book.titulo && book.titulo.toLowerCase().includes(searchLower)) ||
            (book.autor && book.autor.toLowerCase().includes(searchLower)) ||
            ((book.categoria || book.nombre_genero) &&
              (book.categoria?.toLowerCase().includes(searchLower) ||
                book.nombre_genero?.toLowerCase().includes(searchLower)))
          )
        })

        setResults(filteredBooks)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [searchTerm])

  return (
    <div className="container py-5">
      <h1 className="search-title">Resultados de búsqueda</h1>
      <p className="search-count">
        {loading ? "Buscando..." : `Se encontraron ${results.length} resultados para "${searchTerm}"`}
      </p>

      {loading ? (
        <div className="loading-container">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="loading-text mt-3">Buscando libros...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <div className="alert alert-danger" role="alert">
            Error al buscar: {error}
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="no-results-container">
          <div className="no-results-icon">
            <i className="bi bi-search"></i>
          </div>
          <h2 className="no-results-title">No se encontraron resultados</h2>
          <p className="no-results-message">
            No hemos encontrado libros que coincidan con "{searchTerm}". Intenta con otros términos o explora nuestras
            categorías.
          </p>
          <a href="/libros/generos" className="btn btn-primary no-results-action">
            Explorar todos los libros
          </a>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4 results-grid">
          {results.map((book) => (
            <div className="col" key={book.id}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
