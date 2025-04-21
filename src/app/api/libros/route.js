// pages/api/libros/index.js
import { obtenerLibros } from '@/services/librosService';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Llamar al servicio para obtener los libros
    const libros = await obtenerLibros();

    // Responder con los datos obtenidos
    return NextResponse.json(libros);
  } catch (error) {
    console.error('❌ Error en la API de libros:', error.message);

    // Responder con un error genérico
    return NextResponse.json(
      { message: 'Error al obtener libros', error: error.message },
      { status: 500 }
    );
  }
}