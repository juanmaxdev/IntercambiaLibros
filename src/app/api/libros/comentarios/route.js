import { supabase } from "@/lib/supabase"

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const usuario = searchParams.get("usuario")
    if (usuario) {
      const { data: usuarioData, error: usuarioError } = await supabase
        .from("usuarios")
        .select("id")
        .eq("correo_electronico", usuario)
        .single()

      if (usuarioError || !usuarioData) {
        return new Response(JSON.stringify([]), { status: 200 })
      }

      const { data: comentarios, error } = await supabase
        .from("valoraciones_libros")
        .select("*")
        .eq("usuario_id", usuarioData.id)

      if (error) {
        return new Response(JSON.stringify({ error: "Error al obtener comentarios" }), { status: 500 })
      }

      return new Response(JSON.stringify(comentarios || []), { status: 200 })
    }

    // Si no se especifica usuario, obtener todos los comentarios (lógica existente)
    const libroId = searchParams.get("libro_id")

    if (!libroId) {
      return new Response(JSON.stringify({ error: "libro_id es requerido" }), { status: 400 })
    }


    const { data: comentarios, error } = await supabase
      .from("valoraciones_libros")
      .select(`
        *,
        usuarios!valoraciones_libros_usuario_id_fkey (
          nombre_usuario,
          correo_electronico
        )
      `)
      .eq("libro_id", libroId)
      .order("fecha_valoracion", { ascending: false })

    if (error) {
      return new Response(JSON.stringify({ error: "Error al obtener comentarios" }), { status: 500 })
    }

    return new Response(JSON.stringify(comentarios || []), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()

    const { libro_id, usuario_id, valoracion, comentario } = body

    if (!libro_id || !usuario_id || !valoracion) {
      return new Response(JSON.stringify({ error: "Faltan datos requeridos" }), { status: 400 })
    }


    const valoracionNum = Number.parseInt(valoracion)
    if (isNaN(valoracionNum) || valoracionNum < 1 || valoracionNum > 5) {
      return new Response(JSON.stringify({ error: "La valoración debe ser un número entre 1 y 5" }), { status: 400 })
    }

    // Si usuario_id es un email, obtener el ID numérico
    let usuarioIdFinal = usuario_id
    if (typeof usuario_id === "string" && usuario_id.includes("@")) {

      const { data: usuario, error: usuarioError } = await supabase
        .from("usuarios")
        .select("id")
        .eq("correo_electronico", usuario_id)
        .single()

      if (usuarioError || !usuario) {
        return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 404 })
      }

      usuarioIdFinal = usuario.id
    }

    // Verificar si ya existe una valoración de este usuario para este libro
    const { data: existingRating, error: checkError } = await supabase
      .from("valoraciones_libros")
      .select("id")
      .eq("libro_id", libro_id)
      .eq("usuario_id", usuarioIdFinal)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      return new Response(JSON.stringify({ error: "Error al verificar valoración existente" }), { status: 500 })
    }

    if (existingRating) {
      const { error: updateError } = await supabase
        .from("valoraciones_libros")
        .update({
          valoracion: valoracionNum,
          comentario: comentario || null,
          fecha_valoracion: new Date().toISOString(),
        })
        .eq("id", existingRating.id)

      if (updateError) {
        return new Response(JSON.stringify({ error: "Error al actualizar valoración" }), { status: 500 })
      }

      return new Response(JSON.stringify({ message: "Valoración actualizada correctamente" }), { status: 200 })
    } else {
      
      const { error: insertError } = await supabase.from("valoraciones_libros").insert({
        libro_id: Number.parseInt(libro_id),
        usuario_id: usuarioIdFinal,
        valoracion: valoracionNum,
        comentario: comentario || null,
        fecha_valoracion: new Date().toISOString(),
      })

      if (insertError) {
        return new Response(JSON.stringify({ error: "Error al insertar valoración" }), { status: 500 })
      }

      return new Response(JSON.stringify({ message: "Comentario enviado correctamente" }), { status: 201 })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 })
  }
}
