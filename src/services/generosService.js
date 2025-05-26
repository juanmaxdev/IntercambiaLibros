import { supabase } from "@/lib/supabase"

export async function obtenerGeneros() {
  console.log("🏷️ generosService: Iniciando obtenerGeneros()")
  try {
    console.log("🏷️ generosService: Ejecutando consulta a Supabase")
    const { data, error } = await supabase.from("generos").select("*").order("nombre", { ascending: true })

    if (error) {
      console.error("❌ generosService: Error al obtener géneros:", error.message, error)
      throw new Error(`Error al obtener géneros: ${error.message}`)
    }

    console.log("✅ generosService: Géneros obtenidos correctamente:", data?.length || 0)
    return data || []
  } catch (error) {
    console.error("❌ generosService: Excepción al obtener géneros:", error.message, error)
    throw error
  }
}
