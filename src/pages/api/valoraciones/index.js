import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let {
      usuario_id,
      usuario_email,
      nombre_usuario, // <-- viene del front, pero no se guarda
      imagen_usuario = null,
      valoracion,
      comentario,
      titulo,
      fecha_valoracion = new Date().toISOString().slice(0, 16)
    } = req.body;

    // Validaciones mínimas
    if (!valoracion || !comentario || !titulo) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // Buscar ID si solo se envió el correo
    if (!usuario_id && usuario_email) {
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('correo_electronico', usuario_email)
        .single();

      if (userError || !userData) {
        return res.status(404).json({ message: 'Correo no encontrado' });
      }

      usuario_id = userData.id;
    }

    const { data, error } = await supabase
      .from('valoraciones_libros')
      .insert([{
        usuario_id: usuario_id || null,
        valoracion,
        comentario,
        titulo,
        fecha_valoracion,
        imagen_usuario
      }])
      .select();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json({ message: 'Valoración registrada', valoracion: data[0] });
  }

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

  return res.status(405).json({ message: 'Método no permitido' });
}