import { NextResponse } from "next/server";
import { contarFavoritosUsuario } from "@/services/estadisticasServices";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Falta el parámetro 'email'" }, { status: 400 });
  }

  try {
    const count = await contarFavoritosUsuario(email);
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}