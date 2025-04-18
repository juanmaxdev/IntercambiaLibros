import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  const { isbn } = req.query;

  try {
    const { data: libro, error } = await supabase
      .from('libros')
      .select('*')
      .eq('isbn', isbn)
      .single();  // Devuelve un solo registro

    if (error) throw error;
    res.status(200).json(libro);
  } catch (error) {
    res.status(404).json({ error: 'Libro no encontrado' });
  }
}