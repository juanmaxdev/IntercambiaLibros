import LibroSeleccionado from "@/components/books/libro-seleccionado"
import Link from "next/link"

// Función para obtener datos del libro directamente de Supabase
// en lugar de usar la API interna
import { obtenerLibroPorId } from "@/services/librosService"

export default async function BookPage({ params }) {
  try {
    console.log("🔍 Página de libro: Obteniendo libro con ID:", params.id)

    // Obtener el libro directamente de Supabase en lugar de usar fetch
    const libro = await obtenerLibroPorId(params.id)

    console.log("✅ Libro obtenido correctamente:", !!libro)

    return <LibroSeleccionado book={libro} />
  } catch (error) {
    console.error("❌ Error al obtener el libro:", error)

    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger">Error al cargar el libro. Por favor, inténtalo de nuevo más tarde.</div>
        <div className="mt-3 text-muted small">Detalles técnicos: {error.message}</div>
        <Link href="/" className="btn btn-primary mt-3">
          Volver a la página principal
        </Link>
      </div>
    )
  }
}
