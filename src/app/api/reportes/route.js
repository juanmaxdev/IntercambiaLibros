import { guardarMensaje } from '@/services/contactoService';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { nombre, apellidos, email, titulo, mensaje } = await request.json()

    if (!nombre || !apellidos || !email || !titulo || !mensaje) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios.' },
        { status: 400 }
      )
    }

    const result = await guardarMensaje({ nombre, apellidos, email, titulo, mensaje })
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}