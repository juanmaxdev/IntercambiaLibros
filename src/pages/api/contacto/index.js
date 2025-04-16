import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('contacto')
      .select('*');

    if (error) {
      return res.status(500).json({ message: 'Error al obtener los mensajes', error: error.message });
    }

    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { nombre, apellidos, email, titulo, mensaje, acepta_terminos } = req.body;

    if (!nombre || apellidos || !email || !titulo || !mensaje !== true) {
      return res.status(400).json({ message: 'Faltan campos obligatorios o términos no aceptados' });
    }

    const { data, error } = await supabase
      .from('contacto')
      .insert([{
        nombre,
        apellidos,
        email,
        titulo,
        mensaje,
        fecha_envio: new Date().toISOString().slice(0, 16), // opcional: añade fecha con precisión hasta minutos
      }]);

    if (error) {
      return res.status(500).json({ message: 'Error al guardar el mensaje', error: error.message });
    }

    return res.status(201).json({ message: 'Mensaje enviado correctamente' });
  }

  return res.status(405).json({ message: 'Método no permitido' });
}