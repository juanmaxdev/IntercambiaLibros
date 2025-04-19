import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id_emisor, id_receptor, isbn, mensaje, fecha_envio } = req.body;

    if (!id_emisor || !id_receptor || !isbn || !mensaje) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const { data, error } = await supabase
      .from('chat')
      .insert([
        {
          id_emisor,
          id_receptor,
          isbn,
          mensaje,
          fecha_envio: fecha_envio || new Date().toISOString(),
        },
      ])
      .select();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json({ message: 'Mensaje enviado con éxito', mensaje: data[0] });
  }

  if (req.method === 'GET') {
    const { id_emisor, id_receptor, isbn } = req.query;

    let query = supabase.from('chat').select('*');

    if (id_emisor && id_receptor && isbn) {
      query = query.or(`and(id_emisor.eq.${id_emisor},id_receptor.eq.${id_receptor},isbn.eq.${isbn}),and(id_emisor.eq.${id_receptor},id_receptor.eq.${id_emisor},isbn.eq.${isbn})`);
    }

    const { data, error } = await query.order('fecha_envio', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json(data);
  }

  return res.status(405).json({ message: 'Método no permitido' });
}