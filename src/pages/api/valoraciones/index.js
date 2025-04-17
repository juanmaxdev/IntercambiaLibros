import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  // GET: Obtener valoraciones
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

  // POST: Insertar nueva valoración
  if (req.method === 'POST') {
    let {
      usuario_id, // Puede ser un número o correo
      valoracion,
      comentario,
      titulo,
      fecha_valoracion = new Date().toISOString().slice(0, 16)
    } = req.body;

    const imagen_usuario = req.body.imagen_usuario || '';

    if (!usuario_id || !valoracion || !titulo) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // Si se envía correo en vez de ID, obtener el ID desde la tabla usuarios
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
      }])
      .select();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json({ message: 'Valoración registrada', valoracion: data[0] });
  }

  return res.status(405).json({ message: 'Método no permitido' });
}