import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { usuario_id, titulo } = req.query;
    let query = supabase.from('valoraciones_libros').select('*');

    if (usuario_id) query = query.eq('usuario_id', usuario_id);
    if (titulo) query = query.eq('titulo', titulo);

    const { data, error } = await query;

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { usuario_id, valoracion, comentario, titulo } = req.body;

    if (!usuario_id || !valoracion || !titulo) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const { data, error } = await supabase.from('valoraciones_libros').insert([
      {
        usuario_id,
        valoracion,
        comentario,
        titulo
        // No se incluye fecha_valoracion, ya que se usa CURRENT_TIMESTAMP en Supabase
      }
    ]).select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ message: 'Valoración registrada', valoracion: data[0] });
  }

  return res.status(405).json({ message: 'Método no permitido' });
}