import { iniciarSesion } from '@/services/loginService';

export async function POST(req) {
  try {
    const body = await req.json();
    const { correo_electronico, contrasena } = body;

    // Validar campos obligatorios
    if (!correo_electronico || !contrasena) {
      return new Response(
        JSON.stringify({ message: 'Correo y contraseña son obligatorios' }),
        { status: 400 }
      );
    }

    // Llamar al servicio para iniciar sesión
    const resultado = await iniciarSesion({ correo_electronico, contrasena });

    // Responder con éxito
    return new Response(JSON.stringify(resultado), { status: 200 });
  } catch (error) {
    console.error('❌ Error en la API de login:', error);

    // Manejo de errores específicos
    if (error.message.includes('Correo o contraseña incorrectos')) {
      return new Response(
        JSON.stringify({ message: error.message }),
        { status: 401 }
      );
    }

    // Respuesta genérica para errores del servidor
    return new Response(
      JSON.stringify({ message: 'Error del servidor', error: error.message }),
      { status: 500 }
    );
  }
}