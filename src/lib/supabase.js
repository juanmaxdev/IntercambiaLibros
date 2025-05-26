import { createClient } from "@supabase/supabase-js"

// Obtener las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Verificar que las variables de entorno estén disponibles
console.log("🔑 Supabase URL disponible:", !!supabaseUrl)
console.log("🔑 Supabase Anon Key disponible:", !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ ERROR: Variables de entorno de Supabase no configuradas correctamente")
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "Configurado" : "No configurado")
  console.error("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "Configurado" : "No configurado")
}

// Crear el cliente de Supabase
export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  auth: {
    persistSession: false, // Desactivar persistencia de sesión para evitar problemas en SSR
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})

// Función para probar la conexión y las credenciales
export async function testConnection() {
  try {
    const { data, error } = await supabase.from("libros").select("id").limit(1)

    if (error) {
      console.error("❌ Error al probar conexión con Supabase:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Conexión con Supabase exitosa")
    return { success: true, data }
  } catch (error) {
    console.error("❌ Excepción al probar conexión con Supabase:", error)
    return { success: false, error: error.message }
  }
}

// Exportar el cliente para usarlo en toda la aplicación
export default supabase
