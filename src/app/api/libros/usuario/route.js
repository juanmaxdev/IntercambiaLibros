import { obtenerLibrosSubidosPorUsuario } from "@/services/librosService";

export async function GET(req) {
  try {
    // Obtener el correo electrónico del usuario desde los headers
    const correoElectronico = req.headers.get("correo_electronico");

    if (!correoElectronico) {
      return new Response(JSON.stringify({ error: "El correo electrónico es obligatorio" }), { status: 400 });
    }

    // Llamar al servicio para obtener los libros subidos por el usuario
    const libros = await obtenerLibrosSubidosPorUsuario(correoElectronico);

    return new Response(JSON.stringify(libros), { status: 200 });
  } catch (error) {
    console.error("Error en la API de libros por usuario:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}