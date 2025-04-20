import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id_usuario, mensaje, leida } = req.body;

    if (!id_usuario || !mensaje) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const { data, error } = await supabase
      .from('notificaciones')
      .insert([
        {
          id_usuario,
          mensaje,
          leida: leida || false,
          fecha: new Date().toISOString(),
        },
      ])
      .select();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json({ message: 'Notificación creada', notificacion: data[0] });
  }

  if (req.method === 'GET') {
    const { id_usuario } = req.query;

    if (!id_usuario) {
      return res.status(400).json({ message: 'Falta el ID del usuario' });
    }

    const { data, error } = await supabase
      .from('notificaciones')
      .select('*')
      .eq('id_usuario', id_usuario)
      .order('fecha', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json(data);
  }

  if (req.method === 'PUT') {
    const { id } = req.body;

    if (!id) return res.status(400).json({ message: 'Falta el ID de la notificación' });

    const { data, error } = await supabase
      .from('notificaciones')
      .update({ leida: true })
      .eq('id', id)
      .select();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ message: 'Notificación marcada como leída', notificacion: data[0] });
  }

  return res.status(405).json({ message: 'Método no permitido' });
}