import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Obtener el título del libro desde los parámetros de consulta
    const searchParams = request.nextUrl.searchParams;
    const titulo = searchParams.get('titulo');

    if (!titulo) {
      return NextResponse.json({ error: 'Se requiere el título del libro' }, { status: 400 });
    }

    // Función para normalizar texto
    const normalizarTexto = (texto) => {
      if (!texto) return '';
      return texto
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[^\w\s]/gi, ''); // Eliminar caracteres especiales
    };

    const tituloNormalizado = normalizarTexto(titulo);

    // Hacer la solicitud directamente a la API externa desde el servidor
    // Esto evita problemas de CORS porque la solicitud se hace desde el servidor, no desde el navegador
    const response = await fetch('https://intercambialibros-omega.vercel.app/api/valoraciones', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la API de valoraciones: ${response.status}`);
    }

    const data = await response.json();

    // Verificar que data sea un array
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Formato de respuesta inesperado' }, { status: 500 });
    }

    // Filtrar los comentarios según el título normalizado
    // IMPORTANTE: Verificar tanto titulo_libro como titulo
    const comentariosFiltrados = data.filter((comentario) => {
      // Obtener el título del comentario, que puede estar en titulo_libro o en titulo
      const tituloComentario = comentario.titulo_libro || comentario.titulo || '';

      if (!tituloComentario) return false;

      const tituloComentarioNormalizado = normalizarTexto(tituloComentario);

      // Comparación más flexible: verificar si uno contiene al otro
      return (
        tituloComentarioNormalizado.includes(tituloNormalizado) ||
        tituloNormalizado.includes(tituloComentarioNormalizado)
      );
    });

    return NextResponse.json(comentariosFiltrados);
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    return NextResponse.json({ error: 'Error al obtener los comentarios' }, { status: 500 });
  }
}

// Endpoint para enviar comentarios (mantener para futuras implementaciones)
export async function POST(request) {
  try {
    const comentarioData = await request.json();

    // Validar datos requeridos
    if (!comentarioData.titulo || !comentarioData.comentario || !comentarioData.valoracion) {
      return NextResponse.json({ error: 'Faltan datos requeridos (título, comentario o valoración)' }, { status: 400 });
    }

    const response = await fetch('https://intercambialibros-omega.vercel.app/api/valoraciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comentarioData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          error: 'Error al enviar los datos a la API remota',
          details: errorData,
        },
        { status: response.status }
      );
    }

    const responseData = await response.json();

    return NextResponse.json(
      {
        message: 'Reporte enviado correctamente a la API remota',
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Error al guardar el comentario' }, { status: 500 });
  }
}
