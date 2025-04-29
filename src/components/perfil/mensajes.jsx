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
  obtenerUsuarioPorId,
} from "@/services/mensajesService"

export default function Mensajes() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const contactoParam = searchParams.get("contacto")

  const [conversaciones, setConversaciones] = useState([])
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null)
  const [mensajes, setMensajes] = useState([])
  const [nuevoMensaje, setNuevoMensaje] = useState("")
  const [cargando, setCargando] = useState(true)
  const [cargandoContacto, setCargandoContacto] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const mensajesFinRef = useRef(null)

  // Cargar conversaciones al iniciar
  useEffect(() => {
    const inicializar = async () => {
      if (status === "loading") return;
      
      if (session?.user?.id) {
        await cargarConversaciones();
        
        // Si hay un parámetro de contacto, cargar ese contacto
        if (contactoParam) {
          await cargarContacto(contactoParam);
        }
      }
    };
    
    inicializar();
    
    // Actualizar mensajes cada 10 segundos si hay un contacto seleccionado
    const intervalo = setInterval(() => {
      if (session?.user?.id && contactoSeleccionado) {
        cargarMensajes(contactoSeleccionado.id);
      }
    }, 10000);
    
    return () => clearInterval(intervalo);
  }, [session, status, contactoParam]);

  // Cargar mensajes cuando se selecciona un contacto
  useEffect(() => {
    if (session?.user?.id && contactoSeleccionado) {
      cargarMensajes(contactoSeleccionado.id);
    }
  }, [contactoSeleccionado, session]);

  // Desplazar al último mensaje cuando se cargan nuevos mensajes
  useEffect(() => {
    if (mensajesFinRef.current) {
      mensajesFinRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensajes]);

  // Cargar contacto por ID
  const cargarContacto = async (contactoId) => {
    if (!contactoId) return;
    
    try {
      setCargandoContacto(true);
      const usuario = await obtenerUsuarioPorId(contactoId);
      
      if (usuario) {
        setContactoSeleccionado({
          id: usuario.id,
          nombre: usuario.nombre || "Usuario",
          email: usuario.email || ""
        });
      }
    } catch (error) {
      console.log("Error al cargar contacto:", error);
    } finally {
      setCargandoContacto(false);
    }
  };

  // Cargar conversaciones
  const cargarConversaciones = async () => {
    if (!session?.user?.id) return;
    
    try {
      setCargando(true);
      const data = await obtenerConversaciones(session.user.id);

      // Agrupar mensajes por contacto
      const contactosMap = new Map();

      data.forEach((mensaje) => {
        const esRemitente = mensaje.remitente_id === session.user.id;
        const contactoId = esRemitente ? mensaje.destinatario_id : mensaje.remitente_id;
        const contacto = esRemitente ? mensaje.destinatario : mensaje.remitente;

        if (!contacto) return;

        if (!contactosMap.has(contactoId)) {
          contactosMap.set(contactoId, {
            id: contactoId,
            nombre: contacto.nombre || "Usuario",
            email: contacto.email || "",
            ultimoMensaje: mensaje.contenido,
            fecha: mensaje.fecha,
          });
        } else {
          const contactoExistente = contactosMap.get(contactoId);
          if (new Date(mensaje.fecha) > new Date(contactoExistente.fecha)) {
            contactoExistente.ultimoMensaje = mensaje.contenido;
            contactoExistente.fecha = mensaje.fecha;
          }
        }
      });

      setConversaciones(Array.from(contactosMap.values()));
    } catch (error) {
      console.log("Error al cargar conversaciones:", error);
    } finally {
      setCargando(false);
    }
  };

  // Cargar mensajes de un contacto
  const cargarMensajes = async (contactoId) => {
    if (!session?.user?.id || !contactoId) return;
    
    try {
      const data = await obtenerMensajes(session.user.id, contactoId);
      setMensajes(data);

      // Marcar mensajes como leídos
      const mensajesNoLeidos = data
        .filter((m) => m.destinatario_id === session.user.id && !m.leido)
        .map((m) => m.id);

      if (mensajesNoLeidos.length > 0) {
        await marcarComoLeidos(mensajesNoLeidos);
      }
    } catch (error) {
      console.log("Error al cargar mensajes:", error);
    }
  };

  // Enviar un nuevo mensaje
  const handleEnviarMensaje = async (e) => {
    e.preventDefault();

    if (!nuevoMensaje.trim() || !contactoSeleccionado || !session?.user?.id) return;

    try {
      setEnviando(true);
      await enviarMensaje(session.user.id, contactoSeleccionado.id, nuevoMensaje);
      setNuevoMensaje("");
      await cargarMensajes(contactoSeleccionado.id);
    } catch (error) {
      console.log("Error al enviar mensaje:", error);
      alert("Error al enviar el mensaje. Por favor, inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  // Seleccionar un contacto
  const seleccionarContacto = (contacto) => {
    setContactoSeleccionado(contacto);
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (status === "loading") {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-2 ps-0">
            <SideBar />
          </div>
          <div className="col-10">
            <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-2 ps-0">
            <SideBar />
          </div>
          <div className="col-10">
            <div className="alert alert-warning">
              Debes iniciar sesión para ver tus mensajes.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 ps-0">
          <SideBar />
        </div>
        <div className="col-10">
          <h2 className="mb-4">Mensajes</h2>

          <div className="row">
            {/* Lista de conversaciones */}
            <div className="col-md-4">
              <div className="card shadow">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Conversaciones</h5>
                </div>
                <div className="list-group list-group-flush" style={{ maxHeight: "600px", overflowY: "auto" }}>
                  {cargando ? (
                    <div className="list-group-item text-center py-3">
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                    </div>
                  ) : conversaciones.length === 0 ? (
                    <div className="list-group-item text-center text-muted py-3">No tienes conversaciones activas</div>
                  ) : (
                    conversaciones.map((contacto) => (
                      <button
                        key={contacto.id}
                        className={`list-group-item list-group-item-action ${
                          contactoSeleccionado?.id === contacto.id ? "active" : ""
                        }`}
                        onClick={() => seleccionarContacto(contacto)}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">{contacto.nombre}</h6>
                          <small>{new Date(contacto.fecha).toLocaleDateString()}</small>
                        </div>
                        <small className="text-truncate d-block">{contacto.ultimoMensaje}</small>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Área de chat */}
            <div className="col-md-8">
              <div className="card shadow">
                {cargandoContacto ? (
                  <div className="card-body text-center p-5">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Cargando contacto...</span>
                    </div>
                    <p className="mt-3">Cargando conversación...</p>
                  </div>
                ) : contactoSeleccionado ? (
                  <>
                    <div className="card-header bg-secondary text-white">
                      <h5 className="mb-0">{contactoSeleccionado.nombre}</h5>
                      <small>{contactoSeleccionado.email}</small>
                    </div>

                    <div
                      className="card-body p-3 d-flex flex-column overflow-auto"
                      style={{ height: "500px" }}
                      ref={mensajesFinRef}
                    >
                      {mensajes.length === 0 ? (
                        <div className="text-center text-muted my-auto">No hay mensajes. ¡Envía el primero!</div>
                      ) : (
                        mensajes.map((mensaje) => (
                          <div
                            key={mensaje.id}
                            className={`d-flex mb-2 ${
                              mensaje.remitente_id === session.user.id
                                ? "justify-content-end"
                                : "justify-content-start"
                            }`}
                          >
                            <div
                              className={`p-2 rounded-pill ${
                                mensaje.remitente_id === session.user.id
                                  ? "bg-primary text-white"
                                  : "bg-light text-dark"
                              }`}
                              style={{ maxWidth: "75%" }}
                            >
                              <div>{mensaje.contenido}</div>
                              <div className="text-end">
                                <small style={{ fontSize: "0.7rem" }}>{formatearFecha(mensaje.fecha)}</small>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="card-footer">
                      <form onSubmit={handleEnviarMensaje} className="d-flex">
                        <input
                          type="text"
                          className="form-control me-2"
                          placeholder="Escribe un mensaje..."
                          value={nuevoMensaje}
                          onChange={(e) => setNuevoMensaje(e.target.value)}
                          disabled={enviando}
                        />
                        <button type="submit" className="btn btn-primary" disabled={enviando || !nuevoMensaje.trim()}>
                          {enviando ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : (
                            "Enviar"
                          )}
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="card-body text-center p-5">
                    <h4 className="text-muted">Selecciona una conversación</h4>
                    <p>O inicia una nueva desde la sección de libros</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}