import { NextResponse } from "next/server"
import { testSupabaseConnection } from "@/lib/supabase"

export async function GET() {
  try {
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅" : "❌",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅" : "❌",
      VERCEL_URL: process.env.VERCEL_URL || "No disponible",
      NODE_ENV: process.env.NODE_ENV || "No disponible",
    }

    const connectionTest = await testSupabaseConnection()

    return NextResponse.json({
      status: "success",
      message: "API de prueba de conexión",
      environment: process.env.NODE_ENV,
      environmentVariables: envVars,
      supabaseConnection: connectionTest,
      serverTime: new Date().toISOString(),
    })
  } catch (error) {

    return NextResponse.json(
      {
        status: "error",
        message: "Error al probar la conexión",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
