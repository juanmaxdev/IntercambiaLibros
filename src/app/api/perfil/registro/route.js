import { registrarUsuario } from '@/services/registroService';

export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre_usuario, correo_electronico, contrasena, ubicacion, biografia } = body;

    // Validar campos obligatorios
    if (!nombre_usuario || !correo_electronico || !contrasena) {
      return new Response(
        JSON.stringify({ message: 'Nombre, correo y contraseña son obligatorios' }),
        { status: 400 }
      );
    }

    // Llamar al servicio para registrar al usuario
    const resultado = await registrarUsuario({
      nombre_usuario,
      correo_electronico,
      contrasena,
      ubicacion,
      biografia,
    });

    // Responder con éxito
    return new Response(JSON.stringify(resultado), { status: 201 });
  } catch (error) {
    console.error('❌ Error en la API de registro:', error);

    // Manejo de errores específicos
    if (error.message.includes('No se pudo registrar el usuario')) {
      return new Response(
        JSON.stringify({ message: error.message }),
        { status: 400 }
      );
    }

    // Respuesta genérica para errores del servidor
    return new Response(
      JSON.stringify({ message: 'Error del servidor', error: error.message }),
      { status: 500 }
    );
  }
}