import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('libros')
      .select(`
        id,
        isbn,
        titulo,
        autor,
        categoria,
        estado_libro,
        descripcion,
        donacion,
        ubicacion,
        imagenes,
        estado_intercambio,
        fecha_subida,
        valoracion_del_libro,
        tipo_tapa,
        editorial,
        usuarios (
          nombre_usuario
        )
      `);

    if (error) return res.status(500).json({ error: error.message });

    // Reemplazamos usuario_id por nombre_usuario
    const formateado = data.map(({ usuarios, ...libro }) => ({
      ...libro,
      nombre_usuario: usuarios?.nombre_usuario || 'Desconocido'
    }));

    return res.status(200).json(formateado);
  }

  if (req.method === 'POST') {
    const {
      isbn,
      titulo,
      autor,
      categoria,
      estado_libro,
      descripcion,
      donacion,
      ubicacion,
      imagenes,
      usuario_id,
      estado_intercambio = 'Disponible',
      valoracion_del_libro = 0,
      tipo_tapa = '',
      editorial = ''
    } = req.body;

    // Le damos la fecha sin segundos (00) ni milisegundos.
    const fecha = new Date();
    const fecha_subida = fecha.toISOString().slice(0, 16); // yyyy-mm-ddTHH:MM

    const { data, error } = await supabase
      .from('libros')
      .insert([{
        isbn,
        titulo,
        autor,
        categoria,
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
        editorial
      }])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);
  }

  return res.status(405).json({ message: 'Método no permitido' });
}