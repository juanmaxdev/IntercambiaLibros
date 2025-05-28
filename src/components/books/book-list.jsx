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
  const [genres, setGenres] = useState(["All"])

  useEffect(() => {
    const uniqueGenres = ["All", ...new Set(books.map((book) => book.categoria || book.nombre_genero).filter(Boolean))]
    setGenres(uniqueGenres)
  }, [books])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const genreParam = params.get("genre")

      if (genreParam && genres.includes(genreParam)) {
        setSelectedGenre(genreParam)
      }
    }
  }, [genres]) 

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
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4 px-4 p-md-0">
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
