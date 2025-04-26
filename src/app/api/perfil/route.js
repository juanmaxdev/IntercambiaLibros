import { obtenerPerfil, actualizarPerfil } from "@/services/perfilService";

export async function GET(req) {
  try {
    const email = req.headers.get("email");

    if (!email) {
      return new Response(JSON.stringify({ error: "El email es obligatorio" }), { status: 400 });
    }

    const usuario = await obtenerPerfil(email);
    return new Response(JSON.stringify(usuario), { status: 200 });
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { email, ...updatedData } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: "El email es obligatorio" }), { status: 400 });
    }

    const result = await actualizarPerfil(email, updatedData);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}