import { supabase } from '@/lib/supabase';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { correo_electronico, contrasena } = req.body;

  if (!correo_electronico || !contrasena) {
    return res.status(400).json({ message: 'Correo y contraseña obligatorios' });
  }

  try {
    // Buscar usuario por correo electrónico
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('correo_electronico', correo_electronico)
      .single(); // Asegura que devuelve solo un usuario

    if (error || !usuario) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Comparar contraseña
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Éxito: se devuelve solo lo necesario
    return res.status(200).json({
      message: 'Inicio de sesión correcto',
      user: {
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        correo_electronico: usuario.correo_electronico,
        reputacion: usuario.reputacion,
        ubicacion: usuario.ubicacion,
      },
    });

  } catch (err) {
    return res.status(500).json({ message: 'Error del servidor' });
  }
}