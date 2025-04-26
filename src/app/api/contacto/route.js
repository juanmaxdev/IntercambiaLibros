import { obtenerMensajes, guardarMensaje } from '@/services/contactoService';

export async function GET() {
  try {
    const mensajes = await obtenerMensajes();
    return new Response(JSON.stringify(mensajes), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error al obtener los mensajes', error: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, apellidos, email, titulo, mensaje } = body;

    // Validar campos obligatorios
    if (!nombre || !email || !titulo || !mensaje) {
      return new Response(
        JSON.stringify({ message: 'Faltan campos obligatorios' }),
        { status: 400 }
      );
    }

    const resultado = await guardarMensaje({ nombre, apellidos, email, titulo, mensaje });
    return new Response(JSON.stringify(resultado),
    console.log("FORMULARIO", resultado) ,{ status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error al guardar el mensaje', error: error.message }),
      { status: 500 }
    );
  }
}
