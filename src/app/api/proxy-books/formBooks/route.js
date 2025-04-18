export async function POST(req) {
  try {
    // Leer el cuerpo de la solicitud como FormData
    const formData = await req.formData();

    // Crear un objeto para enviar el FormData a la API externa
    const response = await fetch('https://intercambialibros-omega.vercel.app/api/libros', {
      method: 'POST',
      body: formData, // Enviar el FormData directamente
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Error en la solicitud POST: ${response.status} - ${errorDetails}`);
    }

    const data = await response.json();

    // Devolver la respuesta de la API externa
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al realizar la solicitud POST:', error);

    // Manejar errores y devolver una respuesta adecuada
    return new Response(
      JSON.stringify({ error: 'Error al realizar la solicitud POST', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}