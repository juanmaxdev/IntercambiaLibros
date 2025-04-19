'use client';
import './styles.css';
import Image from 'next/image';

export default function LibroSeleccionado() {
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col-5 col my-5 ps-0">
          <div className="custom-rectangle bg-secondario ms-5 rounded-top">
            <div className="row">
              <div className="col-12 col d-flex flex-column align-items-center h-100 mt-5 mb-4">
                <Image src="/assets/img/Portada3.png" className="rounded" alt="logo" width={225} height={300} />
              </div>
            </div>
            <div className="row">
              <div className="col-6 col ps-5 mt-2">
                <p className="ps-3 fw-semibold">Autor</p>
                <p className="ps-3 fw-semibold">Editorial</p>
                <p className="ps-3 fw-semibold">Categoria</p>
                <p className="ps-3 fw-semibold">Tapa</p>
                <p className="ps-3 fw-semibold">ISBN</p>
                <p className="ps-3 fw-semibold">Intercambio</p>
                <p className="ps-3 fw-semibold">Estado</p>
                <p className="ps-3 fw-semibold">Ubicación</p>
                <p className="ps-3 fw-semibold pt-3">Vendedor</p>
              </div>
              <div className="col-6 col mt-2">
                <p>Julian Alonso</p>
                <p>Ojo dulce</p>
                <p>Terror</p>
                <p>Blanda</p>
                <p>123456789</p>
                <p>Presencial</p>
                <p>Usado</p>
                <p>Madrid</p>
                <p className="pt-3">Julian Alonso</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-5 col">
          <div className="container mt-5 pt-4">
            <h2 className="fw-semibold">REYES CAÍDOS - JULIÁN ALONOSO</h2>
            <p className="fw-medium mt-5">Descripción del vendedor:</p>
            <p className="fw-light mt-4">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis, optio rem quod voluptate recusandae illum
              dolorum ducimus, earum aliquam culpa sequi doloribus error magnam, illo deleniti vero. Nam, fuga natus!
            </p>
            <p className="fw-semibold mt-5">
              "¡Gracias por elegir el intercambio de libros! Al dar una nueva vida a este libro, estás ayudando a
              reducir el desperdicio y a cuidar el medio ambiente. Juntos fomentamos la reutilización, apoyamos la
              sostenibilidad y construimos una comunidad más consciente."
            </p>
            <p>🌱📚</p>
          </div>
          <div className="container d-flex align-items-center justify-content-center gap-2 mt-5">
            <button type="button" className="btn btn-outline-danger rounded-circle border-0">
              <Image src="/assets/icons/Cupid.gif" alt="Icono de corazón" style={{ width: 50, height: 50 }} />
            </button>
            <p className="fw-semibold pt-3">Agregar a lista de deseados</p>
          </div>
          <div className="container d-flex justify-content-between gap-5 mt-3">
            <button type="button" className="btn btn-dark mt-5">
              Contactar con el vendedor
            </button>
            <button type="button" className="btn btn-dark mt-5">
              Solicitar intercambio
            </button>
          </div>
        </div>
        <div className="col-2 col" />
      </div>
      <div className="container-fluid my-5 ps-0">
        <div className="custom-container-comment bg-secondario ms-5 rounded">
          <div className="row h-100">
            <div className="col-7 col">
              <h3 className="fw-semibold pt-4 ps-5 text-dark">Opiniones del libro</h3>
              <div className="container mt-5 pt-4 ps-4">
                <p className="fw-medium">¿Léiste este libro? Inicia sesión para poder agregar tu propia evaluación.</p>
              </div>
            </div>
            <div className="col-2 col" />
            <div className="col-3 col d-flex flex-column justify-content-center align-items-center border-start border-black">
              <div className="d-flex flex-column me-3 pt-5 mt-4">
                {/* Fila 1 */}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex">
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                  </div>
                  <p className="mb-0 ps-4 fw-bold">0%</p>
                </div>
                {/* Fila 2 */}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex">
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                  </div>
                  <p className="mb-0 ps-4 fw-bold">0%</p>
                </div>
                {/* Fila 3*/}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex">
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                  </div>
                  <p className="mb-0 ps-4 fw-bold">0%</p>
                </div>
                {/* Fila 4*/}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex">
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                  </div>
                  <p className="mb-0 ps-4 fw-bold">0%</p>
                </div>
                {/* Fila 5*/}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex">
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                    <Image
                      src="/assets/icons/icons8-estrella-48.png"
                      alt="icono de una estrella"
                      style={{ width: 25, height: 25 }}
                    />
                  </div>
                  <p className="mb-0 ps-4 fw-bold">0%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
