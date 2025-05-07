"use client"
import Link from "next/link"
import Image from "next/image"

export function LoginButton() {
  return (
    <Link
      className="nav-link d-flex align-items-center gap-2 text-nowrap mx-3"
      data-bs-toggle="modal"
      data-bs-target="#modalIniciarSesion"
      href="#"
    >
      <Image src="/assets/icons/person-fill.svg" alt="iconoCuenta" width={18} height={18} />
      <span className="d-none d-md-inline">Iniciar sesión</span>
    </Link>
  )
}
