import { NextResponse } from "next/server"
import { obtenerLibroPorId } from "@/services/librosService"

export async function GET(request, { params }) {
  try {
    console.log("📚 API: Solicitando libro con ID:", params.id)

    const libro = await obtenerLibroPorId(params.id)

    if (!libro) {
      console.log("❌ API: Libro no encontrado con ID:", params.id)
      return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 })
    }

    console.log("✅ API: Libro encontrado con ID:", params.id)
    return NextResponse.json(libro)
  } catch (error) {
    console.error("❌ API: Error al obtener libro por ID:", error)
    return NextResponse.json({ error: `Error al obtener libro: ${error.message}` }, { status: 500 })
  }
}
