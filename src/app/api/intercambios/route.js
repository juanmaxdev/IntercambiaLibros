import { supabase } from "@/lib/supabase";

export async function GET(req) {
  const email = req.headers.get("correo_electronico");

  if (!email) {
    return Response.json({ error: "Correo electrónico no proporcionado" }, { status: 400 });
  }

  // Obtener el usuario
  const { data: usuario, error: errorUsuario } = await supabase
    .from("usuarios")
    .select("id")
    .eq("correo_electronico", email)
    .single();

  if (errorUsuario || !usuario) {
    return Response.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const usuarioId = usuario.id;

  // Obtener intercambios donde el usuario participó
  const { data: intercambios, error: errorIntercambios } = await supabase
    .from("intercambios")
    .select("libro_id")
    .or(`usuario_id_ofrece.eq.${usuarioId},usuario_id_recibe.eq.${usuarioId}`)
    .eq("estado", "intercambiado"); // Solo mostrar los que sí se completaron

  if (errorIntercambios) {
    return Response.json({ error: "Error obteniendo intercambios" }, { status: 500 });
  }

  const libroIds = intercambios.map((i) => i.libro_id).filter(Boolean);

  if (libroIds.length === 0) {
    return Response.json([]); // sin libros
  }

  // Obtener los libros relacionados
  const { data: libros, error: errorLibros } = await supabase
    .from("libros")
    .select("*")
    .in("id", libroIds);

  if (errorLibros) {
    return Response.json({ error: "Error obteniendo libros" }, { status: 500 });
  }

  return Response.json(libros);
}