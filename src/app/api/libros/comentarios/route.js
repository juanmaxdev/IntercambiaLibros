import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    // Obtener el título del libro desde los parámetros de consulta
    const searchParams = request.nextUrl.searchParams
    const titulo = searchParams.get("titulo")

    if (!titulo) {
      return NextResponse.json({ error: "Se requiere el título del libro" }, { status: 400 })
    }

    // Función para normalizar texto
    const normalizarTexto = (texto) => {
      if (!texto) return ""
      return texto
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
        .replace(/[^\w\s]/gi, "") // Eliminar caracteres especiales
    }

    const tituloNormalizado = normalizarTexto(titulo)

    // Consulta a Supabase para obtener todas las valoraciones
    const { data, error } = await supabase.from("valoraciones_libros").select(`
        id,
        usuario_id,
        valoracion,
        comentario,
        fecha_valoracion,
        titulo,
        usuarios:usuario_id (
          nombre_usuario,
          correo_electronico
        )
      `)

    if (error) {
      console.error("Error al obtener valoraciones:", error)
      return NextResponse.json({ error: `Error al obtener valoraciones: ${error.message}` }, { status: 500 })
    }

    // Verificar que data sea un array
    if (!Array.isArray(data)) {
      console.error("La respuesta de Supabase no es un array:", data)
      return NextResponse.json({ error: "Formato de respuesta inesperado" }, { status: 500 })
    }

    // Aplanar los resultados para facilitar el acceso a los datos
    const comentariosAplanados = data.map(({ usuarios, ...rest }) => ({
      ...rest,
      nombre_usuario: usuarios?.nombre_usuario || "",
      correo_electronico: usuarios?.correo_electronico || "",
    }))

    // Filtrar los comentarios según el título normalizado
    const comentariosFiltrados = comentariosAplanados.filter((comentario) => {
      // Obtener el título del comentario
      const tituloComentario = comentario.titulo || ""

      if (!tituloComentario) return false

      const tituloComentarioNormalizado = normalizarTexto(tituloComentario)

      // Comparación más flexible: verificar si uno contiene al otro
      return (
        tituloComentarioNormalizado.includes(tituloNormalizado) ||
        tituloNormalizado.includes(tituloComentarioNormalizado)
      )
    })

    return NextResponse.json(comentariosFiltrados)
  } catch (error) {
    console.error("Error al obtener comentarios:", error)
    return NextResponse.json({ error: `Error al obtener los comentarios: ${error.message}` }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    console.log("📝 Iniciando proceso de inserción de comentario")

    const comentarioData = await request.json()
    console.log("📝 Datos recibidos:", {
      titulo: comentarioData.titulo,
      usuario_email: comentarioData.usuario_id, // Este es realmente el email
      valoracion: comentarioData.valoracion,
      comentario_length: comentarioData.comentario?.length,
    })

    // Validar datos requeridos
    if (!comentarioData.titulo || !comentarioData.comentario || !comentarioData.valoracion) {
      console.error("❌ Faltan datos requeridos")
      return NextResponse.json(
        {
          error: "Faltan datos requeridos",
          userMessage: "Por favor, completa todos los campos requeridos.",
        },
        { status: 400 },
      )
    }

    // Validar que usuario_id (que es realmente el email) esté presente
    if (!comentarioData.usuario_id) {
      console.error("❌ No se proporcionó información del usuario")
      return NextResponse.json(
        {
          error: "Usuario no identificado",
          userMessage: "Debes iniciar sesión para poder comentar.",
        },
        { status: 401 },
      )
    }

    console.log("📝 Buscando usuario por email:", comentarioData.usuario_id)

    // Primero, obtener el ID numérico del usuario basado en su email
    const { data: usuario, error: errorUsuario } = await supabase
      .from("usuarios")
      .select("id, nombre_usuario")
      .eq("correo_electronico", comentarioData.usuario_id)
      .single()

    if (errorUsuario || !usuario) {
      console.error("❌ Error al obtener usuario:", errorUsuario)

      // Si el usuario no existe, intentamos crearlo
      console.log("📝 Usuario no encontrado, intentando crear nuevo usuario")

      const nuevoUsuario = {
        correo_electronico: comentarioData.usuario_id,
        nombre_usuario: comentarioData.usuario_nombre || "Usuario",
        fecha_registro: new Date().toISOString(),
      }

      const { data: usuarioCreado, error: errorCreacion } = await supabase
        .from("usuarios")
        .insert([nuevoUsuario])
        .select("id, nombre_usuario")
        .single()

      if (errorCreacion || !usuarioCreado) {
        console.error("❌ Error al crear usuario:", errorCreacion)
        return NextResponse.json(
          {
            error: "Error al procesar usuario",
            userMessage: "Hubo un problema con tu cuenta. Por favor, inténtalo más tarde.",
          },
          { status: 500 },
        )
      }

      console.log("✅ Usuario creado exitosamente:", usuarioCreado.id)
      usuario.id = usuarioCreado.id
      usuario.nombre_usuario = usuarioCreado.nombre_usuario
    }

    console.log("✅ Usuario encontrado/creado con ID:", usuario.id)

    // Si no se recibe fecha, la generamos desde backend
    if (!comentarioData.fecha_valoracion) {
      const fecha = new Date()
      comentarioData.fecha_valoracion = fecha.toISOString().slice(0, 16) // yyyy-mm-ddTHH:MM
    }

    // Preparar los datos para insertar con el ID numérico correcto
    const datosParaInsertar = {
      usuario_id: usuario.id, // Ahora usamos el ID numérico
      valoracion: Number(comentarioData.valoracion), // Asegurar que sea número
      comentario: comentarioData.comentario.trim(),
      fecha_valoracion: comentarioData.fecha_valoracion,
      titulo: comentarioData.titulo,
    }

    console.log("📝 Datos preparados para insertar:", {
      usuario_id: datosParaInsertar.usuario_id,
      valoracion: datosParaInsertar.valoracion,
      titulo: datosParaInsertar.titulo,
      comentario_length: datosParaInsertar.comentario.length,
    })

    // Insertar el comentario en la base de datos
    const { data, error } = await supabase.from("valoraciones_libros").insert([datosParaInsertar]).select()

    if (error) {
      console.error("❌ Error al insertar valoración:", error)

      // Proporcionar mensajes de error más amigables
      let userMessage = "No se pudo guardar tu comentario. "

      if (error.code === "23505") {
        // Duplicate key
        userMessage += "Ya has comentado este libro anteriormente."
      } else if (error.code === "23503") {
        // Foreign key violation
        userMessage += "Hubo un problema con los datos del libro."
      } else if (error.code === "23514") {
        // Check constraint violation
        userMessage += "La valoración debe estar entre 1 y 5 estrellas."
      } else {
        userMessage += "Por favor, inténtalo de nuevo."
      }

      return NextResponse.json(
        {
          error: `Error al insertar valoración: ${error.message}`,
          userMessage: userMessage,
        },
        { status: 500 },
      )
    }

    console.log("✅ Comentario insertado exitosamente:", data[0]?.id)

    return NextResponse.json(
      {
        message: "Comentario enviado correctamente",
        data: data[0],
        userMessage: "¡Tu comentario se ha publicado exitosamente!",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("❌ Error general al guardar el comentario:", error)

    return NextResponse.json(
      {
        error: `Error al guardar el comentario: ${error.message}`,
        userMessage: "Hubo un problema al procesar tu comentario. Por favor, inténtalo más tarde.",
      },
      { status: 500 },
    )
  }
}
