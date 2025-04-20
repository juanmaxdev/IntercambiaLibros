import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await supabase.from('donaciones_libros').select(`
      *,
      usuarios (nombre_usuario),
      libros (titulo, autor, imagenes)
    `);
  if (error) {
    return NextResponse.json({ message: 'Error al obtener donaciones', error: error.message }, { status: 500 });
  }

  // Aplanar resultados
  const donaciones = data.map(({ usuarios, libros, ...rest }) => ({
    ...rest,
    usuario_id: rest.usuario_id,
    nombre_usuario: usuarios?.nombre_usuario || 'Desconocido',
    titulo: libros?.titulo || '',
    autor: libros?.autor || '',
    imagenes: libros?.imagenes || '',
  }));

  return NextResponse.json(donaciones);
}
