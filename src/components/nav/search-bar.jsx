"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import "@/app/styles/search-bar.css"

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [noResults, setNoResults] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const searchContainerRef = useRef(null)
  const router = useRouter()

  // Manejar cambios en el término de búsqueda
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    if (value.length > 2) {
      setIsSearching(true)
      setNoResults(false)
      performSearch(value)
    } else {
      setSearchResults([])
      setShowResults(false)
      setNoResults(false)
    }
  }

  // Realizar la búsqueda
  const performSearch = async (term) => {
    try {
      // Obtener todos los libros
      const response = await fetch("/api/libros", {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Error al obtener los libros: ${response.status}`)
      }

      const books = await response.json()

      // Filtrar los libros según el término de búsqueda
      const searchLower = term.toLowerCase()
      const filteredBooks = books.filter((book) => {
        return (
          (book.titulo && book.titulo.toLowerCase().includes(searchLower)) ||
          (book.autor && book.autor.toLowerCase().includes(searchLower)) ||
          ((book.categoria || book.nombre_genero) &&
            (book.categoria?.toLowerCase().includes(searchLower) ||
              book.nombre_genero?.toLowerCase().includes(searchLower)))
        )
      })

      // Limitar a 5 resultados para la vista previa
      setSearchResults(filteredBooks.slice(0, 5))
      setShowResults(filteredBooks.length > 0)
      setNoResults(filteredBooks.length === 0 && term.length > 2)
      setIsSearching(false)
    } catch (error) {
      console.error("Error al buscar:", error)
      setIsSearching(false)
      setNoResults(true)
    }
  }

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (searchTerm.trim().length > 2) {
      setIsSearching(true)

      try {
        // Realizar búsqueda para verificar si hay resultados
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

        if (filteredBooks.length > 0) {
          // Si hay resultados, redirigir a la página de resultados
          router.push(`/libros/generos/search?term=${encodeURIComponent(searchTerm)}`)
        } else {
          // Si no hay resultados, mostrar notificación
          setShowNotification(true)
          setTimeout(() => {
            setShowNotification(false)
          }, 3000)
        }
      } catch (error) {
        console.error("Error al buscar:", error)
        setShowNotification(true)
        setTimeout(() => {
          setShowNotification(false)
        }, 3000)
      } finally {
        setIsSearching(false)
        setShowResults(false)
      }
    }
  }

  // Cerrar los resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="search-container" ref={searchContainerRef}>
      <form className="search-form" role="search" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="search"
            className="form-control search-input"
            placeholder="Buscar libros..."
            aria-label="Buscar"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="btn search-button" type="submit">
            {isSearching ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <Image src="/assets/icons/search.svg" alt="Buscar" width={20} height={20} />
            )}
          </button>
        </div>
      </form>

      {/* Resultados de búsqueda */}
      {showResults && (
        <div className="search-results-dropdown">
          <div className="search-results-container">
            {searchResults.map((book) => (
              <Link
                href={`/libros/${book.id}`}
                key={book.id}
                className="search-result-item"
                onClick={() => setShowResults(false)}
              >
                <div className="search-result-image">
                  {book.imagenes ? (
                    <Image
                      src={book.imagenes || "/placeholder.svg"}
                      alt={book.titulo}
                      width={40}
                      height={60}
                      className="rounded"
                    />
                  ) : (
                    <div className="placeholder-image">
                      <i className="bi bi-book"></i>
                    </div>
                  )}
                </div>
                <div className="search-result-info">
                  <h6 className="search-result-title">{book.titulo}</h6>
                  <p className="search-result-author">{book.autor}</p>
                </div>
              </Link>
            ))}
            <div className="search-view-all">
              <button
                className="btn btn-link w-100"
                onClick={(e) => {
                  e.preventDefault()
                  router.push(`/libros/generos/search?term=${encodeURIComponent(searchTerm)}`)
                  setShowResults(false)
                }}
              >
                Ver todos los resultados
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de no resultados */}
      {noResults && (
        <div className="search-results-dropdown">
          <div className="search-results-container">
            <div className="no-results-message">
              <i className="bi bi-search me-2"></i>
              No se encontraron resultados para "{searchTerm}"
            </div>
          </div>
        </div>
      )}

      {/* Notificación de búsqueda sin resultados */}
      {showNotification && (
        <div className="search-notification">
          <div className="search-notification-content">
            <i className="bi bi-exclamation-circle me-2"></i>
            No se encontraron resultados para "{searchTerm}"
          </div>
        </div>
      )}
    </div>
  )
}
