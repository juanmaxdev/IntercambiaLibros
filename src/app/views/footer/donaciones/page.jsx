import Image from 'next/image';

export default function Donaciones() {
  return (
      <main className="container py-5">
        <div className="row align-items-center">
          {/* Imagen a la izquierda en pantallas grandes, arriba en móviles */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <Image
              src="/assets/img/donaciones.jpg"
              alt="Donaciones de libros"
              width={450}
              height={450}
              className="img-fluid rounded shadow"
            />
          </div>

          {/* Contenido de texto */}
          <div className="col-lg-6">
            <h2 className="mb-4">Donaciones de Libros</h2>
            <p className="lead">
              En <strong>IntercambiaLibros</strong> creemos en el poder de compartir el conocimiento. Por eso, ofrecemos
              un espacio donde cualquier persona o entidad puede donar libros sin esperar nada a cambio.
            </p>
            <p>
              Si tienes libros que ya no utilizas, ¡dónalos! Los beneficiarios se harán cargo de los gastos de envío,
              asegurando que el proceso sea accesible para todos. Tu generosidad ayuda a que más personas disfruten de
              la lectura.
            </p>
            <h4 className="mt-4">¿Cómo Funciona?</h4>
            <ul className="list-unstyled">
              <li className="d-flex align-items-start mb-3">
                <i className="bi bi-box-seam me-3 fs-4 text-primary"></i>
                <span>
                  <strong>1. Publica tu donación:</strong> Registra los libros que deseas donar en nuestra plataforma.
                </span>
              </li>
              <li className="d-flex align-items-start mb-3">
                <i className="bi bi-people me-3 fs-4 text-primary"></i>
                <span>
                  <strong>2. Encuentra un receptor:</strong> Los usuarios interesados se pondrán en contacto contigo.
                </span>
              </li>
              <li className="d-flex align-items-start mb-3">
                <i className="bi bi-truck me-3 fs-4 text-primary"></i>
                <span>
                  <strong>3. Envío del libro:</strong> El receptor cubre los gastos de envío, facilitando el proceso
                  para ti.
                </span>
              </li>
            </ul>
            <p className="mt-4">
              Tu aporte puede marcar la diferencia. ¡Anímate a donar y comparte el placer de la lectura!
            </p>
          </div>
        </div>
      </main>
  );
}
