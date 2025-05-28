"use client"
import { useState, useRef, useEffect } from "react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"

export function UserMenu({ session, authType = "nextauth" }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSignOut = async () => {
    if (authType === "credentials") {
      localStorage.removeItem("authToken")
      localStorage.removeItem("userId")
      localStorage.removeItem("userName")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("authType")
      localStorage.removeItem("sessionStarted")

      window.location.href = "/"
    } else {
      localStorage.removeItem("sessionStarted")
      await signOut({ callbackUrl: "/" })
    }
  }

  return (
    <div ref={menuRef} className="dropdown">
      <button
        className="nav-link dropdown-toggle d-flex align-items-center gap-2"
        type="button"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        style={{ background: "none", border: "none", padding: "0.5rem 0.75rem" }}
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
      </button>

      <ul
        className={`dropdown-menu dropdown-menu-end ${isOpen ? "show" : ""}`}
        style={{ position: "absolute", zIndex: 1030, right: 0, left: "auto" }}
      >
        <li>
          <Link className="dropdown-item" href="/perfil">
            Mi Perfil
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" href="/perfil/misLibros">
            Mis Libros
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" href="/perfil/mensajes">
            Mensajes
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" href="/perfil/reportes">
            Reportes
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
    </div>
  )
}
