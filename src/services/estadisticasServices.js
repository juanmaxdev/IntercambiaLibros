import { supabase } from "@/lib/supabase"

/**
 * Cuenta cuántos libros ha subido un usuario.
 * @param {string|number} userId — ID del usuario.
 * @returns {Promise<number>}
 */
export async function contarLibrosSubidosUsuario(userId) {
  if (!userId) throw new Error("El parámetro userId es obligatorio");

  const { count, error } = await supabase
    .from("libros")
    .select("id", { count: "exact", head: true })
    .eq("usuario_id", Number(userId)); 

  if (error) throw new Error(error.message);
  return count ?? 0;
}

/**
 * Cuenta cuántos intercambios ha realizado un usuario.
 * @param {string|number} userId
 * @returns {Promise<number>}
 */
export async function contarIntercambiosUsuario(userId) {
  if (!userId) throw new Error("El parámetro userId es obligatorio")

  const { count, error } = await supabase
    .from("intercambios")        // ← TU TABLA DE INTERCAMBIOS
    .select("id", { count: "exact", head: true })
    .eq("usuario_id", userId)   // ← EL CAMPO QUE RELACIONA INTERCAMBIO→USUARIO

  if (error) {
    console.error("Error contando intercambios:", error)
    throw new Error(error.message)
  }
  return count ?? 0
}

/**
 * Cuenta los libros que un usuario ha marcado como favoritos.
 * @param {string} email - El correo del usuario (id_usuario en la tabla).
 * @returns {Promise<number>}
 */
export async function contarFavoritosUsuario(email) {
  if (!email) throw new Error("El correo del usuario es obligatorio");

  const { count, error } = await supabase
    .from("libros_favoritos")
    .select("id", { count: "exact", head: true })
    .eq("id_usuario", email); // ← es el correo

  if (error) {
    console.error("Error contando favoritos:", error);
    throw new Error(error.message);
  }

  return count ?? 0;
}

/**
 * Obtiene la reputación de un usuario (campo `reputacion` en la tabla usuarios).
 * @param {string|number} userId
 * @returns {Promise<number>}
 */
export async function obtenerReputacionUsuario(userId) {
  if (!userId) throw new Error("El parámetro userId es obligatorio");

  const { data, error } = await supabase
    .from("usuarios")
    .select("reputacion")
    .eq("id", Number(userId)) // 👈 muy importante que sea número
    .single();

  if (error) {
    console.error("Error al obtener reputación:", error);
    throw new Error(error.message);
  }

  return data?.reputacion ?? 0;
}