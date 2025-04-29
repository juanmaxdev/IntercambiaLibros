import { supabase } from '@/lib/supabase';


export async function enviarMensaje({ id_usuario_envia, id_usuario_recibe, contenido, libro_id }) {
    const { data, error } = await supabase.from('mensajes').insert([
      {
        id_usuario_envia,
        id_usuario_recibe,
        contenido,
        libro_id,
        estado: 'Intercambio en curso',
        fecha_envio: new Date().toISOString(),
      },
    ]).select().single();
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data;
  }