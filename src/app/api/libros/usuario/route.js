import { auth } from "@/server/auth";
import { obtenerLibrosSubidosPorUsuario } from "@/services/librosService";

export async function GET(req) {
  try {

    const correoElectronico = req.headers.get("correo_electronico");

    if (!correoElectronico) {
      return new Response(JSON.stringify({ error: "El correo electrónico es obligatorio" }), { status: 400 });
    }


    const libros = await obtenerLibrosSubidosPorUsuario(correoElectronico);

    return new Response(JSON.stringify(libros), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}