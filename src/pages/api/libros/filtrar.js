import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  const { categoria } = req.query;

  try {
    const { data: libros, error } = await supabase
      .from('libros')
      .select('*')
      .eq('categoria', categoria);

    if (error) throw error;
    res.status(200).json(libros);
  } catch (error) {
    res.status(500).json({ error: 'Error al filtrar libros' });
  }
}