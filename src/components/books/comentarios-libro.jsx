"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import "./comentarios.css"

export default function ComentariosLibro({ titulo, session }) {
  // Inicializar comentarios como un array vacío para evitar el error de map en undefined
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

        // Usar el proxy configurado en next.config.mjs en lugar de llamar directamente a la API externa
        // Esto evita problemas de CORS
        const response = await fetch(`/api/proxy-books/comentarios?titulo=${encodeURIComponent(titulo)}`)

        if (!response.ok) {
          throw new Error(`Error al cargar los comentarios: ${response.status}`)
        }

        const data = await response.json()

        // Verificar que data sea un array
        if (!Array.isArray(data)) {
          console.error("La respuesta de la API no es un array:", data)
          throw new Error("Formato de respuesta inesperado")
        }

        // Ya no necesitamos filtrar aquí, ya que el endpoint de proxy debería devolver los comentarios filtrados
        // Sin embargo, podemos mantener una verificación adicional por seguridad
        const tituloNormalizado = normalizarTexto(titulo)

        // Filtrar comentarios por título normalizado (verificación adicional)
        const comentariosFiltrados = data.filter((comentario) => {
          // Obtener el título del comentario, que puede estar en titulo_libro o en titulo
          const tituloComentario = comentario.titulo_libro || comentario.titulo || ""

          if (!tituloComentario) return false

          const tituloComentarioNormalizado = normalizarTexto(tituloComentario)

          // Comparación más flexible: verificar si uno contiene al otro
          return (
            tituloComentarioNormalizado.includes(tituloNormalizado) ||
            tituloNormalizado.includes(tituloComentarioNormalizado)
          )
        })

        setComentarios(comentariosFiltrados)

        // Calcular porcentajes de valoraciones
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
    // Limitar el comentario a 300 caracteres
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

    if (!titulo || !nuevoComentario.comentario.trim() || !nuevoComentario.valoracion) {
      alert("Por favor, completa todos los campos requeridos: título, comentario y valoración.")
      return
    }

    try {
      setEnviando(true)

      // Preparar datos para enviar, incluyendo información de la sesión
      const comentarioData = {
        titulo: titulo,
        usuario_id: session?.user?.email || null,
        usuario_nombre: session?.user?.name || "Anónimo",
        imagen_usuario: session?.user?.image || null, // Añadimos la imagen del usuario de la sesión
        comentario: nuevoComentario.comentario,
        valoracion: nuevoComentario.valoracion,
        fecha_valoracion: new Date().toISOString(),
      }

      const response = await fetch("/api/proxy-books/comentarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comentarioData),
      })

      if (!response.ok) {
        const errorText = await response.text() // Capturar el mensaje de error del servidor
        throw new Error(`Error al enviar el comentario: ${errorText}`)
      }

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
      setMensajeExito("¡Comentario enviado con éxito!")

      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setMensajeExito("")
      }, 3000)
    } catch (error) {
      console.error("Error al enviar comentario:", error)
      alert("No se pudo enviar el comentario. Por favor, inténtalo de nuevo.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="custom-container-comment bg-secondario ms-5 rounded">
      <div className="row h-100">
        <div className="col-7 col">
          <h3 className="fw-semibold pt-4 ps-5 text-dark">Opiniones del libro</h3>
          <div className="container mt-3 pt-2 ps-4 comentarios-container">
            {loading ? (
              <p className="fw-medium">Cargando comentarios...</p>
            ) : error ? (
              <p className="fw-medium text-danger">{error}</p>
            ) : (
              <>
                {mensajeExito && (
                  <div className="alert alert-success" role="alert">
                    {mensajeExito}
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
                              >
                                Cancelar
                              </button>
                              <button type="submit" className="btn btn-dark" disabled={enviando}>
                                {enviando ? "Enviando..." : "Publicar comentario"}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lista de comentarios - visible para todos los usuarios */}
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
              </>
            )}
          </div>
        </div>
        <div className="col-2 col" />
        <div className="col-3 col d-flex flex-column justify-content-center align-items-center border-start border-black">
          <div className="d-flex flex-column me-3 pt-5 mt-4 porcentajes-container">
            {/* Generacion de estrellas para los comentarios */}
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex">
                  {Array(rating)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} style={{ fontSize: "24px", color: "#FFD700" }}>
                        ★
                      </span>
                    ))}
                  {Array(5 - rating)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} style={{ fontSize: "24px", color: "#C0C0C0" }}>
                        ★
                      </span>
                    ))}
                </div>
                <p className="mb-0 ps-4 fw-bold">{porcentajes[rating]}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
