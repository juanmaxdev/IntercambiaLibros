import { supabase } from '@/lib/supabase';
import bcrypt from 'bcrypt';

/**
 * Iniciar sesión de un usuario con correo y contraseña.
 * Esta función puede ser usada para validación si se integra externamente (no con NextAuth).
 */
export async function iniciarSesion({ correo_electronico, contrasena }) {
  try {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('correo_electronico', correo_electronico)
      .single();

    if (error || !usuario) {
      throw new Error('Correo o contraseña incorrectos');
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      throw new Error('Correo o contraseña incorrectos');
    }

    // Devuelve solo los datos necesarios (sin generar token)
    return {
      message: 'Inicio de sesión exitoso',
      user: {
        nombre_usuario: usuario.nombre_usuario,
        correo_electronico: usuario.correo_electronico,
        reputacion: usuario.reputacion,
        ubicacion: usuario.ubicacion,
      },
    };
  } catch (err) {
    throw err;
  }
}