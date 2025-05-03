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

  const [showIntercambioModal, setShowIntercambioModal] = useState(false)
  const [librosUsuario, setLibrosUsuario] = useState([])
  const [librosSeleccionados, setLibrosSeleccionados] = useState([])
  const [cargandoLibros, setCargandoLibros] = useState(false)
  const [libroContacto, setLibroContacto] = useState(null)
  const [solicitudesIntercambio, setSolicitudesIntercambio] = useState([])

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

  // Cerrar la conversación actual
  const cerrarConversacion = () => {
    setContactoSeleccionado(null)
    setMensajes([])
    setError(null)
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

  // Función para abrir el modal de solicitud de intercambio
  const handleSolicitarIntercambio = async () => {
    if (!session?.user?.email) return

    try {
      setCargandoLibros(true)
      // Obtener los libros del usuario actual
      const response = await fetch("/api/libros/usuario", {
        method: "GET",
        headers: {
          correo_electronico: session.user.email,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLibrosUsuario(data)

        // Si no tiene libros, mostrar el modal con mensaje
        setShowIntercambioModal(true)
      } else {
        setError("Error al obtener tus libros. Por favor, intenta de nuevo.")
      }
    } catch (error) {
      console.error("Error al cargar libros:", error)
      setError("Error al cargar tus libros. Por favor, intenta de nuevo.")
    } finally {
      setCargandoLibros(false)
    }
  }

  // Función para manejar la selección de libros
  const handleSeleccionLibro = (libro) => {
    setLibrosSeleccionados((prevSelected) => {
      const isSelected = prevSelected.some((item) => item.id === libro.id)

      if (isSelected) {
        return prevSelected.filter((item) => item.id !== libro.id)
      } else {
        return [...prevSelected, libro]
      }
    })
  }

  // Función para enviar la solicitud de intercambio
  const enviarSolicitudIntercambio = async () => {
    if (librosSeleccionados.length === 0) {
      setError("Debes seleccionar al menos un libro para el intercambio")
      return
    }

    try {
      setEnviando(true)

      // Obtener el libro del contacto si está disponible (desde el parámetro libroParam)
      let libroContactoId = null
      if (libroParam) {
        // Buscar el ID del libro por su título
        const responseLibro = await fetch(`/api/libros?titulo=${encodeURIComponent(libroParam)}`)
        if (responseLibro.ok) {
          const libros = await responseLibro.json()
          if (libros.length > 0) {
            libroContactoId = libros[0].id
          }
        }
      }

      // Registrar el intercambio en la base de datos
      const responseIntercambio = await fetch("/api/intercambios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destinatario_id: contactoSeleccionado.email,
          libros_ofrecidos: librosSeleccionados.map((libro) => libro.id),
          libro_solicitado: libroContactoId,
          mensaje: `Solicitud de intercambio de ${session.user.name || session.user.email}`,
        }),
      })

      if (!responseIntercambio.ok) {
        const errorData = await responseIntercambio.json()
        throw new Error(errorData.error || "Error al registrar el intercambio")
      }

      const intercambioData = await responseIntercambio.json()

      // Crear el mensaje especial de solicitud de intercambio
      const mensajeIntercambio = {
        tipo: "solicitud_intercambio",
        intercambio_id: intercambioData.intercambio.id,
        libros_ofrecidos: librosSeleccionados.map((libro) => ({
          id: libro.id,
          titulo: libro.titulo,
          autor: libro.autor,
          imagen: libro.imagenes,
        })),
        libro_solicitado: libroContactoId
          ? {
              id: libroContactoId,
              titulo: libroParam,
            }
          : null,
        estado: "pendiente",
      }

      // Enviar el mensaje como JSON
      await enviarMensaje(session.user.email, contactoSeleccionado.email, JSON.stringify(mensajeIntercambio))
      console.log("Mensaje de intercambio enviado y datos:", mensajeIntercambio, session.user.email, contactoSeleccionado.email)

      // Actualizar la interfaz
      setShowIntercambioModal(false)
      setLibrosSeleccionados([])
      await cargarMensajes(contactoSeleccionado.email)
      await cargarConversaciones()
    } catch (error) {
      console.error("Error al enviar solicitud de intercambio:", error)
      setError("Error al enviar la solicitud de intercambio. Por favor, intenta de nuevo.")
    } finally {
      setEnviando(false)
    }
  }

  // Función para responder a una solicitud de intercambio
  const responderSolicitudIntercambio = async (mensajeId, respuesta, intercambioId) => {
    try {
      setEnviando(true)

      // Actualizar el estado del intercambio en la base de datos
      const responseIntercambio = await fetch("/api/intercambios", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: intercambioId,
          estado: respuesta === "aceptada" ? "pendiente_entrega" : "rechazado",
          comentario: respuesta === "aceptada" ? "Intercambio aceptado" : "Intercambio rechazado",
        }),
      })

      if (!responseIntercambio.ok) {
        const errorData = await responseIntercambio.json()
        throw new Error(errorData.error || "Error al actualizar el intercambio")
      }

      // Crear el mensaje de respuesta
      const mensajeRespuesta = {
        tipo: "respuesta_intercambio",
        solicitud_id: mensajeId,
        intercambio_id: intercambioId,
        respuesta: respuesta, // "aceptada" o "rechazada"
      }

      // Enviar el mensaje como JSON
      await enviarMensaje(session.user.email, contactoSeleccionado.email, JSON.stringify(mensajeRespuesta))

      // Actualizar la interfaz
      await cargarMensajes(contactoSeleccionado.email)
      await cargarConversaciones()
    } catch (error) {
      console.error("Error al responder a la solicitud:", error)
      setError("Error al responder a la solicitud. Por favor, intenta de nuevo.")
    } finally {
      setEnviando(false)
    }
  }

  // Función para confirmar la entrega de un intercambio
  const confirmarEntregaIntercambio = async (intercambioId) => {
    try {
      setEnviando(true)

      // Actualizar el estado del intercambio en la base de datos
      const responseIntercambio = await fetch("/api/intercambios/confirmar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intercambio_id: intercambioId,
          usuario_id: session.user.email,
        }),
      })

      if (!responseIntercambio.ok) {
        const errorData = await responseIntercambio.json()
        throw new Error(errorData.error || "Error al confirmar la entrega")
      }

      const data = await responseIntercambio.json()

      // Crear el mensaje de confirmación
      const mensajeConfirmacion = {
        tipo: "confirmacion_entrega",
        intercambio_id: intercambioId,
        estado: data.estado, // "completado" o "pendiente_confirmacion"
      }

      // Enviar el mensaje como JSON
      await enviarMensaje(session.user.email, contactoSeleccionado.email, JSON.stringify(mensajeConfirmacion))

      // Actualizar la interfaz
      await cargarMensajes(contactoSeleccionado.email)
      await cargarConversaciones()
    } catch (error) {
      console.error("Error al confirmar la entrega:", error)
      setError("Error al confirmar la entrega. Por favor, intenta de nuevo.")
    } finally {
      setEnviando(false)
    }
  }

  // Función para verificar si un mensaje es una solicitud de intercambio
  const esMensajeIntercambio = (mensaje) => {
    try {
      const contenido = JSON.parse(mensaje.contenido)
      return (
        contenido.tipo === "solicitud_intercambio" ||
        contenido.tipo === "respuesta_intercambio" ||
        contenido.tipo === "confirmacion_entrega"
      )
    } catch (e) {
      return false
    }
  }

  // Función para renderizar un mensaje de intercambio
  const renderizarMensajeIntercambio = (mensaje) => {
    try {
      const contenido = JSON.parse(mensaje.contenido)

      if (contenido.tipo === "solicitud_intercambio") {
        return (
          <div className="intercambio-solicitud p-3">
            <div className="mb-2 fw-bold">Solicitud de intercambio</div>
            <div className="mb-2">Libros ofrecidos:</div>
            <div className="libros-ofrecidos mb-3">
              {contenido.libros_ofrecidos.map((libro) => (
                <div key={libro.id} className="libro-item d-flex align-items-center mb-2">
                  <div className="libro-imagen me-2">
                    {libro.imagen ? (
                      <img
                        src={libro.imagen || "/placeholder.svg"}
                        alt={libro.titulo}
                        width="40"
                        height="60"
                        className="rounded"
                      />
                    ) : (
                      <div className="placeholder-imagen">📚</div>
                    )}
                  </div>
                  <div className="libro-info">
                    <div className="libro-titulo fw-semibold">{libro.titulo}</div>
                    <div className="libro-autor small">{libro.autor}</div>
                  </div>
                </div>
              ))}
            </div>

            {contenido.libro_solicitado && (
              <div className="mb-3">
                <div className="mb-2">A cambio de:</div>
                <div className="libro-item d-flex align-items-center">
                  <div className="libro-imagen me-2">
                    <div className="placeholder-imagen">📚</div>
                  </div>
                  <div className="libro-info">
                    <div className="libro-titulo fw-semibold">{contenido.libro_solicitado.titulo}</div>
                  </div>
                </div>
              </div>
            )}

            {mensaje.remitente_id !== session?.user?.email && contenido.estado === "pendiente" && (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => responderSolicitudIntercambio(mensaje.id, "aceptada", contenido.intercambio_id)}
                  disabled={enviando}
                >
                  Aceptar intercambio
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => responderSolicitudIntercambio(mensaje.id, "rechazada", contenido.intercambio_id)}
                  disabled={enviando}
                >
                  Rechazar
                </button>
              </div>
            )}

            {contenido.estado === "pendiente_entrega" && (
              <div className="mt-3">
                <div className="alert alert-info mb-2">
                  <i className="bi bi-info-circle me-2"></i>
                  Intercambio aceptado. Coordina la entrega con el otro usuario.
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => confirmarEntregaIntercambio(contenido.intercambio_id)}
                  disabled={enviando}
                >
                  Confirmar entrega completada
                </button>
              </div>
            )}

            {contenido.estado === "completado" && (
              <div className="alert alert-success mt-3">
                <i className="bi bi-check-circle me-2"></i>
                Intercambio completado exitosamente
              </div>
            )}

            {contenido.estado === "rechazado" && (
              <div className="alert alert-danger mt-3">
                <i className="bi bi-x-circle me-2"></i>
                Intercambio rechazado
              </div>
            )}
          </div>
        )
      } else if (contenido.tipo === "respuesta_intercambio") {
        return (
          <div
            className={`intercambio-respuesta p-2 ${contenido.respuesta === "aceptada" ? "bg-success-subtle" : "bg-danger-subtle"} rounded`}
          >
            <div className="fw-bold">
              {contenido.respuesta === "aceptada" ? "¡Intercambio aceptado!" : "Intercambio rechazado"}
            </div>
            <div className="small">
              {contenido.respuesta === "aceptada"
                ? "Puedes contactar para coordinar la entrega."
                : "Puedes intentar con otros libros."}
            </div>
          </div>
        )
      } else if (contenido.tipo === "confirmacion_entrega") {
        return (
          <div className="intercambio-confirmacion p-2 bg-success-subtle rounded">
            <div className="fw-bold">
              <i className="bi bi-check-circle-fill me-2 text-success"></i>
              Entrega confirmada
            </div>
            <div className="small">
              {mensaje.remitente_id === session?.user?.email
                ? "Has confirmado la entrega del libro."
                : "El otro usuario ha confirmado la entrega del libro."}
            </div>
          </div>
        )
      }
    } catch (e) {
      return mensaje.contenido
    }
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
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div className="d-flex align-items-center">
                            <div className="avatar-placeholder rounded-circle bg-secondary text-white me-3">
                              {contactoSeleccionado.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h5 className="mb-0">{contactoSeleccionado.nombre}</h5>
                              <small className="text-muted">{contactoSeleccionado.email}</small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-outline-primary btn-sm me-2"
                              onClick={() => handleSolicitarIntercambio()}
                            >
                              <i className="bi bi-arrow-left-right me-1"></i>
                              Solicitar intercambio
                            </button>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={cerrarConversacion}
                              title="Cerrar conversación"
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
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
                                      <div className="message-content">
                                        {esMensajeIntercambio(mensaje)
                                          ? renderizarMensajeIntercambio(mensaje)
                                          : mensaje.contenido}
                                      </div>
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

      {/* Modal de solicitud de intercambio */}
      {showIntercambioModal && (
        <div className="modal-backdrop" style={{ display: "block" }}>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Solicitar intercambio</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowIntercambioModal(false)
                      setLibrosSeleccionados([])
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  {cargandoLibros ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                      <p className="mt-3">Cargando tus libros...</p>
                    </div>
                  ) : librosUsuario.length === 0 ? (
                    <div className="text-center py-4">
                      <div className="alert alert-warning">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        No tienes libros disponibles para intercambio
                      </div>
                      <p>Debes subir al menos un libro para poder solicitar un intercambio.</p>
                      <a href="/subirLibro" className="btn btn-primary mt-2">
                        <i className="bi bi-plus-lg me-2"></i>
                        Subir un libro
                      </a>
                    </div>
                  ) : (
                    <>
                      <p>Selecciona los libros que deseas ofrecer para el intercambio:</p>
                      <div className="row row-cols-1 row-cols-md-3 g-4 mt-2">
                        {librosUsuario.map((libro) => (
                          <div className="col" key={libro.id}>
                            <div
                              className={`card h-100 ${librosSeleccionados.some((l) => l.id === libro.id) ? "border-primary" : ""}`}
                              onClick={() => handleSeleccionLibro(libro)}
                              style={{ cursor: "pointer" }}
                            >
                              <div className="card-img-top text-center pt-3">
                                {libro.imagenes ? (
                                  <img
                                    src={libro.imagenes || "/placeholder.svg"}
                                    alt={libro.titulo}
                                    style={{ height: "150px", objectFit: "contain" }}
                                  />
                                ) : (
                                  <div className="placeholder-image" style={{ height: "150px" }}>
                                    <i className="bi bi-book fs-1"></i>
                                  </div>
                                )}
                              </div>
                              <div className="card-body">
                                <h6 className="card-title text-truncate" title={libro.titulo}>
                                  {libro.titulo}
                                </h6>
                                <p className="card-text small text-truncate" title={libro.autor}>
                                  {libro.autor}
                                </p>
                              </div>
                              <div className="card-footer bg-transparent">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={librosSeleccionados.some((l) => l.id === libro.id)}
                                    onChange={() => handleSeleccionLibro(libro)}
                                  />
                                  <label className="form-check-label">Seleccionar</label>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowIntercambioModal(false)
                      setLibrosSeleccionados([])
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={librosSeleccionados.length === 0 || enviando || librosUsuario.length === 0}
                    onClick={enviarSolicitudIntercambio}
                  >
                    {enviando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Enviando...
                      </>
                    ) : (
                      <>Solicitar intercambio</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
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

        .intercambio-solicitud {
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #dee2e6;
        }

        .placeholder-imagen {
          width: 40px;
          height: 60px;
          background-color: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }

        .libro-item {
          padding: 8px;
          border-radius: 6px;
          background-color: white;
          border: 1px solid #dee2e6;
        }

        .estado-intercambio {
          font-weight: 500;
          margin-top: 8px;
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1040;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1050;
          width: 100%;
          height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          outline: 0;
        }

        .modal-dialog {
          position: relative;
          width: auto;
          margin: 1.75rem auto;
          pointer-events: all;
        }
      `}</style>
    </div>
  )
}
