import { NextResponse } from "next/server";
import { obtenerReputacionUsuario } from "@/services/estadisticasServices";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId requerido" }, { status: 400 });
  }

  try {
    const reputacion = await obtenerReputacionUsuario(userId);
    return NextResponse.json({ reputacion });
  } catch (err) {
    console.error("Error obteniendo reputación:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}