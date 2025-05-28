import { supabase } from '@/lib/supabase';
import bcrypt from 'bcrypt';

export async function registrarUsuario({ nombre_usuario, correo_electronico, contrasena, ubicacion = null, biografia = null }) {
  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const { data, error } = await supabase
      .from('usuarios')
      .insert([{
        nombre_usuario,
        correo_electronico,
        contrasena: hashedPassword,
        ubicacion,
        biografia,
        reputacion: 0, 
      }])
      .select();

    if (error) {
      throw new Error('No se pudo registrar el usuario. Verifica los datos e inténtalo de nuevo.');
    }

    if (!data || data.length === 0) {
      return {
        message: 'Usuario creado, pero no se devolvieron datos.',
      };
    }

    return {
      message: 'Usuario creado con éxito',
      user: data[0],
    };
  } catch (err) {
    throw err;
  }
}