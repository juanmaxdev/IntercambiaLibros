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
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    const { data: remitente, error: errorRemitente } = await supabase
      .from("usuarios")
      .select("id")
      .eq("correo_electronico", session.user.email)
      .single()

    if (errorRemitente) {
      return NextResponse.json({ error: errorRemitente.message }, { status: 500 })
    }

    const { data: destinatario, error: errorDestinatario } = await supabase
      .from("usuarios")
      .select("id")
      .eq("correo_electronico", destinatario_id)
      .single()

    if (errorDestinatario) {
      return NextResponse.json({ error: errorDestinatario.message }, { status: 500 })
    }

    const { data, error } = await supabase
      .from("intercambios")
      .insert({
        usuario_id_ofrece: remitente.id,
        usuario_id_recibe: destinatario.id,
        usuario_ofrece_id_libro: libros_ofrecidos[0], 
        usuario_recibe_id_libro: libro_solicitado || null,
        estado: "pendiente",
        comentario: mensaje || "Solicitud de intercambio",
        confirmado_ofrece: false,
        confirmado_recibe: false,
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ intercambio: data[0] }, { status: 201 })
  } catch (error) {
    console.error("Error en POST /api/intercambios:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { data: usuario, error: errorUsuario } = await supabase
      .from("usuarios")
      .select("id")
      .eq("correo_electronico", session.user.email)
      .single()

    if (errorUsuario) {
      return NextResponse.json({ error: errorUsuario.message }, { status: 500 })
    }

    const url = new URL(request.url)
    const estado = url.searchParams.get("estado")

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

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en GET /api/intercambios:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id, estado, comentario } = await request.json()

    if (!id || !estado) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    const { data: usuario, error: errorUsuario } = await supabase
      .from("usuarios")
      .select("id")
      .eq("correo_electronico", session.user.email)
      .single()

    if (errorUsuario) {
      return NextResponse.json({ error: errorUsuario.message }, { status: 500 })
    }

    const { data: intercambio, error: errorConsulta } = await supabase
      .from("intercambios")
      .select("*")
      .eq("id", id)
      .single()

    if (errorConsulta) {
      return NextResponse.json({ error: errorConsulta.message }, { status: 500 })
    }

    if (!intercambio) {
      return NextResponse.json({ error: "Intercambio no encontrado" }, { status: 404 })
    }

    if (intercambio.usuario_id_ofrece !== usuario.id && intercambio.usuario_id_recibe !== usuario.id) {
      return NextResponse.json({ error: "No autorizado para actualizar este intercambio" }, { status: 403 })
    }

    if (intercambio.estado !== "pendiente" && estado !== "completado") {
      return NextResponse.json(
        {
          error: "Este intercambio ya ha sido respondido anteriormente",
          intercambio: intercambio,
        },
        { status: 400 },
      )
    }

    const { data, error } = await supabase
      .from("intercambios")
      .update({
        estado: estado,
        comentario: comentario || intercambio.comentario,
      })
      .eq("id", id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (estado === "rechazado") {
      return NextResponse.json(data[0])
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error en PATCH /api/intercambios:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

