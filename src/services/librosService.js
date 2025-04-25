import { supabase } from '@/lib/supabase';
import fs from 'fs';

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

export async function subidaLibros({ fields, files }) {
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
  } = fields;

  // Validaciones
  if (!titulo || titulo.length < 3) throw new Error('El título es obligatorio y debe tener al menos 3 caracteres');
  if (!autor || autor.length < 3) throw new Error('El autor es obligatorio y debe tener al menos 3 caracteres');
  if (!genero_id) throw new Error('El género es obligatorio');
  if (!estado_libro) throw new Error('El estado del libro es obligatorio');
  if (!descripcion || descripcion.length < 20) throw new Error('La descripción es obligatoria y debe tener al menos 20 caracteres');
  if (isbn && !/^\d{10}(\d{3})?$/.test(isbn)) throw new Error('El ISBN debe tener 10 o 13 caracteres numéricos');
  if (!ubicacion || ubicacion.trim().length < 5) throw new Error('La ubicación debe tener al menos 5 caracteres válidos');

  let urlImagen = '';

  // Manejo del archivo
  if (files.archivo) {
    const file = files.archivo;
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.mimetype)) throw new Error('El archivo debe ser una imagen (JPG, PNG)');
    if (file.size > 2 * 1024 * 1024) throw new Error('El archivo no debe superar los 2MB');

    const ext = file.originalFilename.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = `subidas/${fileName}`;

    const { error: uploadError } = await supabase
      .storage
      .from('portada-libros')
      .upload(filePath, fs.readFileSync(file.filepath), { contentType: file.mimetype });

    if (uploadError) {
      console.error('Error al subir imagen:', uploadError);
      throw new Error('Error al subir la imagen');
    }

    // Obtener la URL pública de la imagen
    const { publicURL, error: urlError } = supabase
      .storage
      .from('portada-libros')
      .getPublicUrl(filePath);

    if (urlError) {
      console.error('Error al obtener la URL pública:', urlError);
      throw new Error('Error al obtener la URL pública de la imagen');
    }

    urlImagen = publicURL;

    // Eliminar el archivo temporal
    try {
      fs.unlinkSync(file.filepath);
    } catch (err) {
      console.error('Error al eliminar el archivo temporal:', err);
    }
  }

  const fecha_subida = new Date().toISOString().slice(0, 16); // Formato YYYY-MM-DD

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
    throw new Error(`Error al insertar libro en la base de datos: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('No se pudo insertar el libro en la base de datos');
  }

  return data[0];
}