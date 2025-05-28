import { supabase } from '@/lib/supabase';

export async function obtenerLibros() {
  try {
    const { data, error } = await supabase
      .from('libros')
      .select(
        `
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
      `
      )
      .order('fecha_subida', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener libros: ${error.message}`);
    }

    const libros = data.map(({ usuarios, generos, ...rest }) => ({
      ...rest,
      nombre_usuario: usuarios?.nombre_usuario ?? 'Desconocido',
      correo_usuario: usuarios?.correo_electronico ?? 'Sin correo',
      nombre_genero: generos?.nombre ?? 'Sin género',
    }));

    return libros || [];
  } catch (error) {
    throw error;
  }
}

export async function obtenerLibrosSubidosPorUsuario(correoElectronico) {
  if (!correoElectronico) {
    throw new Error('El correo electrónico es obligatorio');
  }

  try {
    const { data: usuario, error: errorUsuario } = await supabase
      .from('usuarios')
      .select('id')
      .eq('correo_electronico', correoElectronico)
      .single();

    if (errorUsuario || !usuario) {
      throw new Error('No se pudo encontrar el usuario con el correo proporcionado');
    }

    const usuarioId = usuario.id;

    const { data: libros, error: errorLibros } = await supabase
      .from('libros')
      .select(
        `
        id,
        titulo,
        autor,
        imagenes,
        genero_id,
        estado_libro,
        descripcion,
        fecha_subida
      `
      )
      .eq('usuario_id', usuarioId);

    if (errorLibros) {
      throw new Error('Error al obtener los libros del usuario');
    }

    return libros;
  } catch (error) {
    throw error;
  }
}

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
  tipo_tapa = '',
  editorial = '',
  metodo_intercambio = 'Presencial',
  imagenes = '',
}) {
  const fecha_subida = new Date().toISOString().slice(0, 16);

  const { data, error } = await supabase
    .from('libros')
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
    .select();

  if (error) {
    throw new Error('No se pudo guardar el libro en la base de datos.');
  }

  return data?.[0];
}

export async function eliminarLibroPorId(idLibro) {
  const { error } = await supabase.from('libros').delete().eq('id', idLibro);

  if (error) {
    throw new Error('No se pudo eliminar el libro');
  }

  return true;
}

export async function obtenerLibroPorId(id) {
  try {
    const libroId = typeof id === 'string' ? Number.parseInt(id, 10) : id;
    const { data, error } = await supabase
      .from('libros')
      .select(
        `
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
      `
      )
      .eq('id', libroId)
      .single();

    if (error) {
      throw new Error(`Error al obtener libro: ${error.message}`);
    }

    if (!data) {
      throw new Error(`No se encontró el libro con ID: ${libroId}`);
    }

    const libro = {
      ...data,
      nombre_usuario: data.usuarios?.nombre_usuario ?? 'Desconocido',
      correo_usuario: data.usuarios?.correo_electronico ?? 'Sin correo',
      nombre_genero: data.generos?.nombre ?? 'Sin género',
    };

    return libro;
  } catch (error) {
    throw error;
  }
}
