"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ModernSidebar from "@/components/perfil/sideBar";
import "@/app/styles/books/mis-libros.css";

export default function MisLibrosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [libros, setLibros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("favoritos");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/?login=true");
    }
  }, [status, router]);

  const handleEliminarFavorito = async (libroId) => {
    try {
      const res = await fetch("/api/libros/favoritos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_libro: libroId }),
      });

      if (!res.ok) throw new Error("Error al eliminar favorito");

      setLibros((prev) => prev.filter((libro) => libro.id !== libroId));
    } catch (err) {
      console.error("Error al eliminar favorito:", err);
    }
  };

  const handleEliminarSubido = async (libroId) => {
    try {
      const res = await fetch(`/api/libros/${libroId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar libro subido");

      setLibros((prev) => prev.filter((libro) => libro.id !== libroId));
    } catch (err) {
      console.error("Error al eliminar libro subido:", err);
    }
  };

  useEffect(() => {
    const fetchLibros = async () => {
      setIsLoading(true);
      try {
        if (session?.user?.email) {
          let endpoint = "";

          if (activeTab === "favoritos") {
            endpoint = "/api/libros/favoritos";
          } else if (activeTab === "subidos") {
            endpoint = "/api/libros/usuario";
          } else if (activeTab === "intercambios") {
            endpoint = "/api/libros/intercambios";
          }

          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              correo_electronico: session.user.email,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setLibros(data);
          } else {
            console.error("Error al obtener los libros:", await response.text());
          }
        }
      } catch (error) {
        console.error("Error del servidor:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchLibros();
    }
  }, [status, session, activeTab]);

  const filteredLibros = libros.filter(
    (libro) =>
      libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      libro.autor.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    );
  }

  return (
    <div className="mis-libros-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 col-xl-2 px-0">
            <ModernSidebar activeItem="misLibros" />
          </div>

          <div className="col-lg-9 col-xl-10 py-4 px-4">
            <div className="content-wrapper">
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

              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === "favoritos" ? "active" : ""}`} onClick={() => setActiveTab("favoritos")}> <i className="bi bi-heart me-2"></i>Favoritos </button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === "subidos" ? "active" : ""}`} onClick={() => setActiveTab("subidos")}> <i className="bi bi-upload me-2"></i>Subidos </button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === "intercambios" ? "active" : ""}`} onClick={() => setActiveTab("intercambios")}> <i className="bi bi-arrow-left-right me-2"></i>Intercambios </button>
                  </li>
                </ul>

                <div className="search-container--inside">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-search"></i>
                    </span>
                    <input type="text" className="form-control border-start-0" placeholder="Buscar en mis libros..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                </div>
              </div>

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
                    {searchTerm ? `No hay resultados para "${searchTerm}". Intenta con otra búsqueda.` : activeTab === "favoritos" ? "Aún no tienes libros marcados como favoritos." : activeTab === "subidos" ? "Aún no has subido ningún libro." : "Aún no has realizado ningún intercambio."}
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
                          <Image src={libro.imagenes || "/placeholder.svg?height=300&width=200"} alt={libro.titulo} width={150} height={225} className="img-fluid rounded" />
                          <div className="book-actions">
                            <button className="action-btn view-btn" title="Ver detalles" onClick={() => router.push(`/libros/${libro.id}`)}>
                              <i className="bi bi-eye"></i>
                            </button>
                            <button
                              className="action-btn remove-btn"
                              title="Eliminar"
                              onClick={() => activeTab === "subidos" ? handleEliminarSubido(libro.id) : handleEliminarFavorito(libro.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                        <div className="book-card-content">
                          <h5 className="book-title">{libro.titulo}</h5>
                          <p className="book-author">{libro.autor}</p>
                          <div className="book-meta">
                            <span className="book-genre">{libro.genero}</span>
                            <span className="book-date">{new Date(libro.fecha_subida).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" })}</span>
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
  );
}