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
        usuarios:usuario_id (
          nombre_usuario
        ),
        generos:genero_id (
          nombre
        )
      `);

    if (error) return res.status(500).json({ error: error.message });

    const formateado = data.map(({ usuarios, generos, ...libro }) => ({
      ...libro,
      nombre_usuario: usuarios?.nombre_usuario || 'Desconocido',
      nombre_genero: generos?.nombre || 'Sin género'
    }));

    return res.status(200).json(formateado);
  }

  if (req.method === 'POST') {
    const {
      isbn,
      titulo,
      autor,
      genero_id,
      estado_libro,
      descripcion,
      donacion,
      ubicacion,
      imagenes,
      usuario_id,
      valoracion_del_libro = 0,
      tipo_tapa = '',
      editorial = '',
      metodo_intercambio = 'Presencial' // valor por defecto
    } = req.body;

    const fecha = new Date();
    const fecha_subida = fecha.toISOString().slice(0, 16);

    const { data, error } = await supabase
      .from('libros')
      .insert([{
        isbn,
        titulo,
        autor,
        genero_id,
        estado_libro,
        descripcion,
        donacion,
        ubicacion,
        imagenes,
        usuario_id,
        fecha_subida,
        valoracion_del_libro,
        tipo_tapa,
        editorial,
        metodo_intercambio
      }])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);
  }

  return res.status(405).json({ message: 'Método no permitido' });
}
