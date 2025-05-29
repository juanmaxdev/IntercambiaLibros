import { NextResponse } from "next/server"
import { obtenerLibroPorId, eliminarLibroPorId} from "@/services/librosService"

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

export async function DELETE(request, { params }) {
  try {
    const libroId = params.id

    if (!libroId) {
      return NextResponse.json({ error: "ID del libro es requerido" }, { status: 400 })
    }

    const correoElectronico = request.headers.get("correo_electronico")

    if (!correoElectronico) {
      return NextResponse.json({ error: "Usuario no autenticado" }, { status: 401 })
    }

    await eliminarLibroPorId(libroId)

    return NextResponse.json({ message: "Libro eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar libro:", error)
    return NextResponse.json({ error: `Error al eliminar libro: ${error.message}` }, { status: 500 })
  }
}