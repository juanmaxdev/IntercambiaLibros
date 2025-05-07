import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getServerSession } from "@/server/auth"

export async function POST(request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { destinatario_id, libros_ofrecidos, libro_solicitado, mensaje } = await request.json()

    if (!destinatario_id || !libros_ofrecidos || libros_ofrecidos.length === 0) {
      return NextResponse.json({ error: "Datos de intercambio incompletos" }, { status: 400 })
    }

    // Obtener el ID del usuario remitente
    const { data: usuario, error: errorUsuario } = await supabase
      .from("usuarios")
      .select("id")
      .eq("correo_electronico", session.user.email)
      .single()

    if (errorUsuario) {
      return NextResponse.json({ error: errorUsuario.message }, { status: 500 })
    }

    // Obtener el ID del usuario destinatario
    const { data: destinatario, error: errorDestinatario } = await supabase
      .from("usuarios")
      .select("id")
      .eq("correo_electronico", destinatario_id)
      .single()

    if (errorDestinatario) {
      return NextResponse.json({ error: "Usuario destinatario no encontrado" }, { status: 404 })
    }

    // Crear el intercambio
    const { data, error } = await supabase
      .from("intercambios")
      .insert({
        usuario_id_ofrece: usuario.id,
        usuario_id_recibe: destinatario.id,
        usuario_ofrece_id_libro: libros_ofrecidos[0], // Por ahora solo usamos el primer libro
        usuario_recibe_id_libro: libro_solicitado,
        estado: "pendiente",
        comentario: mensaje || "Solicitud de intercambio",
        confirmado_ofrece: false,
        confirmado_recibe: false,
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      mensaje: "Solicitud de intercambio enviada correctamente",
      intercambio: data[0],
    })
  } catch (error) {
    console.error("Error en POST /api/intercambios:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
