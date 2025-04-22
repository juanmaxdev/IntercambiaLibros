import { NextResponse } from 'next/server';
import { subidaLibros } from '@/services/librosService';
import multer from 'multer';

// Configuración de Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });
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

    // Llamar al servicio para manejar la lógica de subida
    const result = await subidaLibros(req);

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error('Error en la API:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}