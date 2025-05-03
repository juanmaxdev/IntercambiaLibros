"use client"
import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import SideBar from "@components/perfil/sideBar"
import {
  obtenerConversaciones,
  obtenerMensajes,
  enviarMensaje,
  marcarComoLeidos,
  obtenerUsuarioPorEmail,
} from "@/services/mensajesService"

export default function Mensajes() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const contactoParam = searchParams.get("contacto")
  const libroParam = searchParams.get("libro")

  const [conversaciones, setConversaciones] = useState([])
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null)
  const [mensajes, setMensajes] = useState([])
  const [nuevoMensaje, setNuevoMensaje] = useState("")
  const [cargando, setCargando] = useState(true)
  const [cargandoContacto, setCargandoContacto] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
  const mensajesFinRef = useRef(null)
  const mensajesContenedorRef = useRef(null)

  // Cargar conversaciones al iniciar
  useEffect(() => {
    const inicializar = async () => {
      if (status === "loading") return

      if (session?.user?.email) {
        try {
          await cargarConversaciones()

          // Si hay un parámetro de contacto, cargar ese contacto
          if (contactoParam) {
            await cargarContacto(contactoParam)
          }
        } catch (err) {
          setError("Error al cargar las conversaciones. Por favor, intenta de nuevo más tarde.")
          console.error("Error al inicializar:", err)
        }
      }
    }

    inicializar()

    // Actualizar mensajes cada 10 segundos si hay un contacto seleccionado
    const intervalo = setInterval(() => {
      if (session?.user?.email && contactoSeleccionado) {
        cargarMensajes(contactoSeleccionado.email)
      }
    }, 10000)

    return () => clearInterval(intervalo)
  }, [session, status, contactoParam])

  // Cargar mensajes cuando se selecciona un contacto
  useEffect(() => {
    if (session?.user?.email && contactoSeleccionado) {
      cargarMensajes(contactoSeleccionado.email)
    }
  }, [contactoSeleccionado, session])

  // Desplazar al último mensaje cuando se cargan nuevos mensajes
  useEffect(() => {
    if (mensajesFinRef.current) {
      mensajesFinRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [mensajes])

  // Cargar contacto por email
  const cargarContacto = async (contactoEmail) => {
    if (!contactoEmail) return

    try {
      setCargandoContacto(true)
      const usuario = await obtenerUsuarioPorEmail(contactoEmail)

      if (usuario) {
        setContactoSeleccionado({
          id: usuario.id,
          nombre: usuario.nombre || contactoEmail.split("@")[0] || "Usuario",
          email: usuario.email || contactoEmail,
        })
      } else {
        // Si no se encuentra el usuario, buscar en las conversaciones existentes
        const contactoEncontrado = conversaciones.find((c) => c.email === contactoEmail)
        if (contactoEncontrado) {
          setContactoSeleccionado(contactoEncontrado)
        } else {
          // Si no se encuentra en las conversaciones, crear un contacto básico
          setContactoSeleccionado({
            id: null,
            nombre: contactoEmail.split("@")[0] || "Usuario",
            email: contactoEmail,
          })
        }
      }

      // Si hay un parámetro de libro, configurar mensaje inicial
      if (libroParam) {
        setNuevoMensaje(`Hola, estoy interesado en tu libro "${libroParam}". ¿Podríamos hablar sobre él?`)
      }
    } catch (error) {
      console.error("Error al cargar contacto:", error)
      setError("Error al cargar el contacto. Por favor, intenta de nuevo.")
    } finally {
      setCargandoContacto(false)
    }
  }

  // Cargar conversaciones
  const cargarConversaciones = async () => {
    if (!session?.user?.email) return

    try {
      setCargando(true)
      const conversacionesData = await obtenerConversaciones(session.user.email)

      // Ordenar por fecha más reciente
      const conversacionesOrdenadas = conversacionesData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

      setConversaciones(conversacionesOrdenadas)
    } catch (error) {
      console.error("Error al cargar conversaciones:", error)
      setError("Error al cargar las conversaciones. Por favor, intenta de nuevo.")
    } finally {
      setCargando(false)
    }
  }

  // Cargar mensajes de un contacto
  const cargarMensajes = async (contactoEmail) => {
    if (!session?.user?.email || !contactoEmail) return

    try {
      const data = await obtenerMensajes(session.user.email, contactoEmail)
      setMensajes(data)

      // Marcar mensajes como leídos
      const mensajesNoLeidos = data.filter((m) => m.destinatario_id === session.user.email && !m.leido).map((m) => m.id)

      if (mensajesNoLeidos.length > 0) {
        await marcarComoLeidos(mensajesNoLeidos)

        // Actualizar el contador de no leídos en las conversaciones
        setConversaciones((prevConversaciones) =>
          prevConversaciones.map((conv) => (conv.email === contactoEmail ? { ...conv, noLeidos: 0 } : conv)),
        )
      }
    } catch (error) {
      console.error("Error al cargar mensajes:", error)
      setError("Error al cargar los mensajes. Por favor, intenta de nuevo.")
    }
  }

  // Enviar un nuevo mensaje
  const handleEnviarMensaje = async (e) => {
    e.preventDefault()

    if (!nuevoMensaje.trim() || !contactoSeleccionado || !session?.user?.email) return

    try {
      setEnviando(true)
      await enviarMensaje(session.user.email, contactoSeleccionado.email, nuevoMensaje)
      setNuevoMensaje("")
      await cargarMensajes(contactoSeleccionado.email)
      await cargarConversaciones() // Actualizar la lista de conversaciones
    } catch (error) {
      console.error("Error al enviar mensaje:", error)
      setError("Error al enviar el mensaje. Por favor, inténtalo de nuevo.")
    } finally {
      setEnviando(false)
    }
  }

  // Seleccionar un contacto
  const seleccionarContacto = (contacto) => {
    setContactoSeleccionado(contacto)
    setError(null) // Limpiar errores al cambiar de contacto
  }

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Formatear fecha corta (solo hora si es hoy, o fecha)
  const formatearFechaCorta = (fecha) => {
    const fechaMensaje = new Date(fecha)
    const hoy = new Date()

    // Si es hoy, mostrar solo la hora
    if (fechaMensaje.toDateString() === hoy.toDateString()) {
      return fechaMensaje.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    // Si es este año pero no hoy, mostrar día y mes
    if (fechaMensaje.getFullYear() === hoy.getFullYear()) {
      return fechaMensaje.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
      })
    }

    // Si es otro año, mostrar fecha completa
    return fechaMensaje.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (status === "loading") {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 col-xl-2 px-0">
            <SideBar activeItem="mensajes" />
          </div>
          <div className="col-lg-9 col-xl-10">
            <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 col-xl-2 px-0">
            <SideBar activeItem="mensajes" />
          </div>
          <div className="col-lg-9 col-xl-10">
            <div className="alert alert-warning">Debes iniciar sesión para ver tus mensajes.</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-3 col-xl-2 px-0">
          <SideBar activeItem="mensajes" />
        </div>
        <div className="col-lg-9 col-xl-10 py-4">
          <div className="content-wrapper bg-white rounded-3 shadow-sm p-4">
            <h2 className="mb-4">Mensajes</h2>

            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {error}
                <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
              </div>
            )}

            <div className="row">
              {/* Lista de conversaciones */}
              <div className="col-md-4 mb-4 mb-md-0">
                <div className="card shadow-sm h-100">
                  <div className="card-header conversation-header py-3">
                    <h5 className="mb-0 text-white">Conversaciones</h5>
                  </div>
                  <div className="list-group list-group-flush overflow-auto" style={{ maxHeight: "600px" }}>
                    {cargando ? (
                      <div className="list-group-item text-center py-3">
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                      </div>
                    ) : conversaciones.length === 0 ? (
                      <div className="list-group-item text-center text-muted py-4">
                        <i className="bi bi-chat-left-text fs-1 mb-2"></i>
                        <p>No tienes conversaciones activas</p>
                        <small>Cuando contactes con un vendedor, aparecerá aquí</small>
                      </div>
                    ) : (
                      conversaciones.map((contacto) => (
                        <button
                          key={contacto.email}
                          className={`list-group-item list-group-item-action d-flex align-items-center p-3 ${
                            contactoSeleccionado?.email === contacto.email ? "selected-conversation" : ""
                          }`}
                          onClick={() => seleccionarContacto(contacto)}
                        >
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar-placeholder rounded-circle bg-secondary text-white">
                              {contacto.nombre.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-grow-1 text-start overflow-hidden">
                            <div className="d-flex justify-content-between align-items-center w-100">
                              <h6 className="mb-0 text-truncate">{contacto.nombre}</h6>
                              <small className="text-muted ms-2 flex-shrink-0">
                                {formatearFechaCorta(contacto.fecha)}
                              </small>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <p className="text-truncate mb-0 small">{contacto.ultimoMensaje}</p>
                              {contacto.noLeidos > 0 && (
                                <span className="badge bg-danger rounded-pill ms-2">{contacto.noLeidos}</span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Área de chat */}
              <div className="col-md-8">
                <div className="card shadow-sm h-100">
                  {cargandoContacto ? (
                    <div className="card-body text-center p-5">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando contacto...</span>
                      </div>
                      <p className="mt-3">Cargando conversación...</p>
                    </div>
                  ) : contactoSeleccionado ? (
                    <>
                      <div className="card-header bg-light py-3">
                        <div className="d-flex align-items-center">
                          <div className="avatar-placeholder rounded-circle bg-secondary text-white me-3">
                            {contactoSeleccionado.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h5 className="mb-0">{contactoSeleccionado.nombre}</h5>
                            <small className="text-muted">{contactoSeleccionado.email}</small>
                          </div>
                        </div>
                      </div>

                      <div
                        className="card-body p-3 overflow-auto"
                        style={{ height: "500px" }}
                        ref={mensajesContenedorRef}
                      >
                        {mensajes.length === 0 ? (
                          <div className="text-center text-muted my-auto py-5">
                            <i className="bi bi-chat-dots fs-1 mb-3"></i>
                            <h5>No hay mensajes</h5>
                            <p>Envía un mensaje para iniciar la conversación</p>
                          </div>
                        ) : (
                          <div className="d-flex flex-column">
                            {mensajes.map((mensaje, index) => {
                              const esRemitente = mensaje.remitente_id === session.user.email
                              const esPrimerMensajeDelDia =
                                index === 0 ||
                                new Date(mensaje.fecha).toDateString() !==
                                  new Date(mensajes[index - 1].fecha).toDateString()

                              return (
                                <div key={mensaje.id} className="mb-3">
                                  {esPrimerMensajeDelDia && (
                                    <div className="text-center my-3">
                                      <span className="badge bg-light text-dark px-3 py-2">
                                        {new Date(mensaje.fecha).toLocaleDateString("es-ES", {
                                          weekday: "long",
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })}
                                      </span>
                                    </div>
                                  )}
                                  <div
                                    className={`d-flex ${
                                      esRemitente ? "justify-content-end" : "justify-content-start"
                                    }`}
                                  >
                                    <div
                                      className={`message-bubble p-3 rounded-3 ${
                                        esRemitente ? "bg-primary text-white" : "bg-light border"
                                      }`}
                                      style={{ maxWidth: "75%", position: "relative" }}
                                    >
                                      <div className="message-content">{mensaje.contenido}</div>
                                      <div
                                        className={`message-time small ${esRemitente ? "text-white-50" : "text-muted"}`}
                                        style={{ textAlign: "right", marginTop: "4px" }}
                                      >
                                        {new Date(mensaje.fecha).toLocaleTimeString("es-ES", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                        {esRemitente && (
                                          <i className={`bi bi-check${mensaje.leido ? "-all" : ""} ms-1`}></i>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                            <div ref={mensajesFinRef} />
                          </div>
                        )}
                      </div>

                      <div className="card-footer bg-white p-3">
                        <form onSubmit={handleEnviarMensaje} className="d-flex">
                          <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Escribe un mensaje..."
                            value={nuevoMensaje}
                            onChange={(e) => setNuevoMensaje(e.target.value)}
                            disabled={enviando}
                          />
                          <button
                            type="submit"
                            className="btn btn-primary px-4"
                            disabled={enviando || !nuevoMensaje.trim()}
                          >
                            {enviando ? (
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                            ) : (
                              <i className="bi bi-send"></i>
                            )}
                          </button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="card-body text-center p-5">
                      <div className="empty-state">
                        <i className="bi bi-chat-square-text fs-1 text-muted mb-3"></i>
                        <h4 className="text-muted">Selecciona una conversación</h4>
                        <p className="text-muted">O inicia una nueva desde la sección de libros</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .avatar-placeholder {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        
        .message-bubble {
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .content-wrapper {
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          padding: 2rem;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        .conversation-header {
          background: linear-gradient(135deg, #5a8c5a 0%, #3a6d7c 100%);
          border-bottom: none;
        }

        .selected-conversation {
          background-color: rgba(90, 140, 90, 0.1) !important;
          border-left: 3px solid #5a8c5a;
        }
      `}</style>
    </div>
  )
}