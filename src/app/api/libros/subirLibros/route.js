import { supabase } from '@/lib/supabase';
import multer from 'multer';
import { NextResponse } from 'next/server';

// Configuración de Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware para manejar la subida de archivos
const uploadMiddleware = upload.single('archivo');

// Función para ejecutar middlewares en Next.js
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export async function POST(req) {
  const res = new NextResponse();

  try {
    // Ejecutar el middleware de Multer
    await runMiddleware(req, res, uploadMiddleware);

    const {
      isbn,
      titulo,
      autor,
      genero_id,
      estado_libro,
      descripcion,
      donacion,
      ubicacion,
      usuario_id,
      valoracion_del_libro = 0,
      tipo_tapa = '',
      editorial = '',
      metodo_intercambio = 'Presencial',
    } = req.body;

    let urlImagen = req.body.imagenes || '';

    if (req.file) {
      const { buffer, originalname, mimetype } = req.file;
      const ext = originalname.split('.').pop();
      const fileName = `${Date.now()}.${ext}`;
      const filePath = `subidas/${fileName}`;

      const { error: uploadError } = await supabase
        .storage
        .from('portada-libros')
        .upload(filePath, buffer, { contentType: mimetype });

      if (uploadError) {
        console.error('Error al subir imagen:', uploadError);
        return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 });
      }

      urlImagen = `https://heythjlroyqoqhqbmtlc.supabase.co/storage/v1/object/public/portada-libros/${filePath}`;
    }

    const fecha_subida = new Date().toISOString().slice(0, 16);

    const { data, error } = await supabase
      .from('libros')
      .insert([
        {
          isbn,
          titulo,
          autor,
          genero_id,
          estado_libro,
          descripcion,
          donacion,
          ubicacion,
          imagenes: urlImagen,
          usuario_id,
          fecha_subida,
          valoracion_del_libro,
          tipo_tapa,
          editorial,
          metodo_intercambio,
        },
      ])
      .select();

    if (error) {
      console.error('Error al insertar libro:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (err) {
    console.error('Error en la API:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}