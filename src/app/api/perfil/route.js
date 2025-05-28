import { auth } from "@/server/auth";
import { obtenerPerfil, actualizarPerfil } from "@/services/perfilService";

export async function GET() {
  try {
    const session = await auth();

    const email = session?.user?.email;
    if (!email) {
      return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }

    const usuario = await obtenerPerfil(email);
    return new Response(JSON.stringify(usuario), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }

    const body = await req.json();
    const result = await actualizarPerfil(email, body);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}