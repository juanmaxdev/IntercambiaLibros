import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id_usuario_reportante, id_usuario_reportado, isbn, motivo, estado } = req.body;

    if (!id_usuario_reportante || !id_usuario_reportado || !isbn || !motivo) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const { data, error } = await supabase
      .from('reportes')
      .insert([
        {
          id_usuario_reportante,
          id_usuario_reportado,
          isbn,
          motivo,
          fecha_reporte: new Date().toISOString(),
          estado: estado || 'pendiente',
        },
      ])
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: 'Reporte enviado con éxito', reporte: data[0] });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('reportes').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  return res.status(405).json({ message: 'Método no permitido' });
}