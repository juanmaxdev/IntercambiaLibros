import { obtenerLibros } from "@/services/librosService"
import { NextResponse } from "next/server"
import { testConnection } from "@/lib/supabase"

export async function GET() {
  console.log("📚 API de libros: Iniciando solicitud GET")
  try {
    // Probar la conexión a Supabase primero
    const testResult = await testConnection()
    console.log("📚 API de libros: Resultado de prueba de conexión:", testResult)

    // Llamar al servicio para obtener los libros
    console.log("📚 API de libros: Llamando a obtenerLibros()")
    const libros = await obtenerLibros()
    console.log("📚 API de libros: Libros obtenidos:", !!libros, Array.isArray(libros) ? libros.length : "no es array")

    // Responder con los datos obtenidos
    return NextResponse.json(libros)
  } catch (error) {
    console.error("❌ Error en la API de libros:", error.message, error)
    console.error("❌ Stack trace:", error.stack)

    // Responder con un error genérico
    return NextResponse.json(
      { message: "Error al obtener libros", error: error.message, stack: error.stack },
      { status: 500 },
    )
  }
}
