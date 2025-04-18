import nextConnect from 'next-connect';
import multer from 'multer';
import { supabase } from '@/lib/supabase';

// Configuración de multer para recibir archivos desde el form-data
const upload = multer({ storage: multer.memoryStorage() });

const apiRoute = nextConnect({
  onError(error, req, res) => {
    res.status(501).json({ error: `Error en la API: ${error.message}` });
  },
  onNoMatch(req, res) => {
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  },
});

// ✅ GET - Obtener libros
apiRoute.get(async (req, res) => {
  const { data, error } = await supabase
    .from('libros')
    .select(`
      id,
      isbn,
      titulo,
      autor,
      estado_libro,
      descripcion,
      donacion,
      ubicacion,
      imagenes,
      usuario_id,
      estado_intercambio,
      fecha_subida,
      valoracion_del_libro,
      tipo_tapa,
      editorial,
      metodo_intercambio,
      usuarios:usuario_id (
        nombre_usuario
      ),
      generos:genero_id (
        nombre
      )
    `);

  if (error) return res.status(500).json({ error: error.message });

  const formateado = data.map(({ usuarios, generos, ...libro }) => ({
    ...libro,
    nombre_usuario: usuarios?.nombre_usuario || 'Desconocido',
    nombre_genero: generos?.nombre || 'Sin género'
  }));

  return res.status(200).json(formateado);
});

// ✅ POST - Subir nuevo libro con posible imagen
apiRoute.post(upload.single('archivo'), async (req, res) => {
  const {
    isbn,
    titulo,
    autor,
    genero_id,
    estado_libro,
    descripcion,
    donacion,
    ubicacion,
    usuario_id,
    valoracion_del_libro = 0,
    tipo_tapa = '',
    editorial = '',
    metodo_intercambio = 'Presencial'
  } = req.body;

  let urlImagen = req.body.imagenes || '';

  // Si hay archivo, lo subimos a Supabase Storage
  if (req.file) {
    const { buffer, originalname, mimetype } = req.file;
    const extension = originalname.split('.').pop();
    const fileName = `${Date.now()}.${extension}`;
    const filePath = `subidas/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portada-libros')
      .upload(filePath, buffer, {
        contentType: mimetype
      });

    if (uploadError) {
      return res.status(500).json({ error: 'Error al subir la imagen' });
    }

    urlImagen = `https://heythjlroyqoqhqbmtlc.supabase.co/storage/v1/object/public/portada-libros/${filePath}`;
  }

  const fecha = new Date();
  const fecha_subida = fecha.toISOString().slice(0, 16);

  const { data, error } = await supabase
    .from('libros')
    .insert([{
      isbn,
      titulo,
      autor,
      genero_id,
      estado_libro,
      descripcion,
      donacion,
      ubicacion,
      imagenes: urlImagen,
      usuario_id,
      fecha_subida,
      valoracion_del_libro,
      tipo_tapa,
      editorial,
      metodo_intercambio
    }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json(data[0]);
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // necesario para usar multer
  },
};