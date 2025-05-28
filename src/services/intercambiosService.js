import { supabase } from "@/lib/supabase"

export const obtenerIntercambios = async (userEmail, estado = null) => {
  try {
    const { data: usuario, error: errorUsuario } = await supabase
      .from("usuarios")
      .select("id")
      .eq("correo_electronico", userEmail)
      .single()

    if (errorUsuario) throw errorUsuario

    let query = supabase
      .from("intercambios")
      .select(`
        *,
        usuario_ofrece:usuario_id_ofrece(id, nombre_usuario, correo_electronico),
        usuario_recibe:usuario_id_recibe(id, nombre_usuario, correo_electronico),
        libro_ofrece:usuario_ofrece_id_libro(id, titulo, autor, imagenes),
        libro_recibe:usuario_recibe_id_libro(id, titulo, autor, imagenes)
      `)
      .or(`usuario_id_ofrece.eq.${usuario.id},usuario_id_recibe.eq.${usuario.id}`)

    if (estado) {
      query = query.eq("estado", estado)
    }

    const { data, error } = await query.order("fecha_intercambio", { ascending: false })

    if (error) throw error

    return data
  } catch (error) {
    throw error
  }
}

export const crearSolicitudIntercambio = async (
  remitenteEmail,
  destinatarioEmail,
  librosOfrecidos,
  libroSolicitado = null,
  mensaje = "",
) => {
  try {
    const { data: remitente, error: errorRemitente } = await supabase
      .from("usuarios")
      .select("id")
      .eq("correo_electronico", remitenteEmail)
      .single()

    if (errorRemitente) throw errorRemitente

    const { data: destinatario, error: errorDestinatario } = await supabase
      .from("usuarios")
      .select("id")
      .eq("correo_electronico", destinatarioEmail)
      .single()

    if (errorDestinatario) throw errorDestinatario

    // Crear el intercambio
    const { data, error } = await supabase
      .from("intercambios")
      .insert({
        usuario_id_ofrece: remitente.id,
        usuario_id_recibe: destinatario.id,
        usuario_ofrece_id_libro: librosOfrecidos[0], 
        usuario_recibe_id_libro: libroSolicitado,
        estado: "pendiente",
        comentario: mensaje,
        confirmado_ofrece: false,
        confirmado_recibe: false,
      })
      .select()

    if (error) throw error

    return data[0]
  } catch (error) {
    throw error
  }
}

export const responderSolicitudIntercambio = async (intercambioId, respuesta, comentario = "") => {
  try {
    const { data, error } = await supabase
      .from("intercambios")
      .update({
        estado: respuesta === "aceptada" ? "pendiente_entrega" : "rechazado",
        comentario: comentario || (respuesta === "aceptada" ? "Intercambio aceptado" : "Intercambio rechazado"),
      })
      .eq("id", intercambioId)
      .select()

    if (error) throw error

    return data[0]
  } catch (error) {
    throw error
  }
}

export const confirmarEntregaIntercambio = async (intercambioId, usuarioEmail) => {
  try {
    const { data: usuario, error: errorUsuario } = await supabase
      .from("usuarios")
      .select("id")
      .eq("correo_electronico", usuarioEmail)
      .single()

    if (errorUsuario) throw errorUsuario

    const { data: intercambio, error: errorIntercambio } = await supabase
      .from("intercambios")
      .select("*")
      .eq("id", intercambioId)
      .single()

    if (errorIntercambio) throw errorIntercambio

    const updateData = {}
    let nuevoEstado = "pendiente_confirmacion"

    if (intercambio.usuario_id_ofrece === usuario.id) {
      updateData.confirmado_ofrece = true
    } else {
      updateData.confirmado_recibe = true
    }

    if (
      (intercambio.confirmado_ofrece && updateData.confirmado_recibe) ||
      (updateData.confirmado_ofrece && intercambio.confirmado_recibe)
    ) {
      updateData.estado = "completado"
      nuevoEstado = "completado"

      // Marcar los libros como intercambiados
      if (intercambio.usuario_ofrece_id_libro) {
        await supabase
          .from("libros")
          .update({ estado_intercambio: "intercambiado" })
          .eq("id", intercambio.usuario_ofrece_id_libro)
      }

      if (intercambio.usuario_recibe_id_libro) {
        await supabase
          .from("libros")
          .update({ estado_intercambio: "intercambiado" })
          .eq("id", intercambio.usuario_recibe_id_libro)
      }
    }

    // Actualizar el intercambio
    const { data, error } = await supabase.from("intercambios").update(updateData).eq("id", intercambioId).select()

    if (error) throw error

    return { intercambio: data[0], estado: nuevoEstado }
  } catch (error) {
    console.error("Error al confirmar entrega:", error)
    throw error
  }
}

export const obtenerDetallesIntercambio = async (intercambioId) => {
  try {
    const { data, error } = await supabase
      .from("intercambios")
      .select(`
        *,
        usuario_ofrece:usuario_id_ofrece(id, nombre_usuario, correo_electronico),
        usuario_recibe:usuario_id_recibe(id, nombre_usuario, correo_electronico),
        libro_ofrece:usuario_ofrece_id_libro(id, titulo, autor, imagenes),
        libro_recibe:usuario_recibe_id_libro(id, titulo, autor, imagenes)
      `)
      .eq("id", intercambioId)
      .single()

    if (error) throw error

    return data
  } catch (error) {
    throw error
  }
}
