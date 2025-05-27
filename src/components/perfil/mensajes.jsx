"use client"
import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import "@/app/styles/perfil/mensajes.css"
import SideBar from "@components/perfil/sideBar"
import {
  obtenerConversaciones,
  obtenerMensajes,
  enviarMensaje,
  marcarComoLeidos,
  obtenerUsuarioPorEmail,
} from "@/services/mensajesService"
import { supabase } from "@/lib/supabase"

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
  const [librosContacto, setLibrosContacto] = useState([])
  const [libroContactoSeleccionado, setLibroContactoSeleccionado] = useState(null)

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

    // Actualizar mensajes cada minuto si hay un contacto seleccionado
    const intervalo = setInterval(() => {
      if (session?.user?.email && contactoSeleccionado) {
        cargarMensajes(contactoSeleccionado.email)
      }
    }, 60000) // Cambiado de 10000 a 60000 (1 minuto)

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

  // Cerrar una conversación específica
  const cerrarConversacionEspecifica = (email) => {
    // Si es la conversación actualmente seleccionada, la cerramos
    if (contactoSeleccionado?.email === email) {
      setContactoSeleccionado(null)
      setMensajes([])
    }

    // Actualizamos la lista de conversaciones
    setConversaciones((prevConversaciones) => prevConversaciones.filter((conv) => conv.email !== email))
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

      // Obtener los libros del contacto
      const responseContacto = await fetch("/api/libros/usuario", {
        method: "GET",
        headers: {
          correo_electronico: contactoSeleccionado.email,
        },
      })

      if (response.ok && responseContacto.ok) {
        const librosUsuarioData = await response.json()
        const librosContactoData = await responseContacto.json()

        // Filtrar libros que ya han sido intercambiados (si tienen esa propiedad)
        const librosUsuarioFiltrados = librosUsuarioData.filter(
          (libro) => !libro.estado_intercambio || libro.estado_intercambio !== "intercambiado",
        )

        const librosContactoFiltrados = librosContactoData.filter(
          (libro) => !libro.estado_intercambio || libro.estado_intercambio !== "intercambiado",
        )

        setLibrosUsuario(librosUsuarioFiltrados)

        // Si venimos de la página de un libro específico, buscar ese libro en los libros del contacto
        if (libroParam) {
          const libroEncontrado = librosContactoFiltrados.find((libro) => libro.titulo === libroParam)
          if (libroEncontrado) {
            setLibroContacto(libroEncontrado)
          }
        }

        // Guardar los libros del contacto para mostrarlos en el modal
        setLibrosContacto(librosContactoFiltrados)

        // Si no tiene libros, mostrar el modal con mensaje
        setShowIntercambioModal(true)
      } else {
        setError("Error al obtener los libros. Por favor, intenta de nuevo.")
      }
    } catch (error) {
      console.error("Error al cargar libros:", error)
      setError("Error al cargar los libros. Por favor, intenta de nuevo.")
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

  // Función para verificar si un texto es un mensaje de intercambio en formato JSON
  const esMensajeIntercambioTexto = (texto) => {
    try {
      const contenido = JSON.parse(texto)
      return (
        contenido.tipo === "solicitud_intercambio" ||
        contenido.tipo === "respuesta_intercambio" ||
        contenido.tipo === "confirmacion_entrega"
      )
    } catch (e) {
      return false
    }
  }

  // Función para manejar la selección del libro del contacto
  const handleSeleccionLibroContacto = (libro) => {
    setLibroContactoSeleccionado(libro)
  }

  // Función para enviar la solicitud de intercambio
  const enviarSolicitudIntercambio = async () => {
    if (librosSeleccionados.length === 0) {
      setError("Debes seleccionar al menos un libro para el intercambio")
      return
    }

    try {
      setEnviando(true)

      // Determinar qué libro del contacto se está solicitando
      let libroContactoId = null
      let libroContactoInfo = null

      if (libroContacto) {
        // Si venimos de la página de un libro específico
        libroContactoId = libroContacto.id
        libroContactoInfo = {
          id: libroContacto.id,
          titulo: libroContacto.titulo,
          autor: libroContacto.autor,
          imagen: libroContacto.imagenes,
        }
      } else if (libroContactoSeleccionado) {
        // Si se ha seleccionado un libro del contacto en el modal
        libroContactoId = libroContactoSeleccionado.id
        libroContactoInfo = {
          id: libroContactoSeleccionado.id,
          titulo: libroContactoSeleccionado.titulo,
          autor: libroContactoSeleccionado.autor,
          imagen: libroContactoSeleccionado.imagenes,
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
        libro_solicitado: libroContactoInfo,
        estado: "pendiente",
        yaRespondido: false,
      }

      // Enviar el mensaje como JSON
      await enviarMensaje(session.user.email, contactoSeleccionado.email, JSON.stringify(mensajeIntercambio))

      // Actualizar la interfaz
      setShowIntercambioModal(false)
      setLibrosSeleccionados([])
      setLibroContactoSeleccionado(null)
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

      // Verificar si el intercambio ya ha sido respondido
      const { data: intercambio, error: errorConsulta } = await supabase
        .from("intercambios")
        .select("estado")
        .eq("id", intercambioId)
        .single()

      if (errorConsulta) {
        throw new Error("Error al verificar el estado del intercambio")
      }

      // Si ya no está en estado pendiente, no permitir responder de nuevo
      if (intercambio.estado !== "pendiente") {
        setError("Este intercambio ya ha sido respondido anteriormente.")
        return
      }

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

      // Actualizar el mensaje original para marcar que ya ha sido respondido
      try {
        // Obtener el mensaje original
        const mensajeOriginal = mensajes.find((m) => m.id === mensajeId)
        if (mensajeOriginal) {
          const contenidoOriginal = JSON.parse(mensajeOriginal.contenido)
          contenidoOriginal.yaRespondido = true
          contenidoOriginal.estado = respuesta === "aceptada" ? "pendiente_entrega" : "rechazado"

          // Actualizar el mensaje en la base de datos
          await supabase
            .from("mensajes")
            .update({ contenido: JSON.stringify(contenidoOriginal) })
            .eq("id", mensajeId)
        }
      } catch (e) {
        console.error("Error al actualizar el mensaje original:", e)
      }
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
      // Verificar si el botón ya fue pulsado
      if (enviando) {
        return // Evitar múltiples clics
      }

      setEnviando(true)

      // Verificar si el intercambio ya ha sido confirmado por este usuario
      const { data: intercambioActual, error: errorConsulta } = await supabase
        .from("intercambios")
        .select("*")
        .eq("id", intercambioId)
        .single()

      if (errorConsulta) {
        throw new Error("Error al verificar el estado del intercambio")
      }

      // Verificar si el usuario ya confirmó
      const esUsuarioOfrece = intercambioActual.usuario_id_ofrece === session.user.id
      if (
        (esUsuarioOfrece && intercambioActual.confirmado_ofrece) ||
        (!esUsuarioOfrece && intercambioActual.confirmado_recibe)
      ) {
        setError("Ya has confirmado la entrega de este intercambio")
        setEnviando(false)
        return
      }

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
        timestamp: new Date().toISOString(), // Añadir timestamp para identificar el mensaje
      }

      // Enviar el mensaje como JSON
      await enviarMensaje(session.user.email, contactoSeleccionado.email, JSON.stringify(mensajeConfirmacion))

      // Actualizar la interfaz
      await cargarMensajes(contactoSeleccionado.email)
      await cargarConversaciones()

      // Mostrar mensaje de éxito
      setError(null)
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
            <div className="mb-2 fw-bold text-dark">
              <i className="bi bi-arrow-left-right me-2"></i>
              Solicitud de intercambio
            </div>

            <div className="mb-3">
              <div className="mb-2 text-dark fw-semibold">Libros ofrecidos:</div>
              <div className="row g-2">
                {contenido.libros_ofrecidos.map((libro) => (
                  <div key={libro.id} className="col-12 col-sm-6">
                    <div className="libro-item d-flex align-items-center p-2 border rounded">
                      <div className="libro-imagen me-2 flex-shrink-0">
                        {libro.imagen ? (
                          <img
                            src={libro.imagen || "/placeholder.svg"}
                            alt={libro.titulo}
                            width="40"
                            height="60"
                            className="rounded"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className="placeholder-imagen d-flex align-items-center justify-content-center bg-light rounded">
                            <i className="bi bi-book"></i>
                          </div>
                        )}
                      </div>
                      <div className="libro-info flex-grow-1 min-width-0">
                        <div className="libro-titulo fw-semibold text-dark text-truncate" title={libro.titulo}>
                          {libro.titulo}
                        </div>
                        <div className="libro-autor small text-secondary text-truncate" title={libro.autor}>
                          {libro.autor}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {contenido.libro_solicitado && (
              <div className="mb-3">
                <div className="mb-2 text-dark fw-semibold">A cambio de:</div>
                <div className="libro-item d-flex align-items-center p-2 border rounded">
                  <div className="libro-imagen me-2 flex-shrink-0">
                    {contenido.libro_solicitado.imagen ? (
                      <img
                        src={contenido.libro_solicitado.imagen || "/placeholder.svg"}
                        alt={contenido.libro_solicitado.titulo}
                        width="40"
                        height="60"
                        className="rounded"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="placeholder-imagen d-flex align-items-center justify-content-center bg-light rounded">
                        <i className="bi bi-book"></i>
                      </div>
                    )}
                  </div>
                  <div className="libro-info flex-grow-1 min-width-0">
                    <div
                      className="libro-titulo fw-semibold text-dark text-truncate"
                      title={contenido.libro_solicitado.titulo}
                    >
                      {contenido.libro_solicitado.titulo}
                    </div>
                    {contenido.libro_solicitado.autor && (
                      <div
                        className="libro-autor small text-secondary text-truncate"
                        title={contenido.libro_solicitado.autor}
                      >
                        {contenido.libro_solicitado.autor}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {mensaje.remitente_id !== session?.user?.email && contenido.estado === "pendiente" && (
              <div className="d-flex flex-column flex-sm-row gap-2">
                <button
                  className="btn btn-success btn-sm flex-fill"
                  onClick={() => responderSolicitudIntercambio(mensaje.id, "aceptada", contenido.intercambio_id)}
                  disabled={enviando || contenido.yaRespondido}
                >
                  <i className="bi bi-check-lg me-1"></i>
                  Aceptar
                </button>
                <button
                  className="btn btn-danger btn-sm flex-fill"
                  onClick={() => responderSolicitudIntercambio(mensaje.id, "rechazada", contenido.intercambio_id)}
                  disabled={enviando || contenido.yaRespondido}
                >
                  <i className="bi bi-x-lg me-1"></i>
                  Rechazar
                </button>
              </div>
            )}

            {contenido.estado === "pendiente_entrega" && (
              <div className="mt-3">
                <div className="alert alert-info mb-2">
                  <i className="bi bi-info-circle me-2"></i>
                  <span className="d-none d-sm-inline">
                    Intercambio aceptado. Coordina la entrega con el otro usuario.
                  </span>
                  <span className="d-sm-none">Intercambio aceptado. Coordina la entrega.</span>
                </div>
                <button
                  className="btn btn-primary btn-sm w-100 w-sm-auto"
                  onClick={() => confirmarEntregaIntercambio(contenido.intercambio_id)}
                  disabled={enviando || mensaje.yaConfirmado}
                >
                  {enviando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      <span className="d-none d-sm-inline">Confirmando...</span>
                      <span className="d-sm-none">...</span>
                    </>
                  ) : mensaje.yaConfirmado ? (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      <span className="d-none d-sm-inline">Entrega confirmada</span>
                      <span className="d-sm-none">Confirmada</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-square me-1"></i>
                      <span className="d-none d-sm-inline">Confirmar entrega completada</span>
                      <span className="d-sm-none">Confirmar entrega</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {contenido.estado === "completado" && (
              <div className="alert alert-success mt-3">
                <i className="bi bi-check-circle me-2"></i>
                <span className="d-none d-sm-inline">Intercambio completado exitosamente</span>
                <span className="d-sm-none">Intercambio completado</span>
              </div>
            )}

            {contenido.estado === "rechazado" && (
              <div className="alert alert-danger mt-3">
                <i className="bi bi-x-circle me-2"></i>
                <span className="d-none d-sm-inline">Intercambio rechazado</span>
                <span className="d-sm-none">Rechazado</span>
              </div>
            )}
          </div>
        )
      } else if (contenido.tipo === "respuesta_intercambio") {
        return (
          <div
            className={`intercambio-respuesta p-2 ${contenido.respuesta === "aceptada" ? "bg-success-subtle" : "bg-danger-subtle"} rounded`}
          >
            <div className="fw-bold text-dark">
              <i className={`bi ${contenido.respuesta === "aceptada" ? "bi-check-circle" : "bi-x-circle"} me-2`}></i>
              {contenido.respuesta === "aceptada" ? "¡Intercambio aceptado!" : "Intercambio rechazado"}
            </div>
            <div className="small text-dark">
              {contenido.respuesta === "aceptada"
                ? "Puedes contactar para coordinar la entrega."
                : "Puedes intentar con otros libros."}
            </div>
          </div>
        )
      } else if (contenido.tipo === "confirmacion_entrega") {
        return (
          <div className="intercambio-confirmacion p-2 bg-success-subtle rounded">
            <div className="fw-bold text-dark">
              <i className="bi bi-check-circle-fill me-2 text-success"></i>
              Entrega confirmada
            </div>
            <div className="small text-dark">
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
              <div className="col-lg-4 mb-4 mb-lg-0">
                <div className="card shadow-sm h-100">
                  <div className="card-header conversation-header py-3">
                    <h5 className="mb-0 text-white">
                      <i className="bi bi-chat-dots me-2"></i>
                      <span className="d-none d-sm-inline">Conversaciones</span>
                      <span className="d-sm-none">Chats</span>
                    </h5>
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
                        <p className="mb-1">No tienes conversaciones activas</p>
                        <small className="d-none d-sm-block">Cuando contactes con un vendedor, aparecerá aquí</small>
                        <small className="d-sm-none">Contacta con vendedores para empezar</small>
                      </div>
                    ) : (
                      conversaciones.map((contacto) => (
                        <div
                          key={contacto.email}
                          className={`list-group-item d-flex align-items-center p-3 ${
                            contactoSeleccionado?.email === contacto.email ? "selected-conversation" : ""
                          }`}
                        >
                          <button
                            className="flex-grow-1 d-flex align-items-center border-0 bg-transparent text-start p-0"
                            onClick={() => seleccionarContacto(contacto)}
                          >
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar-placeholder rounded-circle bg-secondary text-white" style={{ width: "40px", height: "40px" }}>
                                {contacto.nombre.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <div className="d-flex justify-content-between align-items-center w-100">
                                <h6 className="mb-0 text-truncate">{contacto.nombre}</h6>
                                <small className="text-muted ms-2 flex-shrink-0">
                                  {formatearFechaCorta(contacto.fecha)}
                                </small>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <p className="text-truncate mb-0 small">
                                  {esMensajeIntercambioTexto(contacto.ultimoMensaje)
                                    ? "Solicitud de intercambio"
                                    : contacto.ultimoMensaje}
                                </p>
                                {contacto.noLeidos > 0 && (
                                  <span className="badge bg-danger rounded-pill ms-2">{contacto.noLeidos}</span>
                                )}
                              </div>
                            </div>
                          </button>
                          <button
                            className="btn btn-sm text-muted ms-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              cerrarConversacionEspecifica(contacto.email)
                            }}
                            title="Cerrar conversación"
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Área de chat */}
              <div className="col-lg-8">
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
                            <div className="avatar-placeholder rounded-circle bg-secondary text-white me-3" style={{ width: "40px", height: "40px" }}>
                              {contactoSeleccionado.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-grow-1">
                              <h5 className="mb-0 text-truncate">{contactoSeleccionado.nombre}</h5>
                              <small className="text-muted text-truncate d-block">{contactoSeleccionado.email}</small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-2 flex-shrink-0">
                            <button
                              className="btn btn-outline-primary btn-sm d-none d-md-inline-flex"
                              onClick={() => handleSolicitarIntercambio()}
                              title="Solicitar intercambio"
                            >
                              <i className="bi bi-arrow-left-right me-1"></i>
                              Intercambio
                            </button>
                            <button
                              className="btn btn-outline-primary btn-sm d-md-none"
                              onClick={() => handleSolicitarIntercambio()}
                              title="Solicitar intercambio"
                            >
                              <i className="bi bi-arrow-left-right"></i>
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
                            <p className="d-none d-sm-block">Envía un mensaje para iniciar la conversación</p>
                            <p className="d-sm-none">Envía un mensaje para empezar</p>
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
                                        <span className="d-none d-sm-inline">
                                          {new Date(mensaje.fecha).toLocaleDateString("es-ES", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          })}
                                        </span>
                                        <span className="d-sm-none">
                                          {new Date(mensaje.fecha).toLocaleDateString("es-ES", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                          })}
                                        </span>
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
                                      style={{ maxWidth: "85%", position: "relative" }}
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
                        <form onSubmit={handleEnviarMensaje} className="d-flex gap-2">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Escribe un mensaje..."
                            value={nuevoMensaje}
                            onChange={(e) => setNuevoMensaje(e.target.value)}
                            disabled={enviando}
                          />
                          <button
                            type="submit"
                            className="btn btn-primary px-3 flex-shrink-0"
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
                        <p className="text-muted d-none d-sm-block">O inicia una nueva desde la sección de libros</p>
                        <p className="text-muted d-sm-none">Inicia una nueva desde libros</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de solicitud de intercambio - Responsive */}
      {showIntercambioModal && (
        <div className="modal-backdrop" style={{ display: "block" }}>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-arrow-left-right me-2"></i>
                    <span className="d-none d-sm-inline">Solicitar intercambio</span>
                    <span className="d-sm-none">Intercambio</span>
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowIntercambioModal(false)
                      setLibrosSeleccionados([])
                      setLibroContactoSeleccionado(null)
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
                      <div className="row">
                        <div className="col-12 col-lg-6 mb-4 mb-lg-0">
                          <h6 className="mb-3">
                            <i className="bi bi-book me-2"></i>
                            <span className="d-none d-sm-inline">Selecciona los libros que deseas ofrecer:</span>
                            <span className="d-sm-none">Tus libros:</span>
                          </h6>
                          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-1 row-cols-xl-2 g-2">
                            {librosUsuario.map((libro) => (
                              <div className="col" key={libro.id}>
                                <div
                                  className={`card h-100 ${librosSeleccionados.some((l) => l.id === libro.id) ? "border-primary" : ""}`}
                                  onClick={() => handleSeleccionLibro(libro)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <div className="card-img-top text-center pt-2">
                                    {libro.imagenes ? (
                                      <img
                                        src={libro.imagenes || "/placeholder.svg"}
                                        alt={libro.titulo}
                                        style={{ height: "100px", objectFit: "contain" }}
                                      />
                                    ) : (
                                      <div className="placeholder-image" style={{ height: "100px" }}>
                                        <i className="bi bi-book fs-1"></i>
                                      </div>
                                    )}
                                  </div>
                                  <div className="card-body py-2">
                                    <h6 className="card-title text-truncate small" title={libro.titulo}>
                                      {libro.titulo}
                                    </h6>
                                    <p className="card-text small text-truncate text-muted" title={libro.autor}>
                                      {libro.autor}
                                    </p>
                                  </div>
                                  <div className="card-footer bg-transparent py-2">
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={librosSeleccionados.some((l) => l.id === libro.id)}
                                        onChange={() => handleSeleccionLibro(libro)}
                                      />
                                      <label className="form-check-label small">Seleccionar</label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="col-12 col-lg-6">
                          {libroContacto ? (
                            // Si venimos de la página de un libro específico, mostrar solo ese libro
                            <div>
                              <h6 className="mb-3">
                                <i className="bi bi-arrow-down-circle me-2"></i>
                                <span className="d-none d-sm-inline">Libro que deseas recibir:</span>
                                <span className="d-sm-none">A recibir:</span>
                              </h6>
                              <div className="card mb-3">
                                <div className="row g-0">
                                  <div className="col-4">
                                    {libroContacto.imagenes ? (
                                      <img
                                        src={libroContacto.imagenes || "/placeholder.svg"}
                                        alt={libroContacto.titulo}
                                        className="img-fluid rounded-start"
                                        style={{ height: "100%", objectFit: "cover" }}
                                      />
                                    ) : (
                                      <div className="placeholder-image h-100 d-flex align-items-center justify-content-center bg-light">
                                        <i className="bi bi-book fs-1"></i>
                                      </div>
                                    )}
                                  </div>
                                  <div className="col-8">
                                    <div className="card-body">
                                      <h5 className="card-title">{libroContacto.titulo}</h5>
                                      <p className="card-text">{libroContacto.autor}</p>
                                      <p className="card-text">
                                        <small className="text-muted">
                                          <span className="d-none d-sm-inline">
                                            Este es el libro que has seleccionado previamente
                                          </span>
                                          <span className="d-sm-none">Libro seleccionado</span>
                                        </small>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : librosContacto && librosContacto.length > 0 ? (
                            // Si no venimos de un libro específico, mostrar todos los libros del contacto
                            <div>
                              <h6 className="mb-3">
                                <i className="bi bi-arrow-down-circle me-2"></i>
                                <span className="d-none d-sm-inline">Selecciona el libro que deseas recibir:</span>
                                <span className="d-sm-none">A recibir:</span>
                              </h6>
                              <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-1 row-cols-xl-2 g-2">
                                {librosContacto.map((libro) => (
                                  <div className="col" key={libro.id}>
                                    <div
                                      className={`card h-100 ${libroContactoSeleccionado?.id === libro.id ? "border-success" : ""}`}
                                      onClick={() => handleSeleccionLibroContacto(libro)}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <div className="card-img-top text-center pt-2">
                                        {libro.imagenes ? (
                                          <img
                                            src={libro.imagenes || "/placeholder.svg"}
                                            alt={libro.titulo}
                                            style={{ height: "100px", objectFit: "contain" }}
                                          />
                                        ) : (
                                          <div className="placeholder-image" style={{ height: "100px" }}>
                                            <i className="bi bi-book fs-1"></i>
                                          </div>
                                        )}
                                      </div>
                                      <div className="card-body py-2">
                                        <h6 className="card-title text-truncate small" title={libro.titulo}>
                                          {libro.titulo}
                                        </h6>
                                        <p className="card-text small text-truncate text-muted" title={libro.autor}>
                                          {libro.autor}
                                        </p>
                                      </div>
                                      <div className="card-footer bg-transparent py-2">
                                        <div className="form-check">
                                          <input
                                            className="form-check-input"
                                            type="radio"
                                            name="libroContacto"
                                            checked={libroContactoSeleccionado?.id === libro.id}
                                            onChange={() => handleSeleccionLibroContacto(libro)}
                                          />
                                          <label className="form-check-label small">Seleccionar</label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="alert alert-info">
                              <i className="bi bi-info-circle me-2"></i>
                              <span className="d-none d-sm-inline">
                                El otro usuario no tiene libros disponibles para intercambio.
                              </span>
                              <span className="d-sm-none">Sin libros disponibles para intercambio.</span>
                            </div>
                          )}
                        </div>
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
                      setLibroContactoSeleccionado(null)
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={
                      librosSeleccionados.length === 0 ||
                      enviando ||
                      librosUsuario.length === 0 ||
                      (!libroContacto && !libroContactoSeleccionado && librosContacto && librosContacto.length > 0)
                    }
                    onClick={enviarSolicitudIntercambio}
                  >
                    {enviando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <span className="d-none d-sm-inline">Enviando...</span>
                        <span className="d-sm-none">...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-1"></i>
                        <span className="d-none d-sm-inline">Solicitar intercambio</span>
                        <span className="d-sm-none">Solicitar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
