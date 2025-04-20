import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Método ${req.method} no permitido` });
  }

  try {
    // Traemos todos los campos de libros + usuario y género relacionados
    const { data, error } = await supabase
      .from('libros')
      .select(`
        id,
        isbn,
        titulo,
        autor,
        estado_libro,
        descripcion,
        donacion,
        ubicacion,
        imagenes,
        usuario_id,
        estado_intercambio,
        fecha_subida,
        valoracion_del_libro,
        tipo_tapa,
        editorial,
        metodo_intercambio,
        usuarios:usuario_id ( nombre_usuario ),
        generos:genero_id ( nombre )
      `);

    if (error) {
      console.error('Error al obtener libros:', error);
      return res.status(500).json({ message: 'Error al obtener libros', error: error.message });
    }

    // Aplanar usuarios y géneros para dejar todo en el mismo objeto
    const libros = data.map(({ usuarios, generos, ...rest }) => ({
      ...rest,
      nombre_usuario: usuarios?.nombre_usuario ?? 'Desconocido',
      nombre_genero: generos?.nombre ?? 'Sin género',
    }));

    return res.status(200).json(libros);
  } catch (err) {
    console.error('Error inesperado:', err);
    return res.status(500).json({ message: 'Error inesperado al procesar la solicitud' });
  }
}