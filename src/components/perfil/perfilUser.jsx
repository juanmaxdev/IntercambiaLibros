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
  const [userData, setUserData] = useState(null)
  const [editData, setEditData] = useState(null)
  const [stats, setStats] = useState({
    librosSubidos: 0,
    favoritos: 0,
    comentarios: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/?login=true")
    }
  }, [status, router])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/perfil")
        if (response.ok) {
          const data = await response.json()
          console.log("Datos del usuario obtenidos:", data)
          setUserData(data)
          setEditData(data)
        }
      } catch (err) {
        console.error("Error obteniendo perfil:", err)
      } finally {
        setLoading(false)
      }
    }

    const fetchUserStats = async () => {
      if (!session?.user?.email) return

      try {
        console.log("Obteniendo estadísticas para:", session.user.email)

        // Obtener libros subidos usando el endpoint correcto
        const librosResponse = await fetch("/api/libros/usuario", {
          headers: {
            correo_electronico: session.user.email,
          },
        })

        if (librosResponse.ok) {
          const librosData = await librosResponse.json()
          console.log("Libros subidos obtenidos:", librosData)
          setStats((prev) => ({ ...prev, librosSubidos: librosData.length || 0 }))
        } else {
          console.error("Error al obtener libros subidos:", librosResponse.status)
        }

        // Obtener favoritos
        const favoritosResponse = await fetch("/api/libros/favoritos")
        if (favoritosResponse.ok) {
          const favoritosData = await favoritosResponse.json()
          console.log("Favoritos obtenidos:", favoritosData)
          setStats((prev) => ({ ...prev, favoritos: favoritosData.length || 0 }))
        } else {
          console.error("Error al obtener favoritos:", favoritosResponse.status)
        }

        // Obtener comentarios del usuario
        const comentariosResponse = await fetch(
          `/api/libros/comentarios?usuario=${encodeURIComponent(session.user.email)}`,
        )
        if (comentariosResponse.ok) {
          const comentariosData = await comentariosResponse.json()
          console.log("Comentarios obtenidos:", comentariosData)
          setStats((prev) => ({ ...prev, comentarios: comentariosData.length || 0 }))
        } else {
          console.error("Error al obtener comentarios:", comentariosResponse.status)
        }
      } catch (err) {
        console.error("Error obteniendo estadísticas:", err)
      }
    }

    if (status === "authenticated") {
      fetchUserData()
      fetchUserStats()
    }
  }, [status, session?.user?.email])

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        const res = await fetch("/api/perfil", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editData),
        })

        if (res.ok) {
          setUserData({ ...editData })
          // Mostrar notificación de éxito
          const successAlert = document.createElement("div")
          successAlert.className = "alert alert-success alert-dismissible fade show position-fixed"
          successAlert.style.cssText = "top: 20px; right: 20px; z-index: 9999; min-width: 300px;"
          successAlert.innerHTML = `
            <i class="bi bi-check-circle me-2"></i>
            Perfil actualizado correctamente
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          `
          document.body.appendChild(successAlert)
          setTimeout(() => successAlert.remove(), 5000)
        } else {
          throw new Error("Error al guardar")
        }
      } catch (err) {
        console.error(err)
        // Mostrar notificación de error
        const errorAlert = document.createElement("div")
        errorAlert.className = "alert alert-danger alert-dismissible fade show position-fixed"
        errorAlert.style.cssText = "top: 20px; right: 20px; z-index: 9999; min-width: 300px;"
        errorAlert.innerHTML = `
          <i class="bi bi-exclamation-triangle me-2"></i>
          Error al actualizar el perfil
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `
        document.body.appendChild(errorAlert)
        setTimeout(() => errorAlert.remove(), 5000)
      }
    }

    setIsEditing(!isEditing)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditData({ ...editData, [name]: value })
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible"

    try {
      // Manejar el formato de fecha de la base de datos: 2025-02-26 18:55:00
      const date = new Date(dateString)

      if (isNaN(date.getTime())) {
        console.error("Fecha inválida:", dateString)
        return "Fecha no disponible"
      }

      return new Intl.DateTimeFormat("es-ES", {
        year: "numeric",
        month: "long",
      }).format(date)
    } catch (error) {
      console.error("Error al formatear fecha:", error, dateString)
      return "Fecha no disponible"
    }
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (status === "loading" || loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <h4 className="text-muted">Cargando perfil...</h4>
          <p className="text-muted">Obteniendo información del usuario</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 col-xl-2 px-0">
            <ModernSidebar activeItem="perfil" />
          </div>

          <div className="col-lg-9 col-xl-10 p-0">
            <div className="profile-content">
              {/* Header del perfil */}
              <div className="profile-header">
                <div className="profile-cover">
                  <div className="cover-overlay"></div>
                  {/* Badges de estado */}
                  <div className="position-absolute top-0 end-0 p-3">
                    <span className="badge bg-success bg-opacity-90 me-2">
                      <i className="bi bi-check-circle me-1"></i>
                      Verificado
                    </span>
                    {stats.librosSubidos > 0 && (
                      <span className="badge bg-primary bg-opacity-90">
                        <i className="bi bi-star me-1"></i>
                        Contribuidor
                      </span>
                    )}
                  </div>
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
                    <div className="avatar-placeholder">{getInitials(userData?.nombre_usuario)}</div>
                  )}
                  {/* Indicador de estado online */}
                  <div className="position-absolute bottom-0 end-0">
                    <span className="badge rounded-pill bg-success p-2">
                      <span className="visually-hidden">En línea</span>
                    </span>
                  </div>
                </div>

                <div className="profile-info">
                  <h2 className="profile-name d-flex align-items-center">
                    {userData?.nombre_usuario || "Usuario"}
                    <i className="bi bi-patch-check-fill text-primary ms-2" title="Usuario verificado"></i>
                  </h2>
                  <p className="profile-email">
                    <i className="bi bi-envelope me-2"></i>
                    {userData?.correo_electronico}
                  </p>
                  {userData?.ubicacion && (
                    <p className="profile-location text-muted mb-2">
                      <i className="bi bi-geo-alt me-2"></i>
                      {userData.ubicacion}
                    </p>
                  )}
                  <p className="profile-member-since text-muted mb-3">
                    <i className="bi bi-calendar-event me-2"></i>
                    Miembro desde {formatDate(userData?.fecha_registro)}
                  </p>

                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className={`btn ${isEditing ? "btn-success" : "btn-outline-primary"} btn-sm`}
                      onClick={handleEditToggle}
                      disabled={loading}
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
              </div>

              <div className="profile-body">
                <div className="row g-4">
                  {/* Estadísticas */}
                  <div className="col-12">
                    <div className="profile-section">
                      <h3 className="section-title d-flex align-items-center">
                        <i className="bi bi-graph-up me-2 text-primary"></i>
                        Estadísticas del Usuario
                      </h3>
                      <div className="section-content">
                        <div className="row g-3">
                          <div className="col-6 col-md-4">
                            <div className="stat-card text-center p-3 rounded-3 bg-primary bg-opacity-10 border border-primary border-opacity-25">
                              <div className="stat-icon-large mb-2">
                                <i className="bi bi-book text-primary" style={{ fontSize: "2rem" }}></i>
                              </div>
                              <div className="stat-value h3 mb-1 text-primary">{stats.librosSubidos}</div>
                              <div className="stat-label text-muted small">Libros Subidos</div>
                            </div>
                          </div>

                          <div className="col-6 col-md-4">
                            <div className="stat-card text-center p-3 rounded-3 bg-danger bg-opacity-10 border border-danger border-opacity-25">
                              <div className="stat-icon-large mb-2">
                                <i className="bi bi-heart-fill text-danger" style={{ fontSize: "2rem" }}></i>
                              </div>
                              <div className="stat-value h3 mb-1 text-danger">{stats.favoritos}</div>
                              <div className="stat-label text-muted small">Favoritos</div>
                            </div>
                          </div>

                          <div className="col-6 col-md-4">
                            <div className="stat-card text-center p-3 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25">
                              <div className="stat-icon-large mb-2">
                                <i className="bi bi-chat-dots text-success" style={{ fontSize: "2rem" }}></i>
                              </div>
                              <div className="stat-value h3 mb-1 text-success">{stats.comentarios}</div>
                              <div className="stat-label text-muted small">Comentarios</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información personal */}
                  <div className="col-12">
                    <div className="profile-section">
                      <h3 className="section-title d-flex align-items-center">
                        <i className="bi bi-person me-2 text-primary"></i>
                        Información Personal
                      </h3>
                      <div className="section-content">
                        {isEditing ? (
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                <i className="bi bi-person me-2"></i>Nombre completo
                              </label>
                              <input
                                type="text"
                                className="form-control form-control-lg"
                                name="nombre_usuario"
                                value={editData?.nombre_usuario || ""}
                                onChange={handleInputChange}
                                placeholder="Ingresa tu nombre completo"
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                <i className="bi bi-geo-alt me-2"></i>Ubicación
                              </label>
                              <input
                                type="text"
                                className="form-control form-control-lg"
                                name="ubicacion"
                                value={editData?.ubicacion || ""}
                                onChange={handleInputChange}
                                placeholder="Ciudad, País"
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label fw-semibold">
                                <i className="bi bi-chat-quote me-2"></i>Biografía
                              </label>
                              <textarea
                                className="form-control"
                                name="biografia"
                                rows="4"
                                value={editData?.biografia || ""}
                                onChange={handleInputChange}
                                placeholder="Cuéntanos un poco sobre ti y tus gustos literarios..."
                                style={{ resize: "vertical" }}
                                maxLength="500"
                              />
                              <div className="form-text">
                                Máximo 500 caracteres ({(editData?.biografia || "").length}/500)
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="row g-4">
                            <div className="col-sm-6 col-md-3">
                              <div className="info-item">
                                <div className="info-label">
                                  <i className="bi bi-person me-2 text-primary"></i>Nombre
                                </div>
                                <div className="info-value">{userData?.nombre_usuario || "No especificado"}</div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-md-3">
                              <div className="info-item">
                                <div className="info-label">
                                  <i className="bi bi-envelope me-2 text-primary"></i>Correo
                                </div>
                                <div className="info-value">{userData?.correo_electronico}</div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-md-3">
                              <div className="info-item">
                                <div className="info-label">
                                  <i className="bi bi-geo-alt me-2 text-primary"></i>Ubicación
                                </div>
                                <div className="info-value">{userData?.ubicacion || "No especificada"}</div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-md-3">
                              <div className="info-item">
                                <div className="info-label">
                                  <i className="bi bi-calendar-event me-2 text-primary"></i>Miembro desde
                                </div>
                                <div className="info-value">{formatDate(userData?.fecha_registro)}</div>
                              </div>
                            </div>
                            {userData?.biografia && (
                              <div className="col-12">
                                <div className="info-item">
                                  <div className="info-label">
                                    <i className="bi bi-chat-quote me-2 text-primary"></i>Biografía
                                  </div>
                                  <div className="info-value bio-text p-3 bg-light rounded-3">{userData.biografia}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
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
