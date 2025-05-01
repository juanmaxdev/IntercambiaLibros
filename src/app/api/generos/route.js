import { obtenerGeneros } from '@/services/generosService';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const generos = await obtenerGeneros();
    return NextResponse.json(generos);
  } catch (error) {
    console.error('❌ Error en la API de géneros:', error.message);
    return NextResponse.json({ message: 'Error al obtener géneros', error: error.message }, { status: 500 });
  }
}
