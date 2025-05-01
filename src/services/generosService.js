import { supabase } from '@/lib/supabase';

export async function obtenerGeneros() {
  const { data, error } = await supabase
    .from('generos')
    .select('id, nombre, imagen');

  if (error) {
    console.error('❌ Error al obtener géneros:', error.message);
    throw new Error('Error al obtener géneros');
  }

  return data;
}