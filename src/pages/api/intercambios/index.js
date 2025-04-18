import { supabase } from '@/lib/supabase';

// API para poder listar todos los intercambios o filtrarlos por usuario

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { usuario_id } = req.query;

  let query = supabase.from('intercambios').select('*');

  if (usuario_id) {
    query = query.or(`usuario_id_ofrece.eq.${usuario_id},usuario_id_recibe.eq.${usuario_id}`);
  }

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
}