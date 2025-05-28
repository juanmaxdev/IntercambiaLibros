import { obtenerGeneros } from "@/services/generosService"
import { NextResponse } from "next/server"
import { testConnection } from "@/lib/supabase"

export async function GET() {
  try {
    
    const testResult = await testConnection()

    const generos = await obtenerGeneros()

    return NextResponse.json(generos)
  } catch (error) {

    return NextResponse.json(
      { message: "Error al obtener géneros", error: error.message, stack: error.stack },
      { status: 500 },
    )
  }
}
