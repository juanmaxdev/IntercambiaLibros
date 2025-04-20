import nextConnect from 'next-connect';
import multer from 'multer';

// Configuración de almacenamiento en disco local (puedes cambiarlo)
const upload = multer({
  storage: multer.memoryStorage(), // o diskStorage si quieres guardarlo localmente
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB límite
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Error en el middleware: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  },
});

// Campo `archivo` debe coincidir con el nombre del input de tipo file
apiRoute.use(upload.single('archivo'));

apiRoute.post(async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No se ha subido ningún archivo' });
  }

  // Aquí podrías subirlo a Supabase, S3, etc.
  res.status(200).json({
    message: 'Archivo recibido correctamente',
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
  });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // ¡Importante para multer!
  },
};

