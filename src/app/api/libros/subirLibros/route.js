import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Configuración de multer para guardar temporalmente los archivos
const uploadDir = path.join(process.cwd(), 'temp/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Tamaño máximo del archivo (2MB)
  fileFilter: (req, file, cb) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.mimetype)) {
      return cb(new Error('El archivo debe ser una imagen (JPG, PNG)'));
    }
    cb(null, true);
  },
});

const multerMiddleware = upload.fields([
  { name: 'archivo', maxCount: 1 }, // Campo para el archivo
]);

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

export const config = {
  api: {
    bodyParser: false, // Desactiva el bodyParser para manejar el archivo manualmente
  },
};

export async function POST(req) {
  const res = new NextResponse();

  try {
    // Ejecutar multer como middleware
    await runMiddleware(req, res, multerMiddleware);

    const { archivo } = req.files;
    const { titulo, descripcion } = req.body;

    // Validaciones
    if (!titulo || titulo.length < 3) {
      return NextResponse.json({ error: 'El título es obligatorio y debe tener al menos 3 caracteres' }, { status: 400 });
    }

    if (!descripcion || descripcion.length < 10) {
      return NextResponse.json({ error: 'La descripción es obligatoria y debe tener al menos 10 caracteres' }, { status: 400 });
    }

    if (!archivo || archivo.length === 0) {
      return NextResponse.json({ error: 'El archivo es obligatorio' }, { status: 400 });
    }

    // Leer el archivo temporalmente guardado
    const fileBuffer = fs.readFileSync(archivo[0].path);

    // Subir el archivo a Supabase
    const filePath = `subidas/${archivo[0].filename}`;
    const { data, error: uploadError } = await supabase.storage
      .from('portada-libros')
      .upload(filePath, fileBuffer, {
        contentType: archivo[0].mimetype,
      });

    // Eliminar el archivo temporal
    fs.unlinkSync(archivo[0].path);

    if (uploadError) {
      console.error('Error al subir el archivo a Supabase:', uploadError);
      return NextResponse.json({ error: 'Error al subir el archivo a Supabase' }, { status: 500 });
    }

    console.log('Archivo subido correctamente a Supabase.');

    // Obtener la URL pública del archivo
    const { publicURL, error: urlError } = supabase.storage
      .from('portada-libros')
      .getPublicUrl(filePath);

    if (urlError) {
      console.error('Error al obtener la URL pública:', urlError);
      return NextResponse.json({ error: 'Error al obtener la URL pública del archivo' }, { status: 500 });
    }

    console.log('URL pública generada:', publicURL);

    return NextResponse.json({
      message: 'Archivo subido correctamente',
      filePath: publicURL, // URL pública del archivo
    }, { status: 201 });
  } catch (err) {
    console.error('Error en la API:', err);

    // Limpieza del archivo en caso de error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error al eliminar el archivo:', unlinkError);
      }
    }

    if (err.message.includes('El archivo debe ser una imagen')) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}