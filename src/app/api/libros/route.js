import { obtenerLibros } from "@/services/librosService"
import { NextResponse } from "next/server"
import { testConnection } from "@/lib/supabase"

export async function GET() {
  try {
    const testResult = await testConnection()

    const libros = await obtenerLibros()
    
    return NextResponse.json(libros)
  } catch (error) {

    return NextResponse.json(
      { message: "Error al obtener libros", error: error.message, stack: error.stack },
      { status: 500 },
    )
  }
}
