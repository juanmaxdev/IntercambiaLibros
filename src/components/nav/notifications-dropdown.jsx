"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

export default function NotificationsDropdown({ userEmail, isOpen, onClose }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef(null)

  // Cerrar el dropdown al hacer clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Cargar notificaciones
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userEmail || !isOpen) return

      try {
        setLoading(true)
        const response = await fetch(`/api/mensajes/notificaciones?email=${encodeURIComponent(userEmail)}&details=true`)
        if (response.ok) {
          const data = await response.json()
          setNotifications(data.notifications || [])
        }
      } catch (error) {
        console.error("Error al cargar notificaciones:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [userEmail, isOpen])

  if (!isOpen) return null

  return (
    <div ref={dropdownRef} className="notification-dropdown shadow-lg" onClick={(e) => e.stopPropagation()}>
      <div className="notification-header">
        <h6 className="mb-0">Notificaciones</h6>
        {notifications.length > 0 && (
          <button className="btn btn-sm text-primary" onClick={onClose}>
            Marcar todo como leído
          </button>
        )}
      </div>

      <div className="notification-body">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <i className="bi bi-bell-slash fs-4 mb-2"></i>
            <p className="mb-0">No tienes notificaciones</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <Link
              href={`/perfil/mensajes?contacto=${encodeURIComponent(notification.remitente)}`}
              key={notification.id}
              className="notification-item"
              onClick={onClose}
            >
              <div className="notification-avatar">
                <div className="avatar-placeholder">{notification.nombreRemitente.charAt(0).toUpperCase()}</div>
              </div>
              <div className="notification-content">
                <div className="notification-title">
                  <span className="fw-semibold">{notification.nombreRemitente}</span>
                  <span className="notification-time">{formatTime(notification.fecha)}</span>
                </div>
                <p className="notification-message">{notification.contenido}</p>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="notification-footer">
        <Link href="/perfil/mensajes" className="btn btn-link text-primary w-100" onClick={onClose}>
          Ver todos los mensajes
        </Link>
      </div>

      <style jsx>{`
        .notification-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          width: 320px;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          z-index: 1000;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          background-color: #f8f9fa;
        }

        .notification-body {
          max-height: 350px;
          overflow-y: auto;
        }

        .notification-item {
          display: flex;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          text-decoration: none;
          color: inherit;
          transition: background-color 0.2s;
        }

        .notification-item:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }

        .notification-avatar {
          margin-right: 12px;
          flex-shrink: 0;
        }

        .avatar-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #6c757d;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .notification-content {
          flex-grow: 1;
          min-width: 0;
        }

        .notification-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .notification-time {
          font-size: 0.75rem;
          color: #6c757d;
        }

        .notification-message {
          margin: 0;
          font-size: 0.875rem;
          color: #495057;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .notification-footer {
          padding: 8px 16px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          text-align: center;
        }
      `}</style>
    </div>
  )
}

// Función para formatear la hora
function formatTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()

  // Si es hoy, mostrar solo la hora
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  // Si es ayer
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return "Ayer"
  }

  // Si es esta semana
  const daysDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  if (daysDiff < 7) {
    return date.toLocaleDateString("es-ES", { weekday: "long" })
  }

  // Si es este año
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" })
  }

  // Si es otro año
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" })
}
