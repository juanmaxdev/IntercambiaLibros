export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { data, error } = await supabase
    .from('donaciones_libros')
    .select(`
      *,
      usuarios (nombre_usuario),
      libros (titulo, autor, imagenes)
    `)
    ;

  if (error) {
    return res.status(500).json({ message: 'Error al obtener donaciones', error: error.message });
  }

  // Aplanar resultados
  const donaciones = data.map(({ usuarios, libros, ...rest }) => ({
    ...rest,
    usuario_id: rest.usuario_id,
    nombre_usuario: usuarios?.nombre_usuario || 'Desconocido',
    titulo: libros?.titulo || '',
    autor: libros?.autor || '',
    imagenes: libros?.imagenes || ''
  }));

  return res.status(200).json(donaciones);
}
