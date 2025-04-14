import { notFound } from 'next/navigation';
import LibroSeleccionado from '@/components/books/libro-seleccionado';

// Esta función obtiene los datos del libro según el ID
async function getBookData(id) {
  try {
    // En lugar de intentar obtener un libro específico por ID,
    // obtenemos todos los libros y filtramos por ID
    const response = await fetch('https://intercambialibros2.vercel.app/api/libros', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener los libros: ${response.status}`);
    }

    const books = await response.json();

    // Buscamos el libro con el ID especificado
    const book = books.find((book) => book.id === Number.parseInt(id));

    if (!book) {
      throw new Error(`No se encontró el libro con ID: ${id}`);
    }

    return book;
  } catch (error) {
    console.error('Error al obtener datos del libro:', error);
    return null;
  }
}

export default async function BookPage({ params }) {
  const bookData = await getBookData(params.id);

  if (!bookData) {
    notFound();
  }

  return <LibroSeleccionado book={bookData} />;
}
