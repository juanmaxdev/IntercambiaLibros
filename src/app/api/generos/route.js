import { obtenerGeneros } from "@/services/generosService"
import { NextResponse } from "next/server"
import { testConnection } from "@/lib/supabase"

export async function GET() {
  console.log("🏷️ API de géneros: Iniciando solicitud GET")
  try {
    // Probar la conexión a Supabase primero
    const testResult = await testConnection()
    console.log("🏷️ API de géneros: Resultado de prueba de conexión:", testResult)

    console.log("🏷️ API de géneros: Llamando a obtenerGeneros()")
    const generos = await obtenerGeneros()
    console.log(
      "🏷️ API de géneros: Géneros obtenidos:",
      !!generos,
      Array.isArray(generos) ? generos.length : "no es array",
    )

    return NextResponse.json(generos)
  } catch (error) {
    console.error("❌ Error en la API de géneros:", error.message, error)
    console.error("❌ Stack trace:", error.stack)

    return NextResponse.json(
      { message: "Error al obtener géneros", error: error.message, stack: error.stack },
      { status: 500 },
    )
  }
}
