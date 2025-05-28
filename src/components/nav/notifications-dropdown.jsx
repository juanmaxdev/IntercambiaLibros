"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import "@/app/styles/dropdownNavNotifications.css"

export default function NotificationsDropdown({ userEmail, isOpen, onClose }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef(null)

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
          {/* <button className="btn btn-sm text-primary" onClick={onClose}>
            Marcar todo como leído
          </button>
          Implementación futura */}
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
          <div className="text-center py-4 text-muted">Marcar
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
    </div>
  )
}

function formatTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return "Ayer"
  }

  const daysDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  if (daysDiff < 7) {
    return date.toLocaleDateString("es-ES", { weekday: "long" })
  }

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" })
  }

  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" })
}
