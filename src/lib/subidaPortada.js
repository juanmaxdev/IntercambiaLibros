import { supabase } from './supabase';

export async function subirPortadaLibro(file, nombreArchivo) {
  const { data, error } = await supabase.storage
    .from('portadas-libros')
    .upload(`libros/${nombreArchivo}`, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error subiendo imagen:', error.message);
    return null;
  }

  const { publicUrl } = supabase.storage
    .from('portadas-libros')
    .getPublicUrl(`libros/${nombreArchivo}`).data;

  return publicUrl;
}