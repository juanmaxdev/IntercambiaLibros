"use client"
import { useEffect, useState } from "react"

export function ToastNotification({ message, duration = 2000, onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      if (onClose) onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!visible) return null

  return (
    <div className="position-fixed top-0 end-0 p-3 mt-5" style={{ zIndex: 1100 }}>
      <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header">
          <strong className="me-auto">Notificación</strong>
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              setVisible(false)
              if (onClose) onClose()
            }}
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body">{message}</div>
      </div>
    </div>
  )
}
