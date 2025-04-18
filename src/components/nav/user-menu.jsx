"use client"
import Link from "next/link"
import Image from "next/image"
import { signOut } from "next-auth/react"

export function UserMenu({ session }) {
  // Modificar la función handleSignOut para mantener al usuario en la misma página
  const handleSignOut = async () => {
    // Limpiamos el estado de sesión
    localStorage.removeItem("sessionStarted")

    // Obtenemos la ruta actual para redirigir después del cierre de sesión
    const currentPath = window.location.pathname

    // Cerramos sesión y redirigimos a la misma página
    await signOut({ redirect: false })

    // Redirigir manualmente a la misma página después de cerrar sesión
    window.location.href = currentPath
  }

  return (
    <>
      <a
        className="nav-link d-flex align-items-center gap-2 text-nowrap dropdown-toggle"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {session?.user?.image ? (
          <Image
            src={session.user.image || "/placeholder.svg"}
            alt="Foto de perfil"
            width={24}
            height={24}
            className="rounded-circle"
          />
        ) : (
          <Image src="/assets/icons/person-fill.svg" alt="iconoCuenta" width={18} height={18} />
        )}
        <span className="d-none d-md-inline">{session?.user?.name || "Usuario"}</span>
      </a>
      <ul
        className="dropdown-menu dropdown-menu-end"
        style={{ position: "absolute", zIndex: 1030, right: 0, left: "auto" }}
      >
        <li>
          <Link className="dropdown-item" href="/views/perfil">
            Mi Perfil
          </Link>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <button className="dropdown-item" onClick={handleSignOut}>
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </>
  )
}
