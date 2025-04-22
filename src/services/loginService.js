import { supabase } from '@/lib/supabase';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Iniciar sesión de un usuario.
 * @param {Object} param0 - Objeto con correo electrónico y contraseña.
 * @returns {Object} - Información del usuario y token JWT.
 */
export async function iniciarSesion({ correo_electronico, contrasena }) {
  try {
    // Buscar el usuario por correo electrónico
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('correo_electronico', correo_electronico)
      .single();

    if (error || !usuario) {
      throw new Error('Correo o contraseña incorrectos');
    }

    // Verificar la contraseña
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      throw new Error('Correo o contraseña incorrectos');
    }

    // Generar un token JWT
    let token;
    try {
      token = jwt.sign(
        { id: usuario.id, correo_electronico: usuario.correo_electronico },
        process.env.AUTH_SECRET,
        { expiresIn: '7d' }
      );
      console.log('✅ Token generado:', token);
    } catch (error) {
      console.error('❌ Error al generar el token JWT:', error);
      throw new Error('Error al generar el token de autenticación');
    }

    return {
      message: 'Inicio de sesión exitoso',
      user: {
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        correo_electronico: usuario.correo_electronico,
        reputacion: usuario.reputacion,
        ubicacion: usuario.ubicacion,
        token,
      },
    };
  } catch (err) {
    console.error('❌ Error en el servicio de inicio de sesión:', err);
    throw err;
  }
}

/**
 * Validar un token JWT.
 * @param {string} token - Token JWT a validar.
 * @returns {Object} - Información decodificada del token.
 */
export function validarToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);
    return decoded;
  } catch (err) {
    console.error('❌ Error al validar el token:', err);
    throw new Error('Token inválido o expirado');
  }
}