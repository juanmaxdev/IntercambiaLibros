import { supabase } from "@/lib/supabase"

// Obtener conversaciones de un usuario
export const obtenerConversaciones = async (userId) => {
  try {
    // Obtener mensajes donde el usuario es remitente o destinatario
    const { data, error } = await supabase
      .from("mensajes")
      .select(`
        id, 
        contenido, 
        fecha, 
        remitente_id, 
        destinatario_id, 
        remitente:remitente_id(id, nombre, email),
        destinatario:destinatario_id(id, nombre, email)
      `)
      .or(`remitente_id.eq.${userId},destinatario_id.eq.${userId}`)
      .order("fecha", { ascending: false })

    if (error) throw error

    return data
  } catch (error) {
    console.log("Error al obtener conversaciones:", error)
    throw error
  }
}

// Obtener mensajes entre dos usuarios
export const obtenerMensajes = async (usuarioId, contactoId) => {
  try {
    const { data, error } = await supabase
      .from("mensajes")
      .select("*")
      .or(
        `and(remitente_id.eq.${usuarioId},destinatario_id.eq.${contactoId}),` +
          `and(remitente_id.eq.${contactoId},destinatario_id.eq.${usuarioId})`,
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
export const enviarMensaje = async (remitenteId, destinatarioId, contenido) => {
  try {
    // Verificar que los IDs no sean nulos
    if (!remitenteId) {
      throw new Error("ID de remitente no válido")
    }
    
    if (!destinatarioId) {
      throw new Error("ID de destinatario no válido")
    }

    const { data, error } = await supabase
      .from("mensajes")
      .insert({
        remitente_id: remitenteId,
        destinatario_id: destinatarioId,
        contenido,
        fecha: new Date().toISOString(),
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
    const { data, error } = await supabase.from("mensajes").update({ leido: true }).in("id", mensajeIds).select()

    if (error) throw error

    return data
  } catch (error) {
    console.log("Error al marcar mensajes como leídos:", error)
    throw error
  }
}

// Obtener información de un usuario por ID
export const obtenerUsuarioPorId = async (userId) => {
  try {
    const { data, error } = await supabase.from("usuarios").select("id, nombre, email").eq("id", userId).single()

    if (error) throw error

    return data
  } catch (error) {
    console.log("Error al obtener información del usuario:", error)
    return null
  }
}