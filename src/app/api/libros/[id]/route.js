import { eliminarLibroPorId } from '@/services/librosService';

export async function DELETE(_req, { params }) {
  const { id } = params;

  if (!id) {
    return Response.json({ error: "ID requerido" }, { status: 400 });
  }

  try {
    await eliminarLibroPorId(id);
    return Response.json({ message: "Libro eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar libro:", err);
    return Response.json({ error: err.message || "Error interno" }, { status: 500 });
  }
}