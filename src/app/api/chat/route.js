import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request) {
  const { remitente_id, destinatario_id, contenido } = await request.json()

  if (!remitente_id || !destinatario_id || !contenido) {
    return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("mensajes")
    .insert([
      {
        remitente_id,
        destinatario_id,
        contenido,
        fecha: new Date().toISOString(),
      },
    ])
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ message: "Mensaje enviado con éxito", mensaje: data[0] }, { status: 201 })
}

export async function GET(request) {
  const url = new URL(request.url)
  const remitente_id = url.searchParams.get("remitente_id")
  const destinatario_id = url.searchParams.get("destinatario_id")

  let query = supabase.from("mensajes").select("*")

  if (remitente_id && destinatario_id) {
    query = query.or(
      `and(remitente_id.eq.${remitente_id},destinatario_id.eq.${destinatario_id}),and(remitente_id.eq.${destinatario_id},destinatario_id.eq.${remitente_id})`,
    )
  }

  const { data, error } = await query.order("fecha", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data, { status: 200 })
}
