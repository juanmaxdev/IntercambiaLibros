import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  // GET: filtra por usuario_id o titulo
  if (req.method === 'GET') {
    const { usuario_id, titulo } = req.query;
    let query = supabase.from('valoraciones_libros').select('*');

    if (usuario_id) query = query.eq('usuario_id', usuario_id);
    if (titulo) query = query.eq('titulo', titulo);

    const { data, error } = await query;

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // POST: inserta y devuelve la valoración con fecha incluida
  if (req.method === 'POST') {
    const { usuario_id, valoracion, comentario, titulo } = req.body;

    if (!usuario_id || !valoracion || !titulo) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // 1. Insertar sin enviar fecha (se genera en BD con CURRENT_TIMESTAMP)
    const { data: insertData, error: insertError } = await supabase
      .from('valoraciones_libros')
      .insert([{ usuario_id, valoracion, comentario, titulo }])
      .select(); // Devuelve al menos el ID insertado

    if (insertError) {
      return res.status(500).json({ error: insertError.message });
    }

    const insertedId = insertData?.[0]?.id;

    // 2. Recuperar fila completa con fecha_valoracion
    const { data: fullData, error: fetchError } = await supabase
      .from('valoraciones_libros')
      .select('*')
      .eq('id', insertedId)
      .single();

    if (fetchError) {
      return res.status(500).json({ error: fetchError.message });
    }

    return res.status(201).json({
      message: 'Valoración registrada',
      valoracion: fullData
    });
  }

  // Otros métodos no permitidos
  return res.status(405).json({ message: 'Método no permitido' });
}