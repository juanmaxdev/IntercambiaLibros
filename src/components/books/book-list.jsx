"use client"

import { useState, useEffect, useRef } from "react"
import BookCard from "./book-card"
import GenreSelector from "./genre-selector"

export default function BookList({ books = [], isLoading }) {
  const [visibleBooks, setVisibleBooks] = useState([])
  const [page, setPage] = useState(1)
  const [selectedGenre, setSelectedGenre] = useState("All")
  const loaderRef = useRef(null)
  const booksPerPage = 10
  const filteredBooksRef = useRef([])

  // Filtrar libros por género
  const filteredBooks = selectedGenre === "All" ? books : books.filter((book) => book.categoria === selectedGenre)

  // Actualizar la referencia para evitar bucles infinitos
  filteredBooksRef.current = filteredBooks

  // Este useEffect se ejecuta solo cuando cambia selectedGenre o books
  useEffect(() => {
    // Resetear cuando cambia el filtro de género o los libros
    setPage(1)
    setVisibleBooks(filteredBooksRef.current.slice(0, booksPerPage))
  }, [selectedGenre, books, booksPerPage]) // No incluir filteredBooks aquí

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
  }, [page, visibleBooks.length, booksPerPage]) // Eliminamos filteredBooks de las dependencias

  // Extraer géneros únicos de los libros
  const genres = ["All", ...new Set(books.map((book) => book.categoria).filter(Boolean))]

  return (
    <div className="book-list">
      <GenreSelector genres={genres} selectedGenre={selectedGenre} onSelectGenre={setSelectedGenre} />

      {isLoading ? (
        <div className="text-center my-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando libros...</span>
          </div>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          Libros de este género no encontrados.
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
