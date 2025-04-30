import { supabase } from '@/lib/supabase';
import { subidaLibros } from '@/services/librosService';
import { getUsuarioId } from '@/services/getUsuarioId';
import { auth } from "@/server/auth";

export async function POST(req) {
  try {
    const session = await auth();
    const emailUsuario = session?.user?.email;

    if (!emailUsuario) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await req.formData();
    const archivo = formData.get("archivo");

    if (!archivo || typeof archivo === "string") {
      return Response.json({ error: "El archivo es obligatorio" }, { status: 400 });
    }

    // Obtener el ID real (UUID) del usuario
    let usuario_id;
    try {
      usuario_id = await getUsuarioId(emailUsuario);
    } catch (error) {
      console.error("❌ No se encontró el usuario con ese email:", error);
      return Response.json({ error: "No se pudo encontrar el usuario." }, { status: 400 });
    }

    // Extraer los demás campos
    const titulo = formData.get("titulo");
    const autor = formData.get("autor");
    const genero_id = parseInt(formData.get("genero_id"), 10);
    const estado_libro = formData.get("estado_libro");
    const descripcion = formData.get("descripcion");
    const donacion = formData.get("donacion") === "true";
    const ubicacion = formData.get("ubicacion");
    const isbn = formData.get("isbn") || "";
    const tipo_tapa = formData.get("tipo_tapa") || "";
    const editorial = formData.get("editorial") || "";
    const metodo_intercambio = formData.get("metodoIntercambio") || "Presencial";

    // Subir imagen a Supabase
    const ext = archivo.name.split('.').pop();
    const filePath = `subidas/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('portada-libros')
      .upload(filePath, archivo.stream(), {
        contentType: archivo.type,
      });

    if (uploadError) {
      console.error('❌ Error al subir la imagen:', uploadError);
      return Response.json({ error: 'Error al subir el archivo a Supabase' }, { status: 500 });
    }

    const { publicURL, error: urlError } = supabase
      .storage
      .from('portada-libros')
      .getPublicUrl(filePath);

    if (urlError) {
      console.error('❌ Error al obtener URL pública:', urlError);
      return Response.json({ error: 'Error al obtener la URL pública del archivo' }, { status: 500 });
    }

    // Guardar libro en la base de datos
    const libroGuardado = await subidaLibros({
      fields: {
        isbn,
        titulo,
        autor,
        genero_id,
        estado_libro,
        descripcion,
        donacion,
        ubicacion,
        usuario_id,
        tipo_tapa,
        editorial,
        metodo_intercambio,
        imagenes: publicURL,
      },
    });

    return Response.json({
      message: 'Libro registrado correctamente',
      libro: libroGuardado,
    }, { status: 201 });

  } catch (err) {
    console.error('Error en la API:', err);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}