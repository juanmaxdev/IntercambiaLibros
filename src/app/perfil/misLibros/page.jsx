"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import ModernSidebar from "@/components/perfil/sideBar"
import "@/app/styles/books/mis-libros.css"

export default function MisLibrosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [libros, setLibros] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("favoritos")
  const [searchTerm, setSearchTerm] = useState("")

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/?login=true")
    }
  }, [status, router])

  // Cargar libros (simulado por ahora)
  useEffect(() => {
    // Simulación de carga de datos
    const fetchLibros = async () => {
      setIsLoading(true)
      try {
        // En el futuro, esto se reemplazará con una llamada API real
        // const response = await fetch(`/api/libros/favoritos?usuario_id=${session?.user?.id}`);
        // const data = await response.json();

        // Datos de ejemplo para mostrar la interfaz
        const mockData = [
          {
            id: 1,
            titulo: "Cien años de soledad",
            autor: "Gabriel García Márquez",
            imagenes: "/assets/img/libro1.jpg",
            genero: "Novela",
            fecha_agregado: "2023-12-15",
          },
          {
            id: 2,
            titulo: "El principito",
            autor: "Antoine de Saint-Exupéry",
            imagenes: "/assets/img/libro2.jpg",
            genero: "Infantil",
            fecha_agregado: "2023-11-20",
          },
          {
            id: 3,
            titulo: "1984",
            autor: "George Orwell",
            imagenes: "/assets/img/libro3.jpg",
            genero: "Ciencia Ficción",
            fecha_agregado: "2024-01-05",
          },
          {
            id: 4,
            titulo: "Harry Potter y la piedra filosofal",
            autor: "J.K. Rowling",
            imagenes: "/assets/img/libro4.jpg",
            genero: "Fantasía",
            fecha_agregado: "2024-02-10",
          },
          {
            id: 5,
            titulo: "El código Da Vinci",
            autor: "Dan Brown",
            imagenes: "/assets/img/libro5.jpg",
            genero: "Misterio",
            fecha_agregado: "2024-03-01",
          },
          {
            id: 6,
            titulo: "Don Quijote de la Mancha",
            autor: "Miguel de Cervantes",
            imagenes: "/assets/img/libro6.jpg",
            genero: "Clásico",
            fecha_agregado: "2023-10-12",
          },
        ]

        setTimeout(() => {
          setLibros(mockData)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error al cargar los libros:", error)
        setIsLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchLibros()
    }
  }, [status, session])

  // Filtrar libros según la búsqueda
  const filteredLibros = libros.filter(
    (libro) =>
      libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      libro.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      libro.genero.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Si no está autenticado, mostrar mensaje de carga mientras se redirige
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <h4>Verificando sesión...</h4>
          <p>Debes iniciar sesión para ver tus libros.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mis-libros-page">
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar moderna */}
          <div className="col-lg-3 col-xl-2 px-0">
            <ModernSidebar activeItem="misLibros" />
          </div>

          {/* Contenido principal */}
          <div className="col-lg-9 col-xl-10 py-4 px-4">
            <div className="content-wrapper">
              {/* Encabezado */}
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <div>
                  <h2 className="page-title">Mis Libros</h2>
                  <p className="text-muted">Gestiona tu colección personal de libros</p>
                </div>
                <div className="d-flex gap-2">
                  <Link href="/subirLibro" className="btn btn-primary">
                    <i className="bi bi-plus-lg me-2"></i>Añadir libro
                  </Link>
                </div>
              </div>

              {/* Pestañas y búsqueda */}
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "favoritos" ? "active" : ""}`}
                      onClick={() => setActiveTab("favoritos")}
                    >
                      <i className="bi bi-heart me-2"></i>Favoritos
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "subidos" ? "active" : ""}`}
                      onClick={() => setActiveTab("subidos")}
                    >
                      <i className="bi bi-upload me-2"></i>Subidos
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "intercambios" ? "active" : ""}`}
                      onClick={() => setActiveTab("intercambios")}
                    >
                      <i className="bi bi-arrow-left-right me-2"></i>Intercambios
                    </button>
                  </li>
                </ul>

                <div className="search-container--inside">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Buscar en mis libros..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Contenido de libros */}
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-3">Cargando tus libros...</p>
                </div>
              ) : filteredLibros.length === 0 ? (
                <div className="empty-state text-center py-5">
                  <div className="empty-icon mb-3">
                    <i className="bi bi-book"></i>
                  </div>
                  <h3>No se encontraron libros</h3>
                  <p className="text-muted">
                    {searchTerm
                      ? `No hay resultados para "${searchTerm}". Intenta con otra búsqueda.`
                      : activeTab === "favoritos"
                        ? "Aún no has añadido libros a tus favoritos."
                        : activeTab === "subidos"
                          ? "Aún no has subido ningún libro."
                          : "No tienes intercambios activos."}
                  </p>
                  {!searchTerm && (
                    <Link href="/libros/generos" className="btn btn-outline-primary mt-3">
                      Explorar libros
                    </Link>
                  )}
                </div>
              ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
                  {filteredLibros.map((libro) => (
                    <div className="col" key={libro.id}>
                      <div className="book-card">
                        <div className="book-card-image">
                          <Image
                            src={libro.imagenes || "/placeholder.svg?height=300&width=200"}
                            alt={libro.titulo}
                            width={150}
                            height={225}
                            className="img-fluid rounded"
                          />
                          <div className="book-actions">
                            <button className="action-btn view-btn" title="Ver detalles">
                              <i className="bi bi-eye"></i>
                            </button>
                            <button className="action-btn remove-btn" title="Eliminar de favoritos">
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                        <div className="book-card-content">
                          <h5 className="book-title">{libro.titulo}</h5>
                          <p className="book-author">{libro.autor}</p>
                          <div className="book-meta">
                            <span className="book-genre">{libro.genero}</span>
                            <span className="book-date">
                              {new Date(libro.fecha_agregado).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
