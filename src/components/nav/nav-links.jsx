"use client"
import Link from "next/link"
import Image from "next/image"
import { signOut } from "next-auth/react"

export function NavLinks({ isAuthenticated }) {
  const handleSignOut = async () => {
    localStorage.removeItem("sessionStarted")
    localStorage.removeItem("authToken")
    localStorage.removeItem("userId")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("authType")


    await signOut({ callbackUrl: "/" })
  }

  return (
    <li className="nav-item dropdown me-2 position-relative">
      <a className="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <Image src="/assets/icons/list.svg" alt="iconoMenu" width={35} height={25} />
      </a>
      <ul className="dropdown-menu" style={{ position: "absolute", left: "0", right: "auto" }}>
        <li>
          <Link className="dropdown-item" href="/libros/generos">
            Generos
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" href="/libros/donaciones">
            Donaciones
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" href="/libros/novedades">
            Nuevos Libros
          </Link>
        </li>
        {isAuthenticated && (
          <>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button className="dropdown-item" onClick={handleSignOut}>
                Cerrar Sesión
              </button>
            </li>
          </>
        )}
      </ul>
    </li>
  )
}
