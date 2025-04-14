'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function InfinityScrollBooks() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [loadedIds, setLoadedIds] = useState(new Set());

  const fetchBooks = async (pageNum) => {
    if (!hasMore || loading) return;

    setLoading(true);
    setError(null);

    try {
      console.log(`Cargando página ${pageNum}...`);
      const response = await fetch(`/api/proxy-books?page=${pageNum}`);

      if (!response.ok) {
        throw new Error(`Error al obtener los libros: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Datos recibidos:`, data);

      // Si no hay datos o el array está vacío, no hay más libros para cargar
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.log('No hay más libros para cargar');
        setHasMore(false);
        setLoading(false);
        return;
      }

      // Filtrar libros ya cargados para evitar duplicados
      const newBooks = data.filter((book) => {
        return book.id && !loadedIds.has(book.id);
      });

      console.log(`Libros nuevos después de filtrar:`, newBooks.length);

      // Si no hay libros nuevos después de filtrar, no hay más para cargar
      if (newBooks.length === 0) {
        console.log('No hay libros nuevos después de filtrar');
        setHasMore(false);
        setLoading(false);
        return;
      }

      // Actualizar el conjunto de IDs cargados
      const newIds = new Set(loadedIds);
      newBooks.forEach((book) => {
        if (book.id) newIds.add(book.id);
      });
      setLoadedIds(newIds);

      // Añadir los nuevos libros a la lista
      setBooks((prevBooks) => [...prevBooks, ...newBooks]);

      // Extraer géneros únicos de todos los libros
      const uniqueGenres = [...new Set(data.map((book) => book.categoria).filter(Boolean))];
      setGenres((prev) => {
        const allGenres = [...prev, ...uniqueGenres];
        return [...new Set(allGenres)];
      });
    } catch (error) {
      console.error('Error al cargar los libros:', error);
      setError(`Error al cargar los libros: ${error.message}. Por favor, intenta de nuevo más tarde.`);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 &&
      hasMore &&
      !loading
    ) {
      console.log('Cargando más libros...');
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Función para manejar el clic en un libro
  const handleBookClick = (bookId) => {
    router.push(`/libro/${bookId}`);
  };

  // Filtrar libros por género seleccionado
  const filteredBooks = selectedGenre === 'Todos' ? books : books.filter((book) => book.categoria === selectedGenre);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Catálogo de Libros</h1>

      {/* Filtros de género */}
      <div className="d-flex justify-content-center flex-wrap mb-4">
        <button
          className={`btn m-1 ${selectedGenre === 'Todos' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setSelectedGenre('Todos')}
        >
          Todos
        </button>
        {genres.map((genre) => (
          <button
            key={genre}
            className={`btn m-1 ${selectedGenre === genre ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {filteredBooks.map((book) => (
          <div key={book.id || Math.random()} className="col">
            <div className="card h-100 shadow-sm">
              <div className="position-relative" style={{ height: '300px' }}>
                <img
                  src={book.imagenes || '/placeholder.svg?height=300&width=200'}
                  alt={book.titulo || 'Portada del libro'}
                  className="card-img-top h-100 w-100 object-fit-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder.svg?height=300&width=200';
                  }}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-truncate">{book.titulo || 'Título desconocido'}</h5>
                <p className="card-text text-muted mb-2">{book.autor || 'Autor desconocido'}</p>
                <p className="card-text">
                  <small className="text-muted">{book.categoria || 'Categoría no especificada'}</small>
                </p>
                <button className="btn btn-primary mt-auto" onClick={() => handleBookClick(book.id)}>
                  Más información
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      {!loading && books.length === 0 && <p className="text-center text-muted mt-4">No hay libros disponibles.</p>}

      {!hasMore && books.length > 0 && (
        <p className="text-center text-muted mt-4">Has llegado al final del catálogo.</p>
      )}
    </div>
  );
}
