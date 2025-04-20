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
    // Cambiamos el nombre de la tabla a valoraciones_libros
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
    const comentarioData = await request.json()

    // Validar datos requeridos
    if (!comentarioData.titulo || !comentarioData.comentario || !comentarioData.valoracion) {
      return NextResponse.json({ error: "Faltan datos requeridos (título, comentario o valoración)" }, { status: 400 })
    }

    // Si no se recibe fecha, la generamos desde backend
    if (!comentarioData.fecha_valoracion) {
      const fecha = new Date()
      comentarioData.fecha_valoracion = fecha.toISOString().slice(0, 16) // yyyy-mm-ddTHH:MM
    }

    // Preparar los datos para insertar
    const datosParaInsertar = {
      usuario_id: comentarioData.usuario_id,
      valoracion: comentarioData.valoracion,
      comentario: comentarioData.comentario,
      fecha_valoracion: comentarioData.fecha_valoracion,
      titulo: comentarioData.titulo,
    }

    // Insertar el comentario en la base de datos
    const { data, error } = await supabase.from("valoraciones_libros").insert([datosParaInsertar]).select()

    if (error) {
      console.error("Error al insertar valoración:", error)
      return NextResponse.json({ error: `Error al insertar valoración: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json(
      {
        message: "Comentario enviado correctamente",
        data: data[0],
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error al guardar el comentario:", error)
    return NextResponse.json({ error: `Error al guardar el comentario: ${error.message}` }, { status: 500 })
  }
}
