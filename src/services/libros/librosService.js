import { supabase } from '@/lib/supabase';

export async function subirLibro(dataLibro, archivo) {
  let urlImagen = dataLibro.imagenes || '';

  if (archivo) {
    const { buffer, originalname, mimetype } = archivo;
    const ext = originalname.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = `subidas/${fileName}`;

    const { error: uploadError } = await supabase
      .storage
      .from('portada-libros')
      .upload(filePath, buffer, { contentType: mimetype });

    if (uploadError) {
      console.error('Error al subir imagen:', uploadError);
      throw new Error('Error al subir la imagen');
    }

    urlImagen = `https://heythjlroyqoqhqbmtlc.supabase.co/storage/v1/object/public/portada-libros/${filePath}`;
  }

  const fecha_subida = new Date().toISOString().slice(0, 16);

  const { data, error } = await supabase
    .from('libros')
    .insert([{
      ...dataLibro,
      imagenes: urlImagen,
      fecha_subida,
    }])
    .select();

  if (error) {
    console.error('Error al insertar libro:', error);
    throw new Error(error.message);
  }

  return data[0];
}