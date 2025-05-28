import { supabase } from "@/lib/supabase";
import { auth } from "@/server/auth";

/**
 * Devuelve la lista de libros favoritos del usuario autenticado.
 * @returns {Promise<Array>} - Libros favoritos del usuario.
 */
export async function librosFavoritos() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) throw new Error("Usuario no autenticado");

  // Obtener ids de libros favoritos del usuario
  const { data: favoritos, error: favError } = await supabase
    .from("libros_favoritos")
    .select("id_libro")
    .eq("id_usuario", email);

  if (favError) {
    throw new Error("Error al obtener favoritos: " + favError.message);
  }

  const libroIds = favoritos.map((f) => f.id_libro);

  if (libroIds.length === 0) {
    return [];
  }

  const { data: libros, error: libroError } = await supabase
    .from("libros")
    .select("*")
    .in("id", libroIds);

  if (libroError) {
    throw new Error("Error al obtener libros favoritos: " + libroError.message);
  }

  return libros;
}


/**
 * Agrega un libro a la lista de favoritos del usuario autenticado.
 * @param {number} id_libro - ID del libro a agregar
 * @returns {Promise<void>}
 */
export async function agregarLibroAFavoritos(id_libro) {
    const session = await auth();
    const email = session?.user?.email;
  
    if (!email) throw new Error("Usuario no autenticado");
    if (!id_libro) throw new Error("ID del libro es requerido");
  
    const { error } = await supabase
      .from("libros_favoritos")
      .insert([{ id_usuario: email, id_libro }]);
  
    if (error) {
      throw new Error("Error al guardar favorito: " + error.message);
    }
  }


  /**
 * Elimina un libro de la lista de favoritos del usuario autenticado.
 * @param {number} id_libro - ID del libro a eliminar
 * @returns {Promise<void>}
 */
export async function eliminarLibroDeFavoritos(id_libro) {
    const session = await auth();
    const email = session?.user?.email;
  
    if (!email) throw new Error("Usuario no autenticado");
    if (!id_libro) throw new Error("ID del libro es requerido");
  
    const { error } = await supabase
      .from("libros_favoritos")
      .delete()
      .eq("id_usuario", email)
      .eq("id_libro", id_libro);
  
    if (error) {
      throw new Error("Error al eliminar favorito: " + error.message);
    }
  }  