import { loginUsuario } from '@/services/authService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { correo_electronico, contrasena } = req.body;

  if (!correo_electronico || !contrasena) {
    return res.status(400).json({ message: 'Correo y contraseña obligatorios' });
  }

  try {
    const response = await loginUsuario(correo_electronico, contrasena);
    return res.status(response.status).json(response.data);
  } catch (err) {
    return res.status(500).json({ message: 'Error del servidor' });
  }
}