import { supabase } from "@/lib/supabase";
import { auth } from "@/server/auth";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const libroId = Number(searchParams.get("id"));
  const session = await auth();
  const email = session?.user?.email;

  if (!email || !libroId) {
    return Response.json({ enFavoritos: false });
  }

  const { data, error } = await supabase
    .from("libros_favoritos")
    .select("id")
    .eq("id_usuario", email)
    .eq("id_libro", libroId)
    .single();

  return Response.json({ enFavoritos: !!data });
}