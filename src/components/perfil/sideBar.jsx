'use client';
import Link from "next/link";

export default function SideBar() {
  return (
          {/* <div className="row"> */} ,
          {/* div className="col-2"> */}  ,
          {/* SIDE NAV */} ,
          <ul className="nav flex-column mb-5">
            <li className="nav-item">
              <Link className="nav-link active text-body-secondary py-1" aria-current="page" href="/views/perfil/misDatos">
                Mis datos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-body-secondary py-1" href="/views/perfil/mensajes">
                Mensajes
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link text-body-secondary py-1" href="#">
                Mis libros
              </a>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-body-secondary py-1" href="/views/perfil/transacciones">
                Transacciones
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link text-body-secondary py-1" href="#">
                Lista de deseados
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-body-secondary py-1" href="/views/perfil/reportes">
                Sistema de reporte
              </a>
            </li>
          </ul>
  );
}