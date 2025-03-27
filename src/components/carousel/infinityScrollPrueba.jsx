'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function InfinityScrollBooks() {

  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const response = await fetch(`https://libros1.p.rapidapi.com/books?page=${page}`, {
        headers: {
          Accept: 'application/ld+json',
          'x-rapidapi-host': 'libros1.p.rapidapi.com',
          'x-rapidapi-key': 'ccc0f92020mshc41f3953985afa6p1e16fbjsnef48a115262f',
        },
      });

      if (!response.ok) throw new Error('Error al obtener los libros');

      const data = await response.json();
      console.log('Respuesta de la API:', data); // Para depurar

      const newBooks = data["hydra:member"] || [];

      if (newBooks.length === 0) {
        setHasMore(false);
      } else {
        setBooks((prevBooks) => [...prevBooks, ...newBooks]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('Error al cargar los libros:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();

    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        fetchBooks();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <h1 className="text-center my-4">Libros</h1>
      <div className="container">
        {books.map((book, index) => (
          <div key={`${book.id}-${index}`} className="row mb-4">
            <img src={book.image} alt={book.title} className="img-fluid" style={{ maxWidth: '150px' }} />
            <h5>{book.title}</h5>
            <p>{book.author}</p>
          </div>
        ))}
      </div>
      {loading && <p className="text-center">Cargando más libros...</p>}
      {!hasMore && <p className="text-center">¡No hay más libros para mostrar!</p>}
    </div>
  );
}

