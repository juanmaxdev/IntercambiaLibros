import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();

    // Validación de campos requeridos
    const requiredFields = ['nombre', 'apellidos', 'email', 'titulo', 'mensaje', 'fecha_envio'];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: 'Faltan campos requeridos',
          missingFields,
        },
        { status: 400 }
      );
    }

    // Enviar los datos a la API remota
    const response = await fetch("https://intercambialibros-omega.vercel.app/api/contacto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
    return NextResponse.json(
      {
        error: 'Error procesando el reporte',
        details: error.message,
      },
      { status: 500 }
    );
  }
}