import { supabase } from '@/lib/supabase';

// Función para obtener mensajes
export async function obtenerMensajes() {
  const { data, error } = await supabase.from('contacto').select('*');
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

// Función para guardar un mensaje
export async function guardarMensaje({ nombre, apellidos, email, titulo, mensaje }) {
  const { data, error } = await supabase.from('contacto').insert([
    {
      nombre,
      apellidos,
      email,
      titulo,
      mensaje,
      fecha_envio: new Date().toISOString().slice(0, 16), // Fecha hasta los minutos
    },
  ]);

  if (error) {
    throw new Error(error.message);
  }

  return { message: 'Mensaje enviado correctamente', data };
}