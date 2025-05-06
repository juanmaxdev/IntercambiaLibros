export const runtime = 'nodejs';

import { supabase } from '@/lib/supabase';
import { guardarLibroEnBD } from '@/services/librosService';
import { getUsuarioId } from '@/services/getUsuarioId';
import { auth } from '@/server/auth';

export async function POST(req) {
  try {
    const session = await auth();
    const emailUsuario = session?.user?.email;

    if (!emailUsuario) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const formData = await req.formData();
    console.log('📥 FormData recibido');

    const archivo = formData.get('archivo');
    if (!archivo || typeof archivo === 'string') {
      return Response.json({ error: 'El archivo es obligatorio' }, { status: 400 });
    }

    const usuario_id = await getUsuarioId(emailUsuario);
    console.log('✅ Usuario ID:', usuario_id);

    // Extraer campos
    const titulo = formData.get('titulo');
    const autor = formData.get('autor');
    const genero_id = parseInt(formData.get('genero_id'), 10);
    const estado_libro = formData.get('estado_libro');
    const descripcion = formData.get('descripcion');
    const donacion = formData.get('donacion') === 'true';
    const ubicacion = formData.get('ubicacion');
    const isbn = formData.get('isbn') || '';
    const tipo_tapa = formData.get('tipo_tapa') || '';
    const editorial = formData.get('editorial') || '';
    const metodo_intercambio = formData.get('metodoIntercambio') || 'Presencial';

    console.log('📝 Campos del libro:', {
      titulo,
      autor,
      genero_id,
      estado_libro,
      descripcion,
      donacion,
      ubicacion,
      isbn,
      tipo_tapa,
      editorial,
      metodo_intercambio,
    });

    // 🧠 Solución al error de duplex: convertir el archivo a buffer
    const arrayBuffer = await archivo.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    const ext = archivo.name.split('.').pop();
    const filePath = `subidas/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('portada-libros')
      .upload(filePath, fileBuffer, {
        contentType: archivo.type,
      });

    if (uploadError) {
      console.error('❌ Error al subir la imagen:', uploadError);
      return Response.json({ error: 'Error al subir la imagen a Supabase' }, { status: 500 });
    }

    const { data: publicUrlData, error: urlError } = supabase
    .storage
    .from('portada-libros')
    .getPublicUrl(filePath);
  
  const publicURL = publicUrlData?.publicUrl;  

    if (urlError) {
      console.error('❌ Error al obtener URL pública:', urlError);
      return Response.json({ error: 'Error al obtener la URL pública del archivo' }, { status: 500 });
    }

    console.log('📤 Imagen subida con URL pública:', publicURL);

    // Insertar el libro en la base de datos
    const libroGuardado = await guardarLibroEnBD({
      isbn,
      titulo,
      autor,
      genero_id,
      estado_libro,
      descripcion,
      donacion,
      ubicacion,
      usuario_id,
      tipo_tapa,
      editorial,
      metodo_intercambio,
      imagenes: publicURL,
    });

    console.log('✅ Libro guardado:', libroGuardado);

    return Response.json({
      message: 'Libro registrado correctamente',
      libro: libroGuardado,
    }, { status: 201 });
  } catch (err) {
    console.error('🔥 Error en la API (subirLibros):', err.message, err.stack);
    return Response.json({ error: err.message || 'Error interno del servidor' }, { status: 500 });
  }
}