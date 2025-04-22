"use client"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import "@/app/styles/perfil/sideBar.css"

export default function ModernSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  // Función para determinar si un enlace está activo
  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path + "/")
  }

  // Función para alternar el estado del sidebar
  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <div className={`modern-sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Botón de colapso */}
      <button
        className="collapse-btn"
        onClick={toggleSidebar}
        aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        <i className={`bi ${collapsed ? "bi-chevron-right" : "bi-chevron-left"}`}></i>
      </button>

      {/* Cabecera del sidebar */}
      <div className="sidebar-header">
        <div className="user-avatar">
          {session?.user?.image ? (
            <Image
              src={session.user.image || "/placeholder.svg"}
              alt="Avatar"
              width={collapsed ? 40 : 60}
              height={collapsed ? 40 : 60}
              className="rounded-circle"
            />
          ) : (
            <div className="avatar-placeholder">{session?.user?.name?.charAt(0) || "U"}</div>
          )}
        </div>
        {!collapsed && (
          <div className="user-info">
            <h5 className="user-name">{session?.user?.name || "Usuario"}</h5>
            <p className="user-email">{session?.user?.email || ""}</p>
          </div>
        )}
      </div>

      {/* Menú de navegación */}
      <nav className="sidebar-nav">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link
              href="/perfil"
              className={`nav-link ${isActive("/perfil") && !isActive("/perfil/misDatos") && !isActive("/perfil/mensajes") && !isActive("/perfil/transacciones") && !isActive("/perfil/reportes") ? "active" : ""}`}
            >
              <i className="bi bi-person"></i>
              {!collapsed && <span>Mi Perfil</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/libros/misLibros" className={`nav-link ${isActive("/libros/misLibros") ? "active" : ""}`}>
              <i className="bi bi-book"></i>
              {!collapsed && <span>Mis Libros</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/perfil/mensajes" className={`nav-link ${isActive("/perfil/mensajes") ? "active" : ""}`}>
              <i className="bi bi-chat"></i>
              {!collapsed && <span>Mensajes</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              href="/perfil/transacciones"
              className={`nav-link ${isActive("/perfil/transacciones") ? "active" : ""}`}
            >
              <i className="bi bi-currency-exchange"></i>
              {!collapsed && <span>Transacciones</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/perfil/reportes" className={`nav-link ${isActive("/perfil/reportes") ? "active" : ""}`}>
              <i className="bi bi-flag"></i>
              {!collapsed && <span>Reportes</span>}
            </Link>
          </li>
          <li className="nav-item logout-item">
            <button onClick={() => signOut({ callbackUrl: "/" })} className="nav-link logout-btn">
              <i className="bi bi-box-arrow-right"></i>
              {!collapsed && <span>Cerrar Sesión</span>}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
