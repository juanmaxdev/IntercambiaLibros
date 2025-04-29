import { NextResponse } from 'next/server';
import { enviarMensaje } from '@/services/chatService';

export async function POST(req) {
  try {
    const body = await req.json();
    const { id_usuario_envia, id_usuario_recibe, contenido, libro_id } = body;

    if (!id_usuario_envia || !id_usuario_recibe || !contenido || !libro_id) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const mensaje = await enviarMensaje({ id_usuario_envia, id_usuario_recibe, contenido, libro_id });

    return NextResponse.json(mensaje);
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}