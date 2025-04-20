import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
    const { data, error } = await supabase
      .from('generos')
      .select('id, nombre, imagen');

    if (error) {
      return NextResponse.json({ message: 'Error al obtener géneros', error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  
}
