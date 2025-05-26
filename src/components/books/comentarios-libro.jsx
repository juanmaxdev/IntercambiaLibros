"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import "@/app/styles/books/comentarios.css"

export default function ComentariosLibro({ titulo, session }) {
  // Estados existentes
  const [comentarios, setComentarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [porcentajes, setPorcentajes] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  })
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [nuevoComentario, setNuevoComentario] = useState({
    comentario: "",
    valoracion: 5,
  })
  const [enviando, setEnviando] = useState(false)
  const [mensajeExito, setMensajeExito] = useState("")
  const [hoverRating, setHoverRating] = useState(0)

  // Nuevos estados para el modal de error
  const [mostrarModalError, setMostrarModalError] = useState(false)
  const [mensajeError, setMensajeError] = useState("")
  const [tipoError, setTipoError] = useState("error") // "error", "warning", "info"

  // Función para mostrar errores en modal
  const mostrarError = (mensaje, tipo = "error") => {
    console.error("Error en comentarios:", mensaje)
    setMensajeError(mensaje)
    setTipoError(tipo)
    setMostrarModalError(true)
  }

  // Función para mostrar éxito
  const mostrarExito = (mensaje) => {
    setMensajeExito(mensaje)
    setTimeout(() => {
      setMensajeExito("")
    }, 3000)
  }

  // Normalizar título para comparación
  const normalizarTexto = (texto) => {
    if (!texto) return ""
    return texto
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/gi, "")
  }

  useEffect(() => {
    const fetchComentarios = async () => {
      if (!titulo) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        const response = await fetch(`/api/libros/comentarios?titulo=${encodeURIComponent(titulo)}`)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Respuesta de error:", errorText)
          console.error("Status code:", response.status)
          console.error("Status text:", response.statusText)
          throw new Error(`Error al cargar los comentarios: ${response.status}`)
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          console.error("La respuesta de la API no es un array:", data)
          throw new Error("Formato de respuesta inesperado")
        }

        const tituloNormalizado = normalizarTexto(titulo)

        const comentariosFiltrados = data.filter((comentario) => {
          const tituloComentario = comentario.titulo_libro || comentario.titulo || ""

          if (!tituloComentario) return false

          const tituloComentarioNormalizado = normalizarTexto(tituloComentario)

          return (
            tituloComentarioNormalizado.includes(tituloNormalizado) ||
            tituloNormalizado.includes(tituloComentarioNormalizado)
          )
        })

        setComentarios(comentariosFiltrados)

        if (comentariosFiltrados.length > 0) {
          const conteo = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
          comentariosFiltrados.forEach((comentario) => {
            if (comentario.valoracion >= 1 && comentario.valoracion <= 5) {
              conteo[comentario.valoracion]++
            }
          })

          const total = comentariosFiltrados.length
          const nuevoPorcentajes = {}

          for (let i = 1; i <= 5; i++) {
            nuevoPorcentajes[i] = total > 0 ? Math.round((conteo[i] / total) * 100) : 0
          }

          setPorcentajes(nuevoPorcentajes)
        }
      } catch (err) {
        console.error("Error al cargar comentarios:", err)
        setError("No se pudieron cargar los comentarios")
      } finally {
        setLoading(false)
      }
    }

    fetchComentarios()
  }, [titulo])

  // Formatear fecha para mostrar en formato legible
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const isLoggedIn = !!session

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === "comentario" && value.length > 300) {
      return
    }

    setNuevoComentario({
      ...nuevoComentario,
      [name]: value,
    })
  }

  // Manejar cambio de valoración
  const handleRatingChange = (rating) => {
    setNuevoComentario({
      ...nuevoComentario,
      valoracion: rating,
    })
  }

  // Manejar hover en las estrellas
  const handleRatingHover = (rating) => {
    setHoverRating(rating)
  }

  // Resetear hover al salir del área de estrellas
  const handleRatingLeave = () => {
    setHoverRating(0)
  }

  // Enviar nuevo comentario
  const handleSubmitComentario = async (e) => {
    e.preventDefault()

    // Validaciones con mensajes específicos
    if (!titulo) {
      mostrarError("Error interno: No se pudo identificar el libro.", "warning")
      return
    }

    if (!nuevoComentario.comentario.trim()) {
      mostrarError("Por favor, escribe un comentario antes de enviarlo.", "warning")
      return
    }

    if (!nuevoComentario.valoracion || nuevoComentario.valoracion < 1 || nuevoComentario.valoracion > 5) {
      mostrarError("Por favor, selecciona una valoración válida (1-5 estrellas).", "warning")
      return
    }

    if (!session?.user?.email) {
      mostrarError("Debes iniciar sesión para poder comentar.", "info")
      return
    }

    try {
      setEnviando(true)

      const comentarioData = {
        titulo: titulo,
        usuario_id: session.user.email, // Enviamos el email, la API lo convertirá al ID
        usuario_nombre: session.user.name || "Anónimo",
        imagen_usuario: session.user.image || null,
        comentario: nuevoComentario.comentario.trim(),
        valoracion: nuevoComentario.valoracion,
        fecha_valoracion: new Date().toISOString(),
      }

      console.log("Enviando comentario:", {
        titulo: comentarioData.titulo,
        usuario_email: comentarioData.usuario_id,
        valoracion: comentarioData.valoracion,
      })

      const response = await fetch("/api/libros/comentarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comentarioData),
      })

      const resultado = await response.json()

      if (!response.ok) {
        // Usar el mensaje amigable del servidor si está disponible
        const mensajeUsuario = resultado.userMessage || resultado.error || "Error desconocido al enviar el comentario"
        throw new Error(mensajeUsuario)
      }

      console.log("Comentario enviado exitosamente:", resultado)

      // Actualizar la lista de comentarios
      setComentarios([comentarioData, ...comentarios])

      // Actualizar porcentajes
      const nuevoConteo = { ...porcentajes }
      const total = comentarios.length + 1

      for (let i = 1; i <= 5; i++) {
        const cantidadActual = (porcentajes[i] / 100) * comentarios.length
        const nuevaCantidad = i === nuevoComentario.valoracion ? cantidadActual + 1 : cantidadActual
        nuevoConteo[i] = Math.round((nuevaCantidad / total) * 100)
      }

      setPorcentajes(nuevoConteo)

      // Limpiar formulario y mostrar mensaje de éxito
      setNuevoComentario({ comentario: "", valoracion: 5 })
      setMostrarFormulario(false)
      mostrarExito(resultado.userMessage || "¡Tu comentario se ha publicado exitosamente!")
    } catch (error) {
      console.error("Error al enviar comentario:", error)

      // Mostrar el mensaje de error directamente (ya viene procesado del servidor)
      mostrarError(error.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <div className="custom-container-comment mx-auto mx-md-5 rounded">
        <div className="row g-0">
          {/* Sección de comentarios - Ocupa toda la pantalla en móviles, 8 columnas en tablets/desktop */}
          <div className="col-12 col-lg-8">
            <h3 className="fw-semibold pt-4 ps-3 ps-md-5 text-dark">Opiniones del libro</h3>
            <div className="container mt-3 pt-2 ps-3 ps-md-4 comentarios-container">
              {loading ? (
                <p className="fw-medium">Cargando comentarios...</p>
              ) : error ? (
                <p className="fw-medium text-danger">{error}</p>
              ) : (
                <>
                  {mensajeExito && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      {mensajeExito}
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setMensajeExito("")}
                        aria-label="Close"
                      ></button>
                    </div>
                  )}

                  {/* Mostrar mensaje para iniciar sesión si el usuario no está autenticado */}
                  {!isLoggedIn && (
                    <p className="fw-medium">
                      ¿Leíste este libro?{" "}
                      <a href="#" data-bs-toggle="modal" data-bs-target="#modalIniciarSesion">
                        Inicia sesión
                      </a>{" "}
                      para poder agregar tu propia evaluación.
                    </p>
                  )}

                  {/* Implementación tipo acordeón para el formulario - solo visible si está autenticado */}
                  {isLoggedIn && (
                    <div className="comentario-accordion-container">
                      <div className="accordion mb-4" id="comentarioAccordion">
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="headingOne">
                            <button
                              className={`accordion-button ${!mostrarFormulario ? "collapsed" : ""}`}
                              type="button"
                              onClick={() => setMostrarFormulario(!mostrarFormulario)}
                              aria-expanded={mostrarFormulario}
                              aria-controls="collapseOne"
                            >
                              {comentarios.length === 0 ? "Sé el primero en comentar" : "Agregar mi comentario"}
                            </button>
                          </h2>
                          <div
                            id="collapseOne"
                            className={`accordion-collapse collapse ${mostrarFormulario ? "show" : ""}`}
                            aria-labelledby="headingOne"
                          >
                            <div className="accordion-body comentario-form-container">
                              <form onSubmit={handleSubmitComentario}>
                                <div className="mb-3">
                                  <label htmlFor="valoracion" className="form-label">
                                    Tu valoración:
                                  </label>
                                  <div className="d-flex mb-2" onMouseLeave={handleRatingLeave}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <span
                                        key={star}
                                        onClick={() => handleRatingChange(star)}
                                        onMouseEnter={() => handleRatingHover(star)}
                                        style={{
                                          fontSize: "28px",
                                          color:
                                            star <= (hoverRating || nuevoComentario.valoracion) ? "#FFD700" : "#C0C0C0",
                                          cursor: "pointer",
                                          marginRight: "5px",
                                          transition: "color 0.2s ease",
                                        }}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="comentario" className="form-label">
                                    Tu comentario:
                                  </label>
                                  <textarea
                                    className="form-control"
                                    id="comentario"
                                    name="comentario"
                                    rows="4"
                                    value={nuevoComentario.comentario}
                                    onChange={handleInputChange}
                                    maxLength={250}
                                    required
                                    placeholder="Comparte tu opinión sobre este libro..."
                                  ></textarea>
                                  <div className="text-end text-muted mt-1">
                                    <small>{nuevoComentario.comentario.length}/250 caracteres</small>
                                  </div>
                                </div>
                                <div className="d-flex justify-content-end">
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary me-2"
                                    onClick={() => setMostrarFormulario(false)}
                                    disabled={enviando}
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    type="submit"
                                    className="btn btn-primary-green"
                                    disabled={enviando || !nuevoComentario.comentario.trim()}
                                  >
                                    {enviando ? (
                                      <>
                                        <span
                                          className="spinner-border spinner-border-sm me-2"
                                          role="status"
                                          aria-hidden="true"
                                        ></span>
                                        Enviando...
                                      </>
                                    ) : (
                                      "Publicar comentario"
                                    )}
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lista de comentarios - visible para todos los usuarios */}
                  <div className="comentarios-lista-container">
                    {comentarios.length > 0 ? (
                      <div className="comentarios-lista">
                        {comentarios.map((comentario, index) => (
                          <div key={index} className="comentario-item mb-4 pb-3 border-bottom">
                            <div className="d-flex align-items-center mb-2">
                              <div className="usuario-avatar me-2">
                                {comentario.imagen_usuario ||
                                (session?.user?.image && comentario.usuario_id === session?.user?.email) ? (
                                  <Image
                                    src={
                                      session?.user?.image && comentario.usuario_id === session?.user?.email
                                        ? session.user.image
                                        : comentario.imagen_usuario || "/placeholder.svg"
                                    }
                                    alt="Avatar"
                                    width={40}
                                    height={40}
                                    className="rounded-circle"
                                  />
                                ) : (
                                  <div className="avatar-placeholder rounded-circle">
                                    {(comentario.nombre_usuario || "U")[0].toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="fw-bold mb-0">
                                  {comentario.nombre_usuario ||
                                    (comentario.usuario_id === session?.user?.email
                                      ? session.user.name
                                      : `${(comentario.usuario_id?.toString() || "").substring(0, 5) || "Anónimo"}`)}
                                </p>
                                <p className="text-muted small mb-0">
                                  {comentario.fecha_valoracion
                                    ? formatearFecha(comentario.fecha_valoracion)
                                    : comentario.fecha
                                      ? formatearFecha(comentario.fecha)
                                      : "Fecha desconocida"}
                                </p>
                              </div>
                            </div>
                            <div className="valoracion mb-2">
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <span
                                    key={i}
                                    style={{
                                      fontSize: "18px",
                                      color: i < comentario.valoracion ? "#FFD700" : "#C0C0C0",
                                    }}
                                  >
                                    ★
                                  </span>
                                ))}
                            </div>
                            <p className="comentario-texto">{comentario.comentario}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="fw-medium mt-3">No hay comentarios para este libro todavía.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Separador visible solo en móviles */}
          <div className="d-lg-none w-100 my-3">
            <hr className="mx-4" />
          </div>

          {/* Sección de valoraciones - Ocupa toda la pantalla en móviles, 4 columnas en tablets/desktop */}
          <div className="col-12 col-lg-4 d-flex align-items-center">
            <div className="ratings-summary w-100 px-4 mx-auto my-4 my-lg-0">
              <h4 className="text-center mb-4 text-forest-green">Valoraciones</h4>
              {/* Generacion de estrellas para los comentarios */}
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex stars-container">
                    {Array(rating)
                      .fill(0)
                      .map((_, i) => (
                        <span key={i} className="star-icon filled">
                          ★
                        </span>
                      ))}
                    {Array(5 - rating)
                      .fill(0)
                      .map((_, i) => (
                        <span key={i} className="star-icon empty">
                          ★
                        </span>
                      ))}
                  </div>
                  <div className="progress-container ms-2 flex-grow-1">
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${porcentajes[rating]}%` }}
                        aria-valuenow={porcentajes[rating]}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  <p className="mb-0 ms-2 fw-bold text-forest-green percentage-text">{porcentajes[rating]}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Error */}
      {mostrarModalError && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title d-flex align-items-center">
                  {tipoError === "error" && <i className="bi bi-exclamation-triangle-fill text-danger me-2"></i>}
                  {tipoError === "warning" && <i className="bi bi-exclamation-circle-fill text-warning me-2"></i>}
                  {tipoError === "info" && <i className="bi bi-info-circle-fill text-info me-2"></i>}
                  {tipoError === "error" ? "Error" : tipoError === "warning" ? "Atención" : "Información"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMostrarModalError(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">{mensajeError}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setMostrarModalError(false)}>
                  Entendido
                </button>
                {tipoError === "info" && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#modalIniciarSesion"
                    onClick={() => setMostrarModalError(false)}
                  >
                    Iniciar Sesión
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop del modal */}
      {mostrarModalError && (
        <div className="modal-backdrop fade show" onClick={() => setMostrarModalError(false)}></div>
      )}
    </>
  )
}
