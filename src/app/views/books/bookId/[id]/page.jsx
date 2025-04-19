import LibroSeleccionado from "@/components/books/libro-seleccionado";
import Link from "next/link";

// Actualizar la función para usar una URL absoluta en el servidor
async function getBookData(id) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // Usar una URL base, cambiar cuando se haga el despliegue
    const response = await fetch(`${baseUrl}/api/proxy-books`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error al obtener los libros: ${response.status}`);
    }

    const books = await response.json();

    // Validar que la respuesta sea un array antes de buscar el libro
    if (!Array.isArray(books)) {
      throw new Error("La respuesta de la API no es válida.");
    }

    const book = books.find((book) => book.id === Number.parseInt(id));

    if (!book) {
      throw new Error(`No se encontró el libro con ID: ${id}`);
    }

    return book;
  } catch (error) {
    console.error("Error al obtener datos del libro:", error);

    // Retornar un objeto de error para manejarlo en la interfaz
    return {
      error: true,
      message: error.message || "Error desconocido al obtener los datos del libro."
    };
  }
}

export default async function BookPage({ params }) {
  const resolvedParams = await params; // Aseguramos que params sea esperado
  const bookData = await getBookData(resolvedParams.id);

  if (bookData.error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger">
          {bookData.message}
        </div>
        <Link href="/" className="btn btn-primary mt-3">
          Volver a la página principal
        </Link>
      </div>
    );
  }

  return <LibroSeleccionado book={bookData} />;
}
