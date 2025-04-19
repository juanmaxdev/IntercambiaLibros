export async function GET() {
  try {
    const response = await fetch("https://intercambialibros-omega.vercel.app/api/libros", {
      cache: "no-store", // Don't cache the response
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `API responded with status: ${response.status}` }), {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching books:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch books from external API" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const data = {}

    formData.forEach((value, key) => {
      data[key] = value
    })

    // Validación de campos requeridos en el servidor
    const requiredFields = [
      "titulo",
      "autor",
      "ubicacion",
      "estado",
      "metodoIntercambio",
      "tipoIntercambio",
      "descripcion",
    ]
    const missingFields = requiredFields.filter((field) => !data[field])

    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({
          error: "Faltan campos requeridos",
          missingFields,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    // Validar que se haya subido un archivo
    if (!data.archivo || !(data.archivo instanceof File)) {
      return new Response(
        JSON.stringify({
          error: "Se requiere una imagen del libro",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    // Aquí puedes procesar los datos recibidos o enviarlos a otra API si es necesario
    console.log("Datos recibidos:", data)

    return new Response(
      JSON.stringify({
        message: "Libro registrado correctamente",
        data: {
          titulo: data.titulo,
          autor: data.autor,
          // Omitir el archivo en la respuesta para no sobrecargar
          // Otros campos relevantes...
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error procesando el formulario:", error)
    return new Response(
      JSON.stringify({
        error: "Error procesando el formulario",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
