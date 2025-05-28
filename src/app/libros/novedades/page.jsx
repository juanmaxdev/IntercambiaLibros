"use client"
import { useEffect, useState, useRef } from "react"
import BookCard from "@/components/books/book-card"
import GenreSelector from "@/components/books/genre-selector"

export default function NewBooksPage() {
  const [books, setBooks] = useState([])
  const [visibleBooks, setVisibleBooks] = useState([])
  const [page, setPage] = useState(1)
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const loaderRef = useRef(null)
  const booksPerPage = 10
  const filteredBooksRef = useRef([])

  useEffect(() => {
    async function fetchBooks() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/libros")

        if (!response.ok) {
          throw new Error(`Error al obtener los libros: ${response.status}`)
        }

        const data = await response.json()

        const sortedBooks = data.sort((a, b) => {
          const dateA = new Date(a.fecha_subida || "")
          const dateB = new Date(b.fecha_subida || "")
          return dateB - dateA 
        })

        setBooks(sortedBooks)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const filteredBooks =
    selectedGenre === "All"
      ? books
      : books.filter((book) => {
          const bookGenre = book.categoria || book.nombre_genero || ""
          return bookGenre === selectedGenre
        })

  filteredBooksRef.current = filteredBooks

  useEffect(() => {
    setPage(1)
    setVisibleBooks(filteredBooksRef.current.slice(0, booksPerPage))
  }, [selectedGenre, books, booksPerPage])

  useEffect(() => {
    const currentFilteredBooks = filteredBooksRef.current

    if (visibleBooks.length >= currentFilteredBooks.length) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting) {
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
        rootMargin: "100px",
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

  const genres = ["All", ...new Set(books.map((book) => book.categoria || book.nombre_genero).filter(Boolean))]

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Nuevos Libros</h2>
      <p className="text-center mb-4">Descubre las últimas incorporaciones a nuestra biblioteca</p>

      <GenreSelector genres={genres} selectedGenre={selectedGenre} onSelectGenre={setSelectedGenre} />

      {isLoading && visibleBooks.length === 0 ? (
        <div className="text-center my-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando libros...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          No se encontraron libros en esta categoría.
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
                <span className="visually-hidden">Cargando más libros...</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
