import { supabase } from "@/lib/supabase"

export const obtenerConversaciones = async (userEmail) => {
  try {
    const { data: mensajes, error } = await supabase
      .from("mensajes")
      .select("*")
      .or(`remitente_id.eq.${userEmail},destinatario_id.eq.${userEmail}`)
      .order("fecha", { ascending: false })

    if (error) throw error

    const contactosIds = new Set()
    mensajes.forEach((mensaje) => {
      if (mensaje.remitente_id === userEmail) {
        contactosIds.add(mensaje.destinatario_id)
      } else {
        contactosIds.add(mensaje.remitente_id)
      }
    })

    const { data: usuarios, error: errorUsuarios } = await supabase
      .from("usuarios")
      .select("id, nombre_usuario, correo_electronico")
      .in("correo_electronico", Array.from(contactosIds))

    if (errorUsuarios) throw errorUsuarios

    const usuariosMap = {}
    usuarios.forEach((usuario) => {
      usuariosMap[usuario.correo_electronico] = {
        id: usuario.id,
        nombre: usuario.nombre_usuario || "Usuario",
        email: usuario.correo_electronico,
      }
    })

    const contactosMap = new Map()

    mensajes.forEach((mensaje) => {
      const esRemitente = mensaje.remitente_id === userEmail
      const contactoEmail = esRemitente ? mensaje.destinatario_id : mensaje.remitente_id
      const contactoInfo = usuariosMap[contactoEmail] || {
        id: null,
        nombre: contactoEmail.split("@")[0] || "Usuario",
        email: contactoEmail,
      }

      const noLeido = !mensaje.leido && mensaje.destinatario_id === userEmail


      let contenidoMostrado = mensaje.contenido
      try {
        const contenidoJson = JSON.parse(mensaje.contenido)
        if (contenidoJson.tipo === "solicitud_intercambio") {
          contenidoMostrado = "Solicitud de intercambio enviada"
        } else if (contenidoJson.tipo === "respuesta_intercambio") {
          contenidoMostrado = contenidoJson.respuesta === "aceptada" ? "Intercambio aceptado" : "Intercambio rechazado"
        } else if (contenidoJson.tipo === "confirmacion_entrega") {
          contenidoMostrado = "Entrega confirmada"
        }
      } catch (e) {
      }

      if (!contactosMap.has(contactoEmail)) {
        contactosMap.set(contactoEmail, {
          id: contactoInfo.id,
          nombre: contactoInfo.nombre,
          email: contactoEmail,
          ultimoMensaje: contenidoMostrado,
          fecha: mensaje.fecha,
          noLeidos: noLeido ? 1 : 0,
        })
      } else {
        const contactoExistente = contactosMap.get(contactoEmail)
        if (new Date(mensaje.fecha) > new Date(contactoExistente.fecha)) {
          contactoExistente.ultimoMensaje = contenidoMostrado
          contactoExistente.fecha = mensaje.fecha
        }
        if (noLeido) {
          contactoExistente.noLeidos += 1
        }
      }
    })

    return Array.from(contactosMap.values())
  } catch (error) {
    throw error
  }
}
export const obtenerMensajes = async (usuarioEmail, contactoEmail) => {
  try {
    const { data, error } = await supabase
      .from("mensajes")
      .select("*")
      .or(
        `and(remitente_id.eq.${usuarioEmail},destinatario_id.eq.${contactoEmail}),` +
          `and(remitente_id.eq.${contactoEmail},destinatario_id.eq.${usuarioEmail})`,
      )
      .order("fecha", { ascending: true })

    if (error) throw error

    return data
  } catch (error) {
    throw error
  }
}

export const enviarMensaje = async (remitenteEmail, destinatarioEmail, contenido) => {
  try {
    if (!remitenteEmail) {
      throw new Error("Email de remitente no válido")
    }

    if (!destinatarioEmail) {
      throw new Error("Email de destinatario no válido")
    }

    const { data, error } = await supabase
      .from("mensajes")
      .insert({
        remitente_id: remitenteEmail,
        destinatario_id: destinatarioEmail,
        contenido,
        fecha: new Date().toISOString(),
        leido: false,
      })
      .select()

    if (error) throw error

    return data[0]
  } catch (error) {
    throw error
  }
}

export const marcarComoLeidos = async (mensajeIds) => {
  try {
    if (!mensajeIds || mensajeIds.length === 0) {
      return []
    }

    const { data, error } = await supabase.from("mensajes").update({ leido: true }).in("id", mensajeIds).select()

    if (error) throw error

    return data
  } catch (error) {
    throw error
  }
}

export const marcarTodosComoLeidos = async (userEmail) => {
  try {
    const { data, error } = await supabase
      .from("mensajes")
      .update({ leido: true })
      .eq("destinatario_id", userEmail)
      .eq("leido", false)
      .select()

    if (error) throw error

    return data
  } catch (error) {
    throw error
  }
}

export const obtenerUsuarioPorEmail = async (userEmail) => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nombre_usuario, correo_electronico")
      .eq("correo_electronico", userEmail)
      .single()

    if (error) throw error

    return {
      id: data.id,
      nombre: data.nombre_usuario || userEmail.split("@")[0],
      email: data.correo_electronico,
    }
  } catch (error) {

    return {
      id: null,
      nombre: userEmail.split("@")[0] || "Usuario",
      email: userEmail,
    }
  }
}
