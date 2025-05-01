"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export function useAuth() {
  const { data: session, status: nextAuthStatus } = useSession()
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    userId: null,
    userName: null,
    userEmail: null,
    authType: null,
    loading: true,
  })

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Verificar primero si hay una sesión de NextAuth
        if (nextAuthStatus === "authenticated" && session) {
          setAuthState({
            isLoggedIn: true,
            userId: session.user.id || session.user.email,
            userName: session.user.name,
            userEmail: session.user.email,
            userImage: session.user.image,
            authType: "nextauth",
            loading: false,
          })
          return
        } else if (nextAuthStatus === "loading") {
          // Seguir esperando a que NextAuth termine de cargar
          return
        }

        // Si no hay sesión de NextAuth, verificar si hay un token en localStorage
        const token = localStorage.getItem("authToken")
        const userId = localStorage.getItem("userId")
        const userName = localStorage.getItem("userName")
        const userEmail = localStorage.getItem("userEmail")

        if (token) {
          setAuthState({
            isLoggedIn: true,
            userId: userId,
            userName: userName,
            userEmail: userEmail,
            userImage: null, // Los usuarios con credenciales no tienen imagen por defecto
            authType: "credentials",
            loading: false,
          })
        } else {
          setAuthState({
            isLoggedIn: false,
            userId: null,
            userName: null,
            userEmail: null,
            userImage: null,
            authType: null,
            loading: false,
          })
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
        setAuthState({
          isLoggedIn: false,
          userId: null,
          userName: null,
          userEmail: null,
          userImage: null,
          authType: null,
          loading: false,
        })
      }
    }

    checkAuthStatus()
  }, [session, nextAuthStatus])

  return authState
}
