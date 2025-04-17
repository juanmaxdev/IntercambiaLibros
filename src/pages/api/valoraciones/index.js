import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('valoraciones_libros')
      .select(`
        id,
        usuario_id,
        valoracion,
        comentario,
        fecha_valoracion,
        titulo,
        imagen_usuario,
        usuarios:usuario_id (
          nombre_usuario,
          correo_electronico
        )
      `);

    if (error) return res.status(500).json({ error: error.message });

    const resultado = data.map(({ usuarios, ...rest }) => ({
      ...rest,
      nombre_usuario: usuarios?.nombre_usuario || '',
      correo_electronico: usuarios?.correo_electronico || ''
    }));

    return res.status(200).json(resultado);
  }

  if (req.method === 'POST') {
    let {
      usuario_id,           // puede ser un número o un correo
      valoracion,
      comentario = '',
      titulo,
      imagen_usuario = '',
      fecha_valoracion      // enviado por el frontend
    } = req.body;

    if (!usuario_id || !valoracion || !titulo || !fecha_valoracion) {
      return res.status(400).json({ message: 'Faltan campos obligatorios (usuario_id, valoracion, titulo, fecha_valoracion)' });
    }

    // Si usuario_id es un correo electrónico
    if (typeof usuario_id === 'string' && isNaN(Number(usuario_id))) {
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('correo_electronico', usuario_id)
        .single();

      if (userError || !userData) {
        return res.status(404).json({ message: 'Correo no encontrado en la base de datos' });
      }

      usuario_id = userData.id;
    }

    const { data, error } = await supabase
      .from('valoraciones_libros')
      .insert([{
        usuario_id,
        valoracion,
        comentario,
        fecha_valoracion,
        titulo,
        imagen_usuario
      }])
      .select();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json({ message: 'Valoración registrada', valoracion: data[0] });
  }

  return res.status(405).json({ message: 'Método no permitido' });
}