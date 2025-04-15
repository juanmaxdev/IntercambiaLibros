import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('donaciones_libros')
      .select(`
        *,
        usuarios (
          nombre_usuario
        ),
        libros (
          titulo,
          autor,
          imagenes
        )
      `);

    if (error) return res.status(500).json({ error: error.message });

    // Aplanar los datos
    const datosAplanados = data.map((item) => ({
      id: item.id,
      libro_id: item.libro_id,
      usuario_id: item.usuario_id,
      mensaje: item.mensaje || '',
      nombre_usuario: item.usuarios?.nombre_usuario || '',
      titulo: item.libros?.titulo || '',
      autor: item.libros?.autor || '',
      imagenes: item.libros?.imagenes || '',
      fecha_subida: item.fecha_subida || '',
      tipo_tapa: item.tipo_tapa || '',
      estado_intercambio: item.estado_intercambio || '',
      valoracion_del_libro: item.valoracion_del_libro || 0,
      ubicacion: item.ubicacion || '',
    }));

    return res.status(200).json(datosAplanados);
  }

  return res.status(405).json({ message: 'Método no permitido' });
}