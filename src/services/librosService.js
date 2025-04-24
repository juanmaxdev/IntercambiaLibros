import { supabase } from '@/lib/supabase';

export async function obtenerLibros() {
  // Traemos todos los campos de libros + usuario y género relacionados
  const { data, error } = await supabase
    .from('libros')
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
      usuarios:usuario_id ( nombre_usuario ),
      generos:genero_id ( nombre )
    `);

  if (error) {
    console.error('❌ Error al obtener libros:', error.message);
    throw new Error('Error al obtener libros');
  }

  // Aplanar usuarios y géneros para dejar todo en el mismo objeto
  const libros = data.map(({ usuarios, generos, ...rest }) => ({
    ...rest,
    nombre_usuario: usuarios?.nombre_usuario ?? 'Desconocido',
    nombre_genero: generos?.nombre ?? 'Sin género',
  }));

  return libros;
}

export async function subidaLibros(req) {
  const {
    isbn,
    titulo,
    autor,
    genero_id,
    estado_libro,
    descripcion,
    donacion,
    ubicacion,
    usuario_id,
    valoracion_del_libro = 0,
    tipo_tapa = '',
    editorial = '',
    metodo_intercambio = 'Presencial',
  } = req.body;

  let urlImagen = req.body.imagenes || '';

  if (req.file) {
    const { buffer, originalname, mimetype } = req.file;
    const ext = originalname.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = `subidas/${fileName}`;

    const { error: uploadError } = await supabase
      .storage
      .from('portada-libros')
      .upload(filePath, buffer, { contentType: mimetype });

    if (uploadError) {
      console.error('Error al subir imagen:', uploadError);
      throw new Error('Error al subir la imagen');
    }

    urlImagen = `https://heythjlroyqoqhqbmtlc.supabase.co/storage/v1/object/public/portada-libros/${filePath}`;
  }

  const fecha_subida = new Date().toISOString().slice(0, 16);

  const { data, error } = await supabase
    .from('libros')
    .insert([
      {
        isbn,
        titulo,
        autor,
        genero_id,
        estado_libro,
        descripcion,
        donacion,
        ubicacion,
        imagenes: urlImagen,
        usuario_id,
        fecha_subida,
        valoracion_del_libro,
        tipo_tapa,
        editorial,
        metodo_intercambio,
      },
    ])
    .select();

  if (error) {
    console.error('Error al insertar libro:', error);
    throw new Error(error.message);
  }

  return data[0];
}