import { supabase } from "@/lib/supabase"

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const usuario = searchParams.get("usuario")

    console.log("🔍 Obteniendo comentarios para usuario:", usuario)

    if (usuario) {
      // Obtener comentarios de un usuario específico
      // Primero obtenemos el ID del usuario por su email
      const { data: usuarioData, error: usuarioError } = await supabase
        .from("usuarios")
        .select("id")
        .eq("correo_electronico", usuario)
        .single()

      if (usuarioError || !usuarioData) {
        console.log("❌ Usuario no encontrado:", usuario)
        return new Response(JSON.stringify([]), { status: 200 })
      }

      console.log("✅ Usuario encontrado con ID:", usuarioData.id)

      const { data: comentarios, error } = await supabase
        .from("valoraciones_libros")
        .select("*")
        .eq("usuario_id", usuarioData.id)

      if (error) {
        console.error("❌ Error al obtener comentarios del usuario:", error)
        return new Response(JSON.stringify({ error: "Error al obtener comentarios" }), { status: 500 })
      }

      console.log("✅ Comentarios obtenidos:", comentarios?.length || 0)
      return new Response(JSON.stringify(comentarios || []), { status: 200 })
    }

    // Si no se especifica usuario, obtener todos los comentarios (lógica existente)
    const libroId = searchParams.get("libro_id")

    if (!libroId) {
      return new Response(JSON.stringify({ error: "libro_id es requerido" }), { status: 400 })
    }

    console.log("🔍 Obteniendo comentarios para libro ID:", libroId)

    const { data: comentarios, error } = await supabase
      .from("valoraciones_libros")
      .select(`
        *,
        usuarios (
          nombre_usuario,
          correo_electronico
        )
      `)
      .eq("libro_id", libroId)
      .order("fecha_valoracion", { ascending: false })

    if (error) {
      console.error("❌ Error al obtener comentarios:", error)
      return new Response(JSON.stringify({ error: "Error al obtener comentarios" }), { status: 500 })
    }

    console.log("✅ Comentarios obtenidos:", comentarios?.length || 0)
    return new Response(JSON.stringify(comentarios || []), { status: 200 })
  } catch (error) {
    console.error("❌ Error en la API de comentarios:", error)
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    console.log("📝 Datos recibidos para comentario:", body)

    const { libro_id, usuario_id, valoracion, comentario } = body

    // Validaciones
    if (!libro_id || !usuario_id || !valoracion) {
      console.error("❌ Datos faltantes:", { libro_id, usuario_id, valoracion })
      return new Response(JSON.stringify({ error: "Faltan datos requeridos" }), { status: 400 })
    }

    // Validar que la valoración sea un número entre 1 y 5
    const valoracionNum = Number.parseInt(valoracion)
    if (isNaN(valoracionNum) || valoracionNum < 1 || valoracionNum > 5) {
      console.error("❌ Valoración inválida:", valoracion)
      return new Response(JSON.stringify({ error: "La valoración debe ser un número entre 1 y 5" }), { status: 400 })
    }

    // Si usuario_id es un email, obtener el ID numérico
    let usuarioIdFinal = usuario_id
    if (typeof usuario_id === "string" && usuario_id.includes("@")) {
      console.log("🔍 Convirtiendo email a ID:", usuario_id)

      const { data: usuario, error: usuarioError } = await supabase
        .from("usuarios")
        .select("id")
        .eq("correo_electronico", usuario_id)
        .single()

      if (usuarioError || !usuario) {
        console.error("❌ Usuario no encontrado:", usuario_id, usuarioError)
        return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 404 })
      }

      usuarioIdFinal = usuario.id
      console.log("✅ ID de usuario obtenido:", usuarioIdFinal)
    }

    // Verificar si ya existe una valoración de este usuario para este libro
    const { data: existingRating, error: checkError } = await supabase
      .from("valoraciones_libros")
      .select("id")
      .eq("libro_id", libro_id)
      .eq("usuario_id", usuarioIdFinal)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("❌ Error al verificar valoración existente:", checkError)
      return new Response(JSON.stringify({ error: "Error al verificar valoración existente" }), { status: 500 })
    }

    if (existingRating) {
      console.log("⚠️ Ya existe una valoración, actualizando...")
      // Actualizar valoración existente
      const { error: updateError } = await supabase
        .from("valoraciones_libros")
        .update({
          valoracion: valoracionNum,
          comentario: comentario || null,
          fecha_valoracion: new Date().toISOString(),
        })
        .eq("id", existingRating.id)

      if (updateError) {
        console.error("❌ Error al actualizar valoración:", updateError)
        return new Response(JSON.stringify({ error: "Error al actualizar valoración" }), { status: 500 })
      }

      console.log("✅ Valoración actualizada correctamente")
      return new Response(JSON.stringify({ message: "Valoración actualizada correctamente" }), { status: 200 })
    } else {
      console.log("📝 Creando nueva valoración...")
      // Crear nueva valoración
      const { error: insertError } = await supabase.from("valoraciones_libros").insert({
        libro_id: Number.parseInt(libro_id),
        usuario_id: usuarioIdFinal,
        valoracion: valoracionNum,
        comentario: comentario || null,
        fecha_valoracion: new Date().toISOString(),
      })

      if (insertError) {
        console.error("❌ Error al insertar valoración:", insertError)
        return new Response(JSON.stringify({ error: "Error al insertar valoración" }), { status: 500 })
      }

      console.log("✅ Valoración creada correctamente")
      return new Response(JSON.stringify({ message: "Comentario enviado correctamente" }), { status: 201 })
    }
  } catch (error) {
    console.error("❌ Error en la API de comentarios:", error)
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 })
  }
}
