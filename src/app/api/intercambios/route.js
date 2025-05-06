import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getServerSession } from "@/server/auth"

export async function POST(request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { intercambio_id, usuario_id } = await request.json()

    if (!intercambio_id) {
      return NextResponse.json({ error: "ID de intercambio requerido" }, { status: 400 })
    }

    // Obtener el ID del usuario
    const { data: usuario, error: errorUsuario } = await supabase
      .from("usuarios")
      .select("id")
      .eq("correo_electronico", session.user.email)
      .single()

    if (errorUsuario) {
      return NextResponse.json({ error: errorUsuario.message }, { status: 500 })
    }

    // Obtener el intercambio
    const { data: intercambio, error: errorIntercambio } = await supabase
      .from("intercambios")
      .select("*")
      .eq("id", intercambio_id)
      .single()

    if (errorIntercambio) {
      return NextResponse.json({ error: errorIntercambio.message }, { status: 500 })
    }

    if (!intercambio) {
      return NextResponse.json({ error: "Intercambio no encontrado" }, { status: 404 })
    }

    // Verificar que el usuario sea parte del intercambio
    if (intercambio.usuario_id_ofrece !== usuario.id && intercambio.usuario_id_recibe !== usuario.id) {
      return NextResponse.json({ error: "No autorizado para confirmar este intercambio" }, { status: 403 })
    }

    // Verificar si el usuario ya ha confirmado
    if (
      (intercambio.usuario_id_ofrece === usuario.id && intercambio.confirmado_ofrece) ||
      (intercambio.usuario_id_recibe === usuario.id && intercambio.confirmado_recibe)
    ) {
      return NextResponse.json(
        {
          mensaje: "Ya has confirmado este intercambio anteriormente",
          intercambio: intercambio,
          estado: intercambio.estado,
        },
        { status: 200 },
      )
    }

    // Actualizar el campo de confirmación correspondiente
    const updateData = {}
    if (intercambio.usuario_id_ofrece === usuario.id) {
      updateData.confirmado_ofrece = true
    } else {
      updateData.confirmado_recibe = true
    }

    // Si ambos confirman, cambiar el estado a completado
    if (
      (intercambio.usuario_id_ofrece === usuario.id && intercambio.confirmado_recibe) ||
      (intercambio.usuario_id_recibe === usuario.id && intercambio.confirmado_ofrece)
    ) {
      updateData.estado = "completado"
    }

    // Actualizar el intercambio
    const { data, error } = await supabase.from("intercambios").update(updateData).eq("id", intercambio_id).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Si el intercambio está completado, actualizar los libros
    if (data[0].estado === "completado") {
      // Marcar los libros como intercambiados
      if (intercambio.usuario_ofrece_id_libro) {
        await supabase.from("libros").update({ estado: "intercambiado" }).eq("id", intercambio.usuario_ofrece_id_libro)
      }

      if (intercambio.usuario_recibe_id_libro) {
        await supabase.from("libros").update({ estado: "intercambiado" }).eq("id", intercambio.usuario_recibe_id_libro)
      }
    }

    return NextResponse.json({
      intercambio: data[0],
      estado: data[0].estado,
      mensaje: data[0].estado === "completado" ? "Intercambio completado" : "Confirmación registrada",
    })
  } catch (error) {
    console.error("Error en POST /api/intercambios/confirmar:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
