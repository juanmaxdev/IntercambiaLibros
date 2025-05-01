import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const details = searchParams.get("details") === "true"

    if (!email) {
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 })
    }

    // Obtener mensajes no leídos donde el usuario es destinatario
    const { data: mensajesNoLeidos, error } = await supabase
      .from("mensajes")
      .select("*")
      .eq("destinatario_id", email)
      .eq("leido", false)
      .order("fecha", { ascending: false })

    if (error) {
      console.error("Error al obtener mensajes no leídos:", error)
      return NextResponse.json({ error: "Error al obtener mensajes no leídos" }, { status: 500 })
    }

    // Si solo necesitamos el conteo
    if (!details) {
      return NextResponse.json({ unreadCount: mensajesNoLeidos.length })
    }

    // Si necesitamos detalles, obtener información de los remitentes
    const remitentesIds = [...new Set(mensajesNoLeidos.map((m) => m.remitente_id))]

    const usuariosInfo = {}

    if (remitentesIds.length > 0) {
      const { data: usuarios, error: errorUsuarios } = await supabase
        .from("usuarios")
        .select("id, nombre_usuario, correo_electronico")
        .in("correo_electronico", remitentesIds)

      if (!errorUsuarios && usuarios) {
        usuarios.forEach((usuario) => {
          usuariosInfo[usuario.correo_electronico] = {
            id: usuario.id,
            nombre: usuario.nombre_usuario || usuario.correo_electronico.split("@")[0],
          }
        })
      }
    }

    // Formatear notificaciones con información de remitentes
    const notifications = mensajesNoLeidos.map((mensaje) => ({
      id: mensaje.id,
      remitente: mensaje.remitente_id,
      nombreRemitente: usuariosInfo[mensaje.remitente_id]?.nombre || mensaje.remitente_id.split("@")[0],
      contenido: mensaje.contenido,
      fecha: mensaje.fecha,
      leido: mensaje.leido,
    }))

    return NextResponse.json({
      unreadCount: mensajesNoLeidos.length,
      notifications,
    })
  } catch (error) {
    console.error("Error en la API de notificaciones:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
