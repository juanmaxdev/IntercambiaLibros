import { supabase } from '@/lib/supabase';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const {
    nombre_usuario,
    correo_electronico,
    contrasena,
    ubicacion = '',
    biografia = ''
  } = req.body;

  if (!nombre_usuario || !correo_electronico || !contrasena) {
    return res.status(400).json({
      message: 'Nombre, correo y contraseña son obligatorios'
    });
  }

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
        fecha_registro: new Date().toISOString(),
        reputacion: 0,
      }])
      .select();

    if (error) {
      console.error('❌ Error Supabase:', error);
      return res.status(500).json({
        message: 'Error al crear el usuario',
        error: error.message || error.details || error
      });
    }

    return res.status(201).json({
      message: 'Usuario creado con éxito',
      user: data[0],
    });

  } catch (err) {
    console.error('❌ Error general:', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
}