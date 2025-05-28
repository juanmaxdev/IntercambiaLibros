import { iniciarSesion } from '@/services/loginService';

export async function POST(req) {
  try {
    const body = await req.json();
    const { correo_electronico, contrasena } = body;

    if (!correo_electronico || !contrasena) {
      return new Response(
        JSON.stringify({ message: 'Correo y contraseña son obligatorios' }),
        { status: 400 }
      );
    }

    const resultado = await iniciarSesion({ correo_electronico, contrasena });

    return new Response(JSON.stringify(resultado), { status: 200 });
  } catch (error) {

    if (error.message.includes('Correo o contraseña incorrectos')) {
      return new Response(
        JSON.stringify({ message: error.message }),
        { status: 401 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Error del servidor', error: error.message }),
      { status: 500 }
    );
  }
}