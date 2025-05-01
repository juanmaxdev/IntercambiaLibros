"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { ToastNotification } from "./notification"
import { UserMenu } from "./user-menu"
import { LoginButton } from "./login-button"
import { SearchBar } from "./search-bar"
import { NavLinks } from "./nav-links"
import { LoginModal } from "./login-modal"
import { RegistroModal } from "./registro-modal"
import { useAuth } from "@/app/hooks/use-auth"
import NotificationsDropdown from "./notifications-dropdown"

export default function Nav() {
  const { data: session } = useSession()
  const { isLoggedIn, userName, userEmail, userImage, authType } = useAuth()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)

  // Verificar si el usuario acaba de iniciar sesión (usando localStorage)
  useEffect(() => {
    if (isLoggedIn && localStorage.getItem("sessionStarted")) {
      setToastMessage("Sesión iniciada correctamente")
      setShowToast(true)
      localStorage.removeItem("sessionStarted") // Eliminar para que no se muestre de nuevo al recargar
    }
  }, [isLoggedIn])

  // Crear un objeto de sesión unificado para pasar a los componentes
  const unifiedSession = {
    user: {
      name: userName || session?.user?.name || "Usuario",
      email: userEmail || session?.user?.email || "",
      image: userImage || session?.user?.image || null,
    },
  }

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      if (isLoggedIn && userEmail) {
        try {
          // Obtener conversaciones para contar mensajes no leídos
          const response = await fetch(`/api/mensajes/notificaciones?email=${encodeURIComponent(userEmail)}`)
          if (response.ok) {
            const data = await response.json()
            setUnreadNotifications(data.unreadCount || 0)
          }
        } catch (error) {
          console.error("Error al obtener notificaciones:", error)
        }
      }
    }

    fetchUnreadNotifications()

    // Actualizar cada 30 segundos
    const interval = setInterval(fetchUnreadNotifications, 30000)
    return () => clearInterval(interval)
  }, [isLoggedIn, userEmail])

  // Manejar clic en el icono de notificaciones
  const handleNotificationClick = (e) => {
    e.preventDefault()
    setShowNotifications(!showNotifications)
  }

  return (
    <>
      <header>
        <nav className="navbar fixed-top pb-2 shadow-sm">
          <div className="container-fluid">
            <div className="d-flex w-100 justify-content-between align-items-center">
              {/* Menú izquierdo */}
              <ul className="navbar-nav d-flex flex-row align-items-center">
                <NavLinks isAuthenticated={isLoggedIn} />
                <li className="nav-item">
                  <Link className="nav-link active p-0" aria-current="page" href="/">
                    <Image
                      src="/assets/img/logo2.png"
                      alt="logo"
                      className="d-none d-md-inline"
                      width={150}
                      height={28}
                      priority
                    />
                    <Image
                      src="/assets/img/logo/Logo_small_true.jpg"
                      alt="logo"
                      className="d-inline d-md-none"
                      width={28}
                      height={28}
                      priority
                    />
                  </Link>
                </li>
              </ul>

              {/* Barra de búsqueda */}
              <SearchBar />

              {/* Menú derecho */}
              <ul className="navbar-nav d-flex flex-row align-items-center">
                {/* Mostrar "Subir Libro" solo si el usuario está autenticado */}
                {isLoggedIn && (
                  <li className="nav-item me-3">
                    <Link className="nav-link d-flex align-items-center gap-2 text-nowrap" href="/subirLibro">
                      <Image src="/assets/icons/cloud-upload.svg" alt="iconoSubirLibro" width={18} height={18} />
                      <span className="d-none d-md-inline">Subir Libro</span>
                    </Link>
                  </li>
                )}

                {/* Mostrar "Iniciar sesión" o el nombre del usuario según el estado de autenticación */}
                <li className="nav-item me-3 dropdown" style={{ position: "relative" }}>
                  {isLoggedIn ? <UserMenu session={unifiedSession} authType={authType} /> : <LoginButton />}
                </li>
                {/* Notificaciones */}
                <li className="nav-item" style={{ position: "relative" }}>
                  <a
                    href="#"
                    className="nav-link d-flex align-items-center gap-2 text-nowrap position-relative"
                    onClick={handleNotificationClick}
                  >
                    <Image src="/assets/icons/bell.svg" alt="iconoNotificacion" width={18} height={18} />
                    <span className="d-none d-md-inline">Notificación</span>
                    {isLoggedIn && unreadNotifications > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {unreadNotifications}
                        <span className="visually-hidden">mensajes no leídos</span>
                      </span>
                    )}
                  </a>
                  {isLoggedIn && showNotifications && (
                    <NotificationsDropdown
                      userEmail={userEmail}
                      isOpen={showNotifications}
                      onClose={() => setShowNotifications(false)}
                    />
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* Modales renderizados solo cuando el usuario no está autenticado */}
        {!isLoggedIn && (
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
