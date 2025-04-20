import nextConnect from 'next-connect';
import multer from 'multer';
import { supabase } from '@/lib/supabase';

export const config = {
  api: {
    bodyParser: false, // Multer se encarga del multipart
  },
};

const upload = multer({ storage: multer.memoryStorage() });

const apiRoute = nextConnect({
  onError(err, req, res) {
    console.error('Error en la API:', err);
    res.status(500).json({ error: `Error en la API: ${err.message}` });
  },
  onNoMatch(req, res) {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  },
});

// Middleware para procesar el archivo ‘archivo’ sólo en POST
apiRoute.use(upload.single('archivo'));

apiRoute.post(async (req, res) => {
  const {
    isbn, titulo, autor, genero_id, estado_libro,
    descripcion, donacion, ubicacion, usuario_id,
    valoracion_del_libro = 0, tipo_tapa = '',
    editorial = '', metodo_intercambio = 'Presencial'
  } = req.body;

  let urlImagen = req.body.imagenes || '';

  if (req.file) {
    const { buffer, originalname, mimetype } = req.file;
    const ext = originalname.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = `subidas/${fileName}`;

    const { error: uploadError } = await supabase
      .storage
      .from('portada-libros')
      .upload(filePath, buffer, { contentType: mimetype });

    if (uploadError) {
      console.error('Error al subir imagen:', uploadError);
      return res.status(500).json({ error: 'Error al subir la imagen' });
    }

    urlImagen = `https://heythjlroyqoqhqbmtlc.supabase.co/storage/v1/object/public/portada-libros/${filePath}`;
  }

  const fecha_subida = new Date().toISOString().slice(0, 16);

  const { data, error } = await supabase
    .from('libros')
    .insert([{
      isbn, titulo, autor, genero_id, estado_libro,
      descripcion, donacion, ubicacion, imagenes: urlImagen,
      usuario_id, fecha_subida, valoracion_del_libro,
      tipo_tapa, editorial, metodo_intercambio
    }])
    .select();

  if (error) {
    console.error('Error al insertar libro:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(data[0]);
});

export default apiRoute;