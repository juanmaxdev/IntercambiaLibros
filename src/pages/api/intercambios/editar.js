import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id, comentario, valoracion_intercambio, estado } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Falta el ID del intercambio' });
  }

  // Validación obligatoria si se marca como intercambiado
  if (estado === 'intercambiado' && (valoracion_intercambio === undefined || valoracion_intercambio === null)) {
    return res.status(400).json({ message: 'Debes valorar el intercambio para marcarlo como intercambiado' });
  }

  const { data, error } = await supabase
    .from('intercambios')
    .update({
      comentario,
      valoracion_intercambio,
      estado
    })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ message: 'Intercambio actualizado', intercambio: data[0] });
}