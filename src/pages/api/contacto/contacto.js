import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { nombre, apellidos, email, titulo, mensaje, acepta_terminos } = req.body;

  if (!nombre || !email || !titulo || !mensaje || acepta_terminos !== true) {
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
      acepta_terminos,
    }]);

  if (error) {
    return res.status(500).json({ message: 'Error al guardar el mensaje', error: error.message });
  }

  return res.status(201).json({ message: 'Mensaje enviado correctamente' });
}