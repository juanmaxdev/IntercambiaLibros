'use client';
import { useState, useEffect } from 'react';

export function useAuth() {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    userId: null,
    loading: true,
  });

  useEffect(() => {
    // Aquí deberías implementar la lógica real para verificar si el usuario está autenticado
    // Por ejemplo, verificar una cookie, token en localStorage, o hacer una petición a tu API

    const checkAuthStatus = async () => {
      try {
        // Ejemplo: verificar si hay un token en localStorage
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        // Si hay un token, asumimos que el usuario está autenticado
        if (token) {
          setAuthState({
            isLoggedIn: true,
            userId: userId,
            loading: false,
          });
        } else {
          setAuthState({
            isLoggedIn: false,
            userId: null,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setAuthState({
          isLoggedIn: false,
          userId: null,
          loading: false,
        });
      }
    };

    checkAuthStatus();
  }, []);

  return authState;
}
