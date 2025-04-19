import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Falta el ID del usuario' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre_usuario, correo_electronico, ubicacion, biografia, reputacion, fecha_registro')
      .eq('id', id)
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'PUT') {
    const { nombre_usuario, ubicacion, biografia, reputacion } = req.body;

    const updateData = { nombre_usuario, ubicacion, biografia, reputacion };

    // Elimina valores undefined o vacíos
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    const { data, error } = await supabase
      .from('usuarios')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ message: 'Perfil actualizado', perfil: data[0] });
  }

  return res.status(405).json({ message: 'Método no permitido' });
}