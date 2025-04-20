import { supabase } from '@/lib/supabase';
import bcrypt from 'bcrypt';

export async function loginUsuario(correo_electronico, contrasena) {
  try {
    // Buscar usuario por correo electrónico
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('correo_electronico', correo_electronico)
      .single();

    if (error || !usuario) {
      return {
        status: 401,
        data: { message: 'Correo o contraseña incorrectos' },
      };
    }

    // Comparar contraseña
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!contrasenaValida) {
      return {
        status: 401,
        data: { message: 'Correo o contraseña incorrectos' },
      };
    }

    // Éxito: se devuelve solo lo necesario
    return {
      status: 200,
      data: {
        message: 'Inicio de sesión correcto',
        user: {
          id: usuario.id,
          nombre_usuario: usuario.nombre_usuario,
          correo_electronico: usuario.correo_electronico,
          reputacion: usuario.reputacion,
          ubicacion: usuario.ubicacion,
        },
      },
    };
  } catch (err) {
    throw new Error('Error al procesar la solicitud');
  }
}