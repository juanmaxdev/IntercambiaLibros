"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import ModernSidebar from "./sideBar"
import "@/app/styles/perfil/perfil-styles.css"

export default function PerfilUser() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    nombre: "Antonio",
    apellidos: "Pérez García",
    edad: "32",
    ubicacion: "Sevilla",
    telefono: "612345678",
    generos_preferidos: "Terror, Ciencia Ficción",
    biografia:
      "Apasionado de la lectura desde joven. Me encanta descubrir nuevos autores y compartir mis libros favoritos con otros lectores.",
  })
  const [editData, setEditData] = useState({ ...userData })

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/?login=true")
    }
  }, [status, router])

  const handleEditToggle = () => {
    if (isEditing) {
      // Guardar cambios
      setUserData({ ...editData })
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditData({
      ...editData,
      [name]: value,
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById("floatingInput").value;
    const password = document.getElementById("floatingPassword").value;

    try {
      const response = await fetch("/api/perfil/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo_electronico: email, contrasena: password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Inicio de sesión exitoso:", data);

        // Almacenar el token en localStorage
        localStorage.setItem("token", data.token);

        // Redirigir al perfil del usuario
        window.location.href = "/perfil/perfilUser.jsx"; // Cambia "/perfil" por la ruta de tu perfil
      } else {
        const error = await response.json();
        console.error("Error al iniciar sesión:", error.message);
      }
    } catch (err) {
      console.error("Error del servidor:", err);
    }
  };

  // Si no está autenticado, mostrar mensaje de carga mientras se redirige
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <h4>Verificando sesión...</h4>
          <p>Debes iniciar sesión para ver tu perfil.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar moderna */}
          <div className="col-lg-3 col-xl-2 px-0">
            <ModernSidebar activeItem="perfil" />
          </div>

          {/* Contenido principal */}
          <div className="col-lg-9 col-xl-10 p-0">
            <div className="profile-content">
              <div className="profile-header">
                <div className="profile-cover">
                  <div className="cover-overlay"></div>
                </div>
                <div className="profile-avatar">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image || "/placeholder.svg"}
                      alt="Foto de perfil"
                      width={120}
                      height={120}
                      className="avatar-img"
                    />
                  ) : (
                    <div className="avatar-placeholder">{session?.user?.name?.charAt(0) || "U"}</div>
                  )}
                </div>
                <div className="profile-info">
                  <h2 className="profile-name">{session?.user?.name || "Usuario"}</h2>
                  <p className="profile-email">{session?.user?.email || ""}</p>
                  <button
                    className={`btn ${isEditing ? "btn-success" : "btn-outline-primary"} btn-sm mt-2`}
                    onClick={handleEditToggle}
                  >
                    {isEditing ? (
                      <>
                        <i className="bi bi-check-lg me-2"></i>Guardar cambios
                      </>
                    ) : (
                      <>
                        <i className="bi bi-pencil me-2"></i>Editar perfil
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="profile-body">
                <div className="row">
                  <div className="col-md-8">
                    <div className="profile-section">
                      <h3 className="section-title">Información Personal</h3>
                      <div className="section-content">
                        {isEditing ? (
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label">Nombre</label>
                              <input
                                type="text"
                                className="form-control"
                                name="nombre"
                                value={editData.nombre}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Apellidos</label>
                              <input
                                type="text"
                                className="form-control"
                                name="apellidos"
                                value={editData.apellidos}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Edad</label>
                              <input
                                type="text"
                                className="form-control"
                                name="edad"
                                value={editData.edad}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Ubicación</label>
                              <input
                                type="text"
                                className="form-control"
                                name="ubicacion"
                                value={editData.ubicacion}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Email</label>
                              <input
                                type="email"
                                className="form-control"
                                value={session?.user?.email || ""}
                                disabled
                              />
                              <small className="text-muted">El email no se puede modificar</small>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Teléfono</label>
                              <input
                                type="tel"
                                className="form-control"
                                name="telefono"
                                value={editData.telefono || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label">Géneros Preferidos</label>
                              <input
                                type="text"
                                className="form-control"
                                name="generos_preferidos"
                                value={editData.generos_preferidos}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label">Información sobre mí</label>
                              <textarea
                                className="form-control"
                                name="biografia"
                                rows="4"
                                value={editData.biografia}
                                onChange={handleInputChange}
                              ></textarea>
                            </div>
                          </div>
                        ) : (
                          <div className="info-grid">
                            <div className="info-item">
                              <div className="info-label">Nombre</div>
                              <div className="info-value">{userData.nombre}</div>
                            </div>
                            <div className="info-item">
                              <div className="info-label">Apellidos</div>
                              <div className="info-value">{userData.apellidos}</div>
                            </div>
                            <div className="info-item">
                              <div className="info-label">Edad</div>
                              <div className="info-value">{userData.edad}</div>
                            </div>
                            <div className="info-item">
                              <div className="info-label">Ubicación</div>
                              <div className="info-value">{userData.ubicacion}</div>
                            </div>
                            <div className="info-item">
                              <div className="info-label">Email</div>
                              <div className="info-value">{session?.user?.email || "ejemplo@email.com"}</div>
                            </div>
                            <div className="info-item">
                              <div className="info-label">Teléfono</div>
                              <div className="info-value">{userData.telefono || "No especificado"}</div>
                            </div>
                            <div className="info-item">
                              <div className="info-label">Géneros Preferidos</div>
                              <div className="info-value">
                                {userData.generos_preferidos.split(",").map((genero, index) => (
                                  <span key={index} className="genre-tag">
                                    {genero.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="info-item full-width">
                              <div className="info-label">Información sobre mí</div>
                              <div className="info-value bio-text">{userData.biografia}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="profile-section">
                      <h3 className="section-title">Actividad Reciente</h3>
                      <div className="section-content">
                        <div className="activity-timeline">
                          <div className="activity-item">
                            <div className="activity-icon">
                              <i className="bi bi-heart-fill"></i>
                            </div>
                            <div className="activity-content">
                              <p className="activity-text">
                                Has añadido <strong>Cien años de soledad</strong> a tus favoritos
                              </p>
                              <p className="activity-time">Hace 2 días</p>
                            </div>
                          </div>
                          <div className="activity-item">
                            <div className="activity-icon">
                              <i className="bi bi-upload"></i>
                            </div>
                            <div className="activity-content">
                              <p className="activity-text">
                                Has subido <strong>El código Da Vinci</strong> para intercambio
                              </p>
                              <p className="activity-time">Hace 1 semana</p>
                            </div>
                          </div>
                          <div className="activity-item">
                            <div className="activity-icon">
                              <i className="bi bi-arrow-left-right"></i>
                            </div>
                            <div className="activity-content">
                              <p className="activity-text">
                                Has completado un intercambio con <strong>Laura P.</strong>
                              </p>
                              <p className="activity-time">Hace 2 semanas</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="profile-section">
                      <h3 className="section-title">Estadísticas</h3>
                      <div className="section-content">
                        <div className="stats-grid">
                          <div className="stat-item">
                            <div className="stat-icon">
                              <i className="bi bi-book"></i>
                            </div>
                            <div className="stat-content">
                              <div className="stat-value">12</div>
                              <div className="stat-label">Libros subidos</div>
                            </div>
                          </div>
                          <div className="stat-item">
                            <div className="stat-icon">
                              <i className="bi bi-arrow-left-right"></i>
                            </div>
                            <div className="stat-content">
                              <div className="stat-value">8</div>
                              <div className="stat-label">Intercambios</div>
                            </div>
                          </div>
                          <div className="stat-item">
                            <div className="stat-icon">
                              <i className="bi bi-heart"></i>
                            </div>
                            <div className="stat-content">
                              <div className="stat-value">15</div>
                              <div className="stat-label">Favoritos</div>
                            </div>
                          </div>
                          <div className="stat-item">
                            <div className="stat-icon">
                              <i className="bi bi-star"></i>
                            </div>
                            <div className="stat-content">
                              <div className="stat-value">4.8</div>
                              <div className="stat-label">Valoración</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="profile-section">
                      <h3 className="section-title">Libros Favoritos</h3>
                      <div className="section-content">
                        <div className="favorite-books">
                          <div className="favorite-book">
                            <div className="book-cover">
                              <Image
                                src="/assets/img/libro1.jpg"
                                alt="Cien años de soledad"
                                width={60}
                                height={90}
                                className="img-fluid rounded"
                              />
                            </div>
                            <div className="book-info">
                              <h5 className="book-title">Cien años de soledad</h5>
                              <p className="book-author">Gabriel García Márquez</p>
                            </div>
                          </div>
                          <div className="favorite-book">
                            <div className="book-cover">
                              <Image
                                src="/assets/img/libro2.jpg"
                                alt="El principito"
                                width={60}
                                height={90}
                                className="img-fluid rounded"
                              />
                            </div>
                            <div className="book-info">
                              <h5 className="book-title">El principito</h5>
                              <p className="book-author">Antoine de Saint-Exupéry</p>
                            </div>
                          </div>
                          <div className="favorite-book">
                            <div className="book-cover">
                              <Image
                                src="/assets/img/libro3.jpg"
                                alt="1984"
                                width={60}
                                height={90}
                                className="img-fluid rounded"
                              />
                            </div>
                            <div className="book-info">
                              <h5 className="book-title">1984</h5>
                              <p className="book-author">George Orwell</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-center mt-3">
                          <a href="/libros/misLibros" className="btn btn-sm btn-outline-primary">
                            Ver todos
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
