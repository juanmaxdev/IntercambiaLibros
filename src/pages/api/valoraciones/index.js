import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  // GET: obtener valoraciones
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

  // POST: insertar valoración
  if (req.method === 'POST') {
    let {
      usuario_id,
      usuario_email, // si viene como correo
      valoracion,
      comentario = '',
      titulo,
      fecha_valoracion,
      ...otrosCampos // aquí capturamos imagen_usuario y lo ignoramos
    } = req.body;

    // Validación mínima
    if (!usuario_id && !usuario_email) {
      return res.status(400).json({ message: 'Falta el identificador del usuario' });
    }
    if (!valoracion || !titulo) {
      return res.status(400).json({ message: 'Faltan campos obligatorios (valoracion, titulo)' });
    }

    // Fecha si no se proporciona
    if (!fecha_valoracion) {
      const fecha = new Date();
      fecha_valoracion = fecha.toISOString().slice(0, 16);
    }

    // Buscar usuario por correo si no es numérico
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
        titulo
        // no insertamos imagen_usuario ni otros campos no válidos
      }])
      .select();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json({ message: 'Valoración registrada', valoracion: data[0] });
  }

  return res.status(405).json({ message: 'Método no permitido' });
}