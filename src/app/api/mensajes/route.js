import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getServerSession } from "@/server/auth"

export async function GET(request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const url = new URL(request.url)
    const contactoId = url.searchParams.get("contactoId")

    if (!contactoId) {
      return NextResponse.json({ error: "Se requiere ID de contacto" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("mensajes")
      .select("*")
      .or(
        `and(remitente_id.eq.${session.user.id},destinatario_id.eq.${contactoId}),` +
          `and(remitente_id.eq.${contactoId},destinatario_id.eq.${session.user.id})`,
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


export async function POST(request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { destinatario_id, contenido } = await request.json()

    if (!destinatario_id || !contenido) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("mensajes")
      .insert({
        remitente_id: session.user.id,
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
