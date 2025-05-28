import { auth } from "@/server/auth"
import { obtenerIntercambios } from "@/services/intercambiosService"

export async function GET() {
  try {
    const session = await auth()
    const email = session?.user?.email

    if (!email) {
      return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 })
    }

    const intercambios = await obtenerIntercambios(email)
    return new Response(JSON.stringify(intercambios), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}
