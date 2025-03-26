import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  try {
    // Consulta todos los libros de la tabla "libros"
    const { data: libros, error } = await supabase
      .from('libros')
      .select('*');

    if (error) {
      throw error;
    }

    // Devuelve los libros en formato JSON
    res.status(200).json(libros);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los libros' });
  }
}