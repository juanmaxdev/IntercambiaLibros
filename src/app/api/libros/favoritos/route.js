import { auth } from "@/server/auth";
import { librosFavoritos, agregarLibroAFavoritos, eliminarLibroDeFavoritos, } from "@/services/favoritosService";
  
  export async function GET() {
    try {
      const libros = await librosFavoritos();
      return Response.json(libros);
    } catch (err) {
      console.error("Error en la API de favoritos:", err);
      return Response.json({ error: err.message || "Error interno" }, { status: 500 });
    }
  }
  
  export async function POST(request) {
    try {
      const { id_libro } = await request.json();
      await agregarLibroAFavoritos(id_libro);
      return Response.json({ message: "Libro añadido a favoritos" });
    } catch (err) {
      console.error("Error en la API POST favoritos:", err);
      return Response.json({ error: err.message || "Error interno" }, { status: 500 });
    }
  }
  
  export async function DELETE(request) {
    try {
      const { id_libro } = await request.json();
      await eliminarLibroDeFavoritos(id_libro);
      return Response.json({ message: "Libro eliminado de favoritos" });
    } catch (err) {
      console.error("Error en la API DELETE favoritos:", err);
      return Response.json({ error: err.message || "Error interno" }, { status: 500 });
    }
  }
  