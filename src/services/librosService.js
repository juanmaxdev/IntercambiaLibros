import { supabase } from "@/lib/supabase"

export async function obtenerLibros() {
  console.log("📚 librosService: Iniciando obtenerLibros()")
  try {
    console.log("📚 librosService: Ejecutando consulta a Supabase")
    // Corregido: cambiado fecha_publicacion por fecha_subida
    const { data, error } = await supabase
      .from("libros")
      .select(`
        id,
        isbn,
        titulo,
        autor,
        estado_libro,
        descripcion,
        donacion,
        ubicacion,
        imagenes,
        usuario_id,
        estado_intercambio,
        fecha_subida,
        valoracion_del_libro,
        tipo_tapa,
        editorial,
        metodo_intercambio,
        usuarios:usuario_id ( nombre_usuario, correo_electronico ),
        generos:genero_id ( nombre )
      `)
      .order("fecha_subida", { ascending: false })

    if (error) {
      console.error("❌ librosService: Error al obtener libros:", error.message, error)
      throw new Error(`Error al obtener libros: ${error.message}`)
    }

    // Aplanar usuarios y géneros para dejar todo en el mismo objeto
    const libros = data.map(({ usuarios, generos, ...rest }) => ({
      ...rest,
      nombre_usuario: usuarios?.nombre_usuario ?? "Desconocido",
      correo_usuario: usuarios?.correo_electronico ?? "Sin correo",
      nombre_genero: generos?.nombre ?? "Sin género",
    }))

    console.log("✅ librosService: Libros obtenidos correctamente:", libros?.length || 0)
    return libros || []
  } catch (error) {
    console.error("❌ librosService: Excepción al obtener libros:", error.message, error)
    throw error
  }
}

export async function obtenerLibrosSubidosPorUsuario(correoElectronico) {
  if (!correoElectronico) {
    throw new Error("El correo electrónico es obligatorio")
  }

  try {
    // Obtener el usuario_id a partir del correo_electronico
    const { data: usuario, error: errorUsuario } = await supabase
      .from("usuarios") // Asegúrate de que esta sea la tabla correcta
      .select("id") // Seleccionamos solo el ID del usuario
      .eq("correo_electronico", correoElectronico)
      .single()

    if (errorUsuario || !usuario) {
      console.error("❌ Error al obtener el usuario:", errorUsuario?.message || "Usuario no encontrado")
      throw new Error("No se pudo encontrar el usuario con el correo proporcionado")
    }

    const usuarioId = usuario.id

    // Obtener los libros subidos por el usuario
    const { data: libros, error: errorLibros } = await supabase
      .from("libros") // Asegúrate de que esta sea la tabla correcta
      .select(`
        id,
        titulo,
        autor,
        imagenes,
        genero_id,
        estado_libro,
        descripcion,
        fecha_subida
      `)
      .eq("usuario_id", usuarioId)

    if (errorLibros) {
      console.error("❌ Error al obtener los libros del usuario:", errorLibros.message)
      throw new Error("Error al obtener los libros del usuario")
    }

    return libros
  } catch (error) {
    console.error("Error en el servicio obtenerLibrosSubidosPorUsuario:", error)
    throw error
  }
}

// Inserta un libro en la tabla 'libros'
export async function guardarLibroEnBD({
  isbn,
  titulo,
  autor,
  genero_id,
  estado_libro,
  descripcion,
  donacion,
  ubicacion,
  usuario_id,
  tipo_tapa = "",
  editorial = "",
  metodo_intercambio = "Presencial",
  imagenes = "",
}) {
  const fecha_subida = new Date().toISOString().slice(0, 16)

  const { data, error } = await supabase
    .from("libros")
    .insert([
      {
        isbn,
        titulo,
        autor,
        genero_id: Number.parseInt(genero_id, 10),
        estado_libro,
        descripcion,
        donacion,
        ubicacion,
        usuario_id,
        tipo_tapa,
        editorial,
        metodo_intercambio,
        imagenes,
        fecha_subida,
      },
    ])
    .select() // Seleccionamos el libro recién insertado

  if (error) {
    console.error("❌ Error al insertar el libro:", error)
    throw new Error("No se pudo guardar el libro en la base de datos.")
  }

  return data?.[0]
}

export async function eliminarLibroPorId(idLibro) {
  const { error } = await supabase.from("libros").delete().eq("id", idLibro)

  if (error) {
    console.error("❌ Error al eliminar libro:", error)
    throw new Error("No se pudo eliminar el libro")
  }

  return true
}

export async function obtenerLibroPorId(id) {
  console.log("📚 librosService: Obteniendo libro con ID:", id)

  try {
    // Convertir el ID a número si es necesario
    const libroId = typeof id === "string" ? Number.parseInt(id, 10) : id

    console.log("📚 librosService: ID convertido:", libroId)
    console.log("📚 librosService: Ejecutando consulta a Supabase")

    const { data, error } = await supabase
      .from("libros")
      .select(`
        id,
        isbn,
        titulo,
        autor,
        estado_libro,
        descripcion,
        donacion,
        ubicacion,
        imagenes,
        usuario_id,
        estado_intercambio,
        fecha_subida,
        valoracion_del_libro,
        tipo_tapa,
        editorial,
        metodo_intercambio,
        usuarios:usuario_id ( nombre_usuario, correo_electronico ),
        generos:genero_id ( nombre )
      `)
      .eq("id", libroId)
      .single()

    if (error) {
      console.error("❌ librosService: Error al obtener libro por ID:", error)
      throw new Error(`Error al obtener libro: ${error.message}`)
    }

    if (!data) {
      console.error("❌ librosService: No se encontró el libro con ID:", libroId)
      throw new Error(`No se encontró el libro con ID: ${libroId}`)
    }

    console.log("✅ librosService: Libro encontrado:", data.titulo)

    // Aplanar usuarios y géneros para dejar todo en el mismo objeto
    const libro = {
      ...data,
      nombre_usuario: data.usuarios?.nombre_usuario ?? "Desconocido",
      correo_usuario: data.usuarios?.correo_electronico ?? "Sin correo",
      nombre_genero: data.generos?.nombre ?? "Sin género",
    }

    return libro
  } catch (error) {
    console.error("❌ librosService: Error en obtenerLibroPorId:", error)
    throw error
  }
}
