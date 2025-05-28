import { supabase } from "@/lib/supabase"

export async function obtenerGeneros() {
  try {
    const { data, error } = await supabase.from("generos").select("*").order("nombre", { ascending: true })

    if (error) {
      throw new Error(`Error al obtener géneros: ${error.message}`)
    }

    return data || []
  } catch (error) {
    throw error
  }
}
