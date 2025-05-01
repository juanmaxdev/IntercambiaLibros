import { supabase } from "@/lib/supabase"

// Obtener conversaciones de un usuario
export const obtenerConversaciones = async (userEmail) => {
  try {
    // Obtener todos los mensajes donde el usuario es remitente o destinatario
    const { data: mensajes, error } = await supabase
      .from("mensajes")
      .select("*")
      .or(`remitente_id.eq.${userEmail},destinatario_id.eq.${userEmail}`)
      .order("fecha", { ascending: false })

    if (error) throw error

    // Obtener IDs únicos de todos los usuarios con los que se ha comunicado
    const contactosIds = new Set()
    mensajes.forEach((mensaje) => {
      if (mensaje.remitente_id === userEmail) {
        contactosIds.add(mensaje.destinatario_id)
      } else {
        contactosIds.add(mensaje.remitente_id)
      }
    })

    // Obtener información de todos los usuarios
    const { data: usuarios, error: errorUsuarios } = await supabase
      .from("usuarios")
      .select("id, nombre_usuario, correo_electronico")
      .in("correo_electronico", Array.from(contactosIds))

    if (errorUsuarios) throw errorUsuarios

    // Crear un mapa de correo electrónico a información de usuario
    const usuariosMap = {}
    usuarios.forEach((usuario) => {
      usuariosMap[usuario.correo_electronico] = {
        id: usuario.id,
        nombre: usuario.nombre_usuario || "Usuario",
        email: usuario.correo_electronico,
      }
    })

    // Agrupar mensajes por contacto
    const contactosMap = new Map()

    mensajes.forEach((mensaje) => {
      const esRemitente = mensaje.remitente_id === userEmail
      const contactoEmail = esRemitente ? mensaje.destinatario_id : mensaje.remitente_id
      const contactoInfo = usuariosMap[contactoEmail] || {
        id: null,
        nombre: contactoEmail.split("@")[0] || "Usuario",
        email: contactoEmail,
      }

      // Verificar si hay mensajes no leídos
      const noLeido = !mensaje.leido && mensaje.destinatario_id === userEmail

      if (!contactosMap.has(contactoEmail)) {
        contactosMap.set(contactoEmail, {
          id: contactoInfo.id,
          nombre: contactoInfo.nombre,
          email: contactoEmail,
          ultimoMensaje: mensaje.contenido,
          fecha: mensaje.fecha,
          noLeidos: noLeido ? 1 : 0,
        })
      } else {
        const contactoExistente = contactosMap.get(contactoEmail)
        if (new Date(mensaje.fecha) > new Date(contactoExistente.fecha)) {
          contactoExistente.ultimoMensaje = mensaje.contenido
          contactoExistente.fecha = mensaje.fecha
        }
        if (noLeido) {
          contactoExistente.noLeidos += 1
        }
      }
    })

    return Array.from(contactosMap.values())
  } catch (error) {
    console.log("Error al obtener conversaciones:", error)
    throw error
  }
}

// Obtener mensajes entre dos usuarios
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
    console.log("Error al obtener mensajes:", error)
    throw error
  }
}

// Enviar un mensaje
export const enviarMensaje = async (remitenteEmail, destinatarioEmail, contenido) => {
  try {
    // Verificar que los emails no sean nulos
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
    console.log("Error al enviar mensaje:", error)
    throw error
  }
}

// Marcar mensajes como leídos
export const marcarComoLeidos = async (mensajeIds) => {
  try {
    if (!mensajeIds || mensajeIds.length === 0) {
      return []
    }

    const { data, error } = await supabase.from("mensajes").update({ leido: true }).in("id", mensajeIds).select()

    if (error) throw error

    return data
  } catch (error) {
    console.log("Error al marcar mensajes como leídos:", error)
    throw error
  }
}

// Marcar todos los mensajes como leídos para un usuario
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
    console.log("Error al marcar todos los mensajes como leídos:", error)
    throw error
  }
}

// Obtener información de un usuario por email
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
    console.log("Error al obtener información del usuario:", error)

    // Si no se encuentra el usuario, devolver un objeto con la información básica
    return {
      id: null,
      nombre: userEmail.split("@")[0] || "Usuario",
      email: userEmail,
    }
  }
}
