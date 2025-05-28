'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ModernSidebar from '@/components/perfil/sideBar';
import '@/app/styles/books/mis-libros.css';

export default function MisLibrosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [libros, setLibros] = useState([]);
  const [intercambios, setIntercambios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('favoritos');
  const [searchTerm, setSearchTerm] = useState('');

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/?login=true');
    }
  }, [status, router]);

  // Fetch dinámico según pestaña activa
  useEffect(() => {
    const fetchDatos = async () => {
      setIsLoading(true);
      try {
        if (!session?.user?.email) return;
        let endpoint = '';

        if (activeTab === 'favoritos') {
          endpoint = '/api/libros/favoritos';
        } else if (activeTab === 'subidos') {
          endpoint = '/api/libros/usuario';
        } else if (activeTab === 'intercambios') {
          endpoint = '/api/libros/intercambios';
        }

        const res = await fetch(endpoint, {
          method: 'GET',
          headers: { correo_electronico: session.user.email },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error en fetch');

        if (activeTab === 'intercambios') {
          setIntercambios(data);
        } else {
          setLibros(data);
        }
      } catch (err) {
        if (activeTab === 'intercambios') setIntercambios([]);
        else setLibros([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchDatos();
    }
  }, [status, session, activeTab]);

  // Filtrado para libros (favoritos/subidos)
  const filteredLibros = libros.filter((libro) => {
    const titulo = libro.titulo?.toLowerCase() || '';
    const autor = libro.autor?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
    return titulo.includes(term) || autor.includes(term);
  });

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
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
              {/* Header y acciones */}
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <div>
                  <h2 className="page-title">Mis Libros</h2>
                  <p className="text-muted">Gestiona tu colección personal de libros</p>
                </div>
                <Link href="/subirLibro" className="btn btn-primary">
                  <i className="bi bi-plus-lg me-2" /> Añadir libro
                </Link>
              </div>

              {/* Pestañas y búsqueda */}
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <ul className="nav nav-tabs">
                  {['favoritos', 'subidos', 'intercambios'].map((tab) => (
                    <li className="nav-item" key={tab}>
                      <button
                        className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab === 'favoritos' ? (
                          <>
                            <i className="bi bi-heart me-2" />
                            Favoritos
                          </>
                        ) : tab === 'subidos' ? (
                          <>
                            <i className="bi bi-upload me-2" />
                            Subidos
                          </>
                        ) : (
                          <>
                            <i className="bi bi-arrow-left-right me-2" />
                            Intercambios
                          </>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="search-container--inside ">
                  <div className="input-group ps-3 ps-md-0">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-search" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Contenido según pestaña */}
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-3">Cargando datos...</p>
                </div>
              ) : activeTab === 'intercambios' ? (
                intercambios.length === 0 ? (
                  <div className="empty-state text-center py-5">
                    <i className="bi bi-arrow-left-right mb-3 fs-1" />
                    <h3>No hay intercambios</h3>
                    <p className="text-muted">Aún no has realizado ningún intercambio.</p>
                  </div>
                ) : (
                  <div className="row row-cols-1 row-cols-md-2 g-4">
                    {intercambios.map((ix) => (
                      <div className="col" key={ix.id}>
                        <div className="card intercambio-card h-100">
                          <div className="card-body d-flex flex-column">
                            <div className="d-flex justify-content-between mb-2">
                              <small className="text-muted">
                                {new Date(ix.fecha_intercambio).toLocaleDateString('es-ES')}
                              </small>
                              <span
                                className={
                                  ix.estado === 'completado'
                                    ? 'badge bg-success'
                                    : ix.estado === 'pendiente' || ix.estado === 'pendiente_entrega'
                                    ? 'badge bg-warning text-dark'
                                    : ix.estado === 'rechazado'
                                    ? 'badge bg-danger'
                                    : 'badge bg-secondary'
                                }
                              >
                                {ix.estado === 'pendiente_entrega'
                                  ? 'PENDIENTE DE ENTREGA'
                                  : ix.estado === 'pendiente'
                                  ? 'PENDIENTE DE RESPUESTA'
                                  : ix.estado === 'completado'
                                  ? 'COMPLETADO'
                                  : ix.estado === 'rechazado'
                                  ? 'RECHAZADO'
                                  : ix.estado.toUpperCase()}
                              </span>
                            </div>
                            <div className="d-flex align-items-start justify-content-evenly flex-grow-1 mt-3">
                              <div className="text-center">
                                <Image
                                  src={ix.libro_ofrece.imagenes || '/placeholder.svg'}
                                  alt={ix.libro_ofrece.titulo}
                                  width={120}
                                  height={180}
                                  className="rounded mb-1"
                                />
                                <small className="d-block" style={{ maxWidth: 120 }}>
                                  {ix.libro_ofrece.titulo}
                                </small>
                              </div>
                              <div className="align-self-center">
                                <i className="bi bi-arrow-right-left fs-3" />
                              </div>
                              <div className="text-center">
                                <Image
                                  src={ix.libro_recibe.imagenes || '/placeholder.svg'}
                                  alt={ix.libro_recibe.titulo}
                                  width={120}
                                  height={180}
                                  className="rounded mb-1"
                                />
                                <small className="d-block " style={{ maxWidth: 120 }}>
                                  {ix.libro_recibe.titulo}
                                </small>
                              </div>
                            </div>
                            <div className="mt-3 small text-end">
                              De <strong>{ix.usuario_ofrece.nombre_usuario}</strong>
                              <br />
                              Para <strong>{ix.usuario_recibe.nombre_usuario}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : filteredLibros.length === 0 ? (
                <div className="empty-state text-center py-5">
                  <i className="bi bi-book mb-3 fs-1" />
                  <h3>No se encontraron libros</h3>
                  <p className="text-muted">
                    {searchTerm
                      ? `No hay resultados para "${searchTerm}".`
                      : activeTab === 'favoritos'
                      ? 'Aún no tienes favoritos.'
                      : 'Aún no has subido libros.'}
                  </p>
                </div>
              ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
                  {filteredLibros.map((libro) => (
                    <div className="col d-flex justify-content-center" key={libro.id}>
                      <div className="book-card" style={{ width: 280 }}>
                        <div className="book-card-image position-relative overflow-hidden" style={{ height: 300 }}>
                          <Image
                            src={libro.imagenes || '/placeholder.svg?height=300&width=200'}
                            alt={libro.titulo}
                            fill
                            style={{ objectFit: 'fill' }}
                            className="rounded-top"
                          />
                          <div className="book-actions">
                            <button
                              className="action-btn view-btn"
                              title="Ver detalles"
                              onClick={() => router.push(`/libros/${libro.id}`)}
                            >
                              <i className="bi bi-eye" />
                            </button>
                            <button
                              className="action-btn remove-btn"
                              title="Eliminar"
                              onClick={() =>
                                activeTab === 'subidos'
                                  ? handleEliminarSubido(libro.id)
                                  : handleEliminarFavorito(libro.id)
                              }
                            >
                              <i className="bi bi-trash" />
                            </button>
                          </div>
                        </div>
                        <div className="book-card-content">
                          <h5 className="book-title">{libro.titulo}</h5>
                          <p className="book-author">{libro.autor}</p>
                          <div className="book-meta">
                            <span className="book-genre">{libro.genero}</span>
                            <span className="book-date">
                              {new Date(libro.fecha_subida).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
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
  );
}
