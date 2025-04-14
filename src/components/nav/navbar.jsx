"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ToastNotification } from "./notification"
import { UserMenu } from "./user-menu"
import { LoginButton } from "./login-button"
import { SearchBar } from "./search-bar"
import { NavLinks } from "./nav-links"
import { LoginModal } from "./login-modal"
import { RegistroModal } from "./registro-modal"

export default function Nav() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const router = useRouter()

  // Verificar si el usuario acaba de iniciar sesión (usando localStorage)
  useEffect(() => {
    if (isAuthenticated && !localStorage.getItem("sessionStarted")) {
      setToastMessage("Sesión iniciada correctamente")
      setShowToast(true)
      localStorage.setItem("sessionStarted", "true")

      // Redirigir al index después de 2 segundos
      setTimeout(() => {
        router.push("/")
      }, 2000)
    }
  }, [isAuthenticated, router])

  return (
    <>
      <header>
        <nav className="navbar fixed-top pb-2 shadow-sm">
          <div className="container-fluid">
            <div className="d-flex w-100 justify-content-between align-items-center">
              {/* Menú izquierdo */}
              <ul className="navbar-nav d-flex flex-row align-items-center">
                <NavLinks isAuthenticated={isAuthenticated} />
                <li className="nav-item">
                  <Link className="nav-link active p-0" aria-current="page" href="/">
                    <Image src="/assets/img/logo2.png" alt="logo" width={150} height={28} priority />
                  </Link>
                </li>
              </ul>

              {/* Barra de búsqueda */}
              <SearchBar />

              {/* Menú derecho */}
              <ul className="navbar-nav d-flex flex-row align-items-center">
                {/* Mostrar "Subir Libro" solo si el usuario está autenticado */}
                {isAuthenticated && (
                  <li className="nav-item me-3">
                    <Link className="nav-link d-flex align-items-center gap-2 text-nowrap" href="/views/subirLibro">
                      <Image src="/assets/icons/cloud-upload.svg" alt="iconoSubirLibro" width={18} height={18} />
                      <span className="d-none d-md-inline">Subir Libro</span>
                    </Link>
                  </li>
                )}

                {/* Mostrar "Iniciar sesión" o el nombre del usuario según el estado de autenticación */}
                <li className="nav-item me-3 dropdown" style={{ position: "relative" }}>
                  {isAuthenticated ? <UserMenu session={session} /> : <LoginButton />}
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center gap-2 text-nowrap" href="/views/perfil">
                    <Image src="/assets/icons/bell.svg" alt="iconoNotificacion" width={18} height={18} />
                    <span className="d-none d-md-inline">Notificación</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* Modales renderizados siempre */}
        {!isAuthenticated && (
          <>
            <LoginModal />
            <RegistroModal />
          </>
        )}
        {/* Mostrar notificación de inicio de sesión */}
        {showToast && <ToastNotification message={toastMessage} onClose={() => setShowToast(false)} />}
      </header>
    </>
  )
}
