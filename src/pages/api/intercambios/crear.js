import { supabase } from '@/lib/supabase';

// API para la creacion de intercambios

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { isbn, usuario_id_ofrece, usuario_id_recibe, comentario } = req.body;

  if (!isbn || !usuario_id_ofrece || !usuario_id_recibe) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  const { data, error } = await supabase.from('intercambios').insert([
    {
      isbn,
      usuario_id_ofrece,
      usuario_id_recibe,
      comentario,
      fecha_intercambio: new Date().toISOString(),
      estado: 'pendiente'
    }
  ]).select();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({ message: 'Intercambio creado', intercambio: data[0] });
}
