'use client';
import BookList from '@/components/books/book-list';
import { useEffect, useState } from 'react';

export default function BookListPage() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch('/api/libros');
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBooks();
  }, []);

  return (
    <main className="container py-4">
      <BookList books={books} isLoading={isLoading} />
    </main>
  );
}