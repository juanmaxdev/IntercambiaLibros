import { supabase } from '@/lib/supabase';

// Este endpoint es dinámico y sirve para:

// GET: obtener un intercambio por ID

// DELETE: eliminar un intercambio por ID

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('intercambios').select('*').eq('id', id).single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('intercambios').delete().eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }

  return res.status(405).json({ message: 'Método no permitido' });
}