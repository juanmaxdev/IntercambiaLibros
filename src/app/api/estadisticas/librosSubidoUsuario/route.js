import { NextResponse } from "next/server"
import { contarLibrosSubidosUsuario } from "@/services/estadisticasServices"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json(
      { error: "Parámetro userId requerido" },
      { status: 400 }
    )
  }

  try {
    const count = await contarLibrosSubidosUsuario(userId)
    return NextResponse.json({ count })
  } catch (err) {
    console.error("Error en API librosSubidoUsuario:", err)
    return NextResponse.json(
      { error: err.message || "Error interno" },
      { status: 500 }
    )
  }
}
