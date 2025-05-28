import { supabase } from "@/lib/supabase";

export async function obtenerPerfil(email) {
  if (!email) {
    throw new Error("El email es obligatorio");
  }

  const { data: usuario, error } = await supabase
    .from("usuarios")
    .select("id, nombre_usuario, correo_electronico, ubicacion, biografia, reputacion, fecha_registro")
    .eq("correo_electronico", email)
    .single();

  if (error || !usuario) {
    throw new Error("Usuario no encontrado");
  }

  return usuario;
}

export async function actualizarPerfil(email, updatedData) {
  if (!email) {
    throw new Error("El email es obligatorio");
  }

  const { error } = await supabase
    .from("usuarios")
    .update(updatedData)
    .eq("correo_electronico", email);

  if (error) {
    throw new Error("No se pudieron actualizar los datos");
  }

  return { message: "Datos actualizados correctamente" };
}