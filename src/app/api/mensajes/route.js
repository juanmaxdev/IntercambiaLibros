import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { auth } from "@/server/auth"

// Obtener mensajes
export async function GET(request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const url = new URL(request.url)
    const contactoId = url.searchParams.get("contactoId")

    if (!contactoId) {
      return NextResponse.json({ error: "Se requiere ID de contacto" }, { status: 400 })
    }

    // Buscar ID del usuario desde su correo electrónico
    const { data: remitente, error: errorRemitente } = await supabase
      .from("usuarios")
      .select("id")
      .eq("correo_electronico", session.user.email)
      .single()

    if (errorRemitente || !remitente?.id) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    const { data, error } = await supabase
      .from("mensajes")
      .select("*")
      .or(
        `and(remitente_id.eq.${remitente.id},destinatario_id.eq.${contactoId}),` +
          `and(remitente_id.eq.${contactoId},destinatario_id.eq.${remitente.id})`,
      )
      .order("fecha", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Enviar mensaje
export async function POST(request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { destinatario_id, contenido } = await request.json()

    if (!destinatario_id || !contenido) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    // Obtener el ID del usuario actual desde su correo
    const { data: remitente, error: errorRemitente } = await supabase
      .from("usuarios")
      .select("id")
      .eq("correo_electronico", session.user.email)
      .single()

    if (errorRemitente || !remitente?.id) {
      return NextResponse.json({ error: "Remitente no encontrado" }, { status: 404 })
    }

    const { data, error } = await supabase
      .from("mensajes")
      .insert({
        remitente_id: remitente.id,
        destinatario_id,
        contenido,
        fecha: new Date().toISOString(),
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ mensaje: data[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}