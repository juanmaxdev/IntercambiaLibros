// Agregar un proxy para evitar problemas de CORS en desarrollo
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api/proxy' 
  : 'https://intercambialibros2.vercel.app/api';

export const fetchBooks = async (page) => {
  const response = await fetch(`${API_BASE_URL}/libros?page=${page}`);
  if (!response.ok) {
    throw new Error('Error al obtener los libros');
  }
  return response.json();
};