import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('libros').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
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
    } = req.body;

    // Generar fecha actual sin segundos
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
        tipo_tapa
      }])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);
  }

  return res.status(405).json({ message: 'Método no permitido' });
}