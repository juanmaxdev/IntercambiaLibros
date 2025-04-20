import { supabase } from '@/lib/supabase';
import bcrypt from 'bcrypt';

export async function registrarUsuario({ nombre_usuario, correo_electronico, contrasena, ubicacion = '', biografia = '' }) {
  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar el usuario en la base de datos
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{
        nombre_usuario,
        correo_electronico,
        contrasena: hashedPassword,
        ubicacion: ubicacion || null,
        biografia: biografia || null,
        reputacion: 0,
      }]);

    console.log('📩 Datos enviados a Supabase:', {
      nombre_usuario,
      correo_electronico,
      contrasena: hashedPassword,
      ubicacion,
      biografia,
      reputacion: 0,
    });

    if (error) {
      console.error('❌ Error al insertar usuario en la base de datos:', error);
      throw new Error('No se pudo registrar el usuario. Verifica los datos e inténtalo de nuevo.');
    }

    if (!data || data.length === 0) {
      console.error('❌ No se devolvieron datos después de la inserción.');
      throw new Error('No se devolvieron datos después de la inserción.');
    }

    return {
      message: 'Usuario creado con éxito',
      user: data[0],
    };
  } catch (err) {
    console.error('❌ Error en el servicio de registro:', err);
    throw err;
  }
}