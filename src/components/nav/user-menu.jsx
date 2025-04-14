"use client"
import Link from "next/link"
import Image from "next/image"
import { signOut } from "next-auth/react"

export function UserMenu({ session }) {
  // Limpiar el estado de sesión cuando el usuario cierra sesión
  const handleSignOut = async () => {
    localStorage.removeItem("sessionStarted")
    await signOut({ callbackUrl: "/" })
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
      <ul className="dropdown-menu dropdown-menu-end" style={{ position: "absolute", zIndex: 1030 }}>
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
