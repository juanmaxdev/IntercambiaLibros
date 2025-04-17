import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    let { usuario_id, titulo } = req.query;

    const query = supabase.from('valoraciones_libros').select('*');

    // Si se envía un correo como usuario_id, buscamos el ID real
    if (usuario_id && usuario_id.includes('@')) {
      const { data: user, error } = await supabase
        .from('usuarios')
        .select('id')
        .eq('correo_electronico', usuario_id)
        .single();

      if (error || !user) {
        return res.status(404).json({ message: 'Correo no encontrado en usuarios' });
      }

      usuario_id = user.id;
    }

    // Aplicar filtros
    if (usuario_id) query.eq('usuario_id', usuario_id);
    if (titulo) query.eq('titulo', titulo);

    const { data, error } = await query;

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const {
      usuario_id,
      valoracion,
      comentario,
      titulo,
      fecha_valoracion,
      nombre_usuario,
      imagen_usuario,
    } = req.body;

    if (!usuario_id || !valoracion || !titulo || !fecha_valoracion) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const { data, error } = await supabase.from('valoraciones_libros').insert([{
      usuario_id,
      valoracion,
      comentario,
      titulo,
      fecha_valoracion,
      nombre_usuario,
      imagen_usuario,
    }]).select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ message: 'Valoración registrada', valoracion: data[0] });
  }

  return res.status(405).json({ message: 'Método no permitido' });
}