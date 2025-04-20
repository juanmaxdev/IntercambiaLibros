// pages/api/libros/index.js
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  // Verificamos si el usuario está autenticado

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
    return NextResponse.json({ message: 'Error al obtener libros', error: error.message }, { status: 500 });
  }

  // Aplanar usuarios y géneros para dejar todo en el mismo objeto
  const libros = data.map(({ usuarios, generos, ...rest }) => ({
    ...rest,
    nombre_usuario: usuarios?.nombre_usuario ?? 'Desconocido',
    nombre_genero: generos?.nombre ?? 'Sin género',
  }));

  return NextResponse.json(libros);
}