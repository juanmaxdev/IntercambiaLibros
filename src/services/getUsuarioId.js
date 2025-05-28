import { supabase } from '@/lib/supabase';

export async function getUsuarioId(email) {
  if (!email) {
    throw new Error("El correo electrónico es obligatorio");
  }

  try {
    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("id")
      .eq("correo_electronico", email)
      .single();

    if (error || !usuario) {
      throw new Error("Usuario no encontrado");
    }

    return usuario.id;
  } catch (error) {
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { email } = req.body;

  try {
    const id = await getUsuarioId(email);
    res.status(200).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}