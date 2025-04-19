import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('generos')
      .select('id, nombre, imagen');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  // Si se usa otro método que no sea GET
  return res.status(405).json({ message: 'Método no permitido' });
}
