import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { usuario_id, isbn } = req.body;

    if (!usuario_id || !isbn) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const { data, error } = await supabase
      .from('favoritos')
      .insert([{ usuario_id, isbn }])
      .select();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json({ message: 'Libro agregado a favoritos', favorito: data[0] });
  }

  if (req.method === 'GET') {
    const { usuario_id } = req.query;

    if (!usuario_id) {
      return res.status(400).json({ message: 'Falta el ID del usuario' });
    }

    const { data, error } = await supabase
      .from('favoritos')
      .select('*, libros(titulo, autor, imagenes)')
      .eq('usuario_id', usuario_id);

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    const { usuario_id, isbn } = req.body;

    if (!usuario_id || !isbn) {
      return res.status(400).json({ message: 'Faltan datos para eliminar' });
    }

    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('usuario_id', usuario_id)
      .eq('isbn', isbn);

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ message: 'Libro eliminado de favoritos' });
  }

  return res.status(405).json({ message: 'Método no permitido' });
}