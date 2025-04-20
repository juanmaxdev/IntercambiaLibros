import nextConnect from 'next-connect';
import multer from 'multer';
import { subirLibro } from '@/services/libros/librosService';

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
  try {
    const dataLibro = {
      isbn: req.body.isbn,
      titulo: req.body.titulo,
      autor: req.body.autor,
      genero_id: req.body.genero_id,
      estado_libro: req.body.estado_libro,
      descripcion: req.body.descripcion,
      donacion: req.body.donacion,
      ubicacion: req.body.ubicacion,
      usuario_id: req.body.usuario_id,
      valoracion_del_libro: req.body.valoracion_del_libro || 0,
      tipo_tapa: req.body.tipo_tapa || '',
      editorial: req.body.editorial || '',
      metodo_intercambio: req.body.metodo_intercambio || 'Presencial',
    };

    const libro = await subirLibro(dataLibro, req.file);
    return res.status(201).json(libro);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default apiRoute;