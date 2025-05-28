import { NextResponse } from "next/server"
import { obtenerLibroPorId } from "@/services/librosService"

export async function GET(request, { params }) {
  try {
    const libro = await obtenerLibroPorId(params.id)

    if (!libro) {
      return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 })
    }
    return NextResponse.json(libro)
  } catch (error) {
    return NextResponse.json({ error: `Error al obtener libro: ${error.message}` }, { status: 500 })
  }
}
