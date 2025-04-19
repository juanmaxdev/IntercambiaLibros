import { supabase } from '@/lib/supabase';


//API para borrar o modificar valoraciones de libros


export default async function handler(req, res) {
  const { id, titulo } = req.query;

  if (req.method === 'GET') {
    if (titulo) {
      const { data, error } = await supabase
        .from('valoraciones_libros')
        .select('*')
        .eq('titulo', titulo);

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    const { data, error } = await supabase.from('valoraciones_libros').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { usuario_id, valoracion, comentario, fecha_valoracion, titulo } = req.body;

    if (!usuario_id || !valoracion || !titulo) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const { data, error } = await supabase.from('valoraciones_libros').insert([
      {
        usuario_id,
        valoracion,
        comentario,
        fecha_valoracion,
        titulo
      }
    ]).select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);
  }

  if (req.method === 'PUT') {
    const { valoracion, comentario } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Falta el ID de la valoración' });
    }

    const { data, error } = await supabase
      .from('valoraciones_libros')
      .update({ valoracion, comentario })
      .eq('id', id)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Valoración actualizada', data });
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ message: 'Falta el ID de la valoración' });

    const { error } = await supabase.from('valoraciones_libros').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Valoración eliminada correctamente' });
  }

  return res.status(405).json({ message: 'Método no permitido' });
}