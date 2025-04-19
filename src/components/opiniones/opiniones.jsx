'use client';
import Image from 'next/image';

export default function Opiniones() {
  return (
    <div className="container-fluid">
      <div
        id="carouselOpiniones"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="5000"
        data-bs-pause="false"
        data-bs-wrap="true"
      >
        <div className="carousel-indicators d-none">
          <button type="button" data-bs-target="#carouselOpiniones" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#carouselOpiniones" data-bs-slide-to="1"></button>
        </div>
        <div className="container-fluid position-relative">
          <h4 className="border-bottom m-4 px-5 pb-2">OPINIONES</h4>

          {/* Carrusel */}
          <div className="carousel-inner position-relative mb-4">
            {/* Primera diapositiva con tarjetas */}
            <div className="carousel-item active mb-4">
              <div className="row justify-content-center">
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 m-0">
                  {/* Tarjeta 1 */}
                  <div className="col">
                    <div className="card h-100">
                      <div className="card-body">
                        <h6 className="card-title fw-bold mb-3">"Excelente Iniciativa"</h6>
                        <div className="d-flex align-items-center">
                          <Image
                            src="/assets/img/icono_masculino2.png"
                            className="rounded-circle me-3"
                            alt="Imagen de usuario"
                            height={50}
                            width={50}
                            style={{ objectFit: 'cover' }}
                          />
                          <div>
                            <p className="mb-0 fw-medium">Saul</p>
                            <p className="mb-0 text-muted small">Happy</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Tarjeta 2 */}
                  <div className="col">
                    <div className="card h-100">
                      <div className="card-body">
                        <h6 className="card-title fw-bold mb-3">"Muy Buen Servicio"</h6>
                        <div className="d-flex align-items-center">
                          <Image
                            src="/assets/img/imagen_femenino2.avif"
                            className="rounded-circle me-3"
                            alt="Imagen de usuario"
                            height={50}
                            width={50}
                            style={{ objectFit: 'cover' }}
                          />
                          <div>
                            <p className="mb-0 fw-medium">Ana</p>
                            <p className="mb-0 text-muted small">Satisfied</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Tarjeta 3 */}
                  <div className="col">
                    <div className="card h-100">
                      <div className="card-body">
                        <h6 className="card-title fw-bold mb-3">"Increíble Experiencia"</h6>
                        <div className="d-flex align-items-center">
                          <Image
                            src="/assets/img/icono_masculino.png"
                            className="rounded-circle me-3"
                            alt="Imagen de usuario"
                            height={50}
                            width={50}
                            style={{ objectFit: 'cover' }}
                          />
                          <div>
                            <p className="mb-0 fw-medium">Carlos</p>
                            <p className="mb-0 text-muted small">Excited</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Tarjeta 4 */}
                  <div className="col">
                    <div className="card h-100">
                      <div className="card-body">
                        <h6 className="card-title fw-bold mb-3">"Recomendado 100%"</h6>
                        <div className="d-flex align-items-center">
                          <Image
                            src="/assets/img/imagen_femenino.jpg"
                            className="rounded-circle me-3"
                            alt="Imagen de usuario"
                            height={50}
                            width={50}
                            style={{ objectFit: 'cover' }}
                          />
                          <div>
                            <p className="mb-0 fw-medium">Laura</p>
                            <p className="mb-0 text-muted small">Impressed</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Segunda diapositiva */}
            <div className="carousel-item mb-4" data-bs-interval="5000">
              <div className="row justify-content-center">
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 m-0">
                  {/* Tarjeta 1 */}
                  <div className="col">
                    <div className="card h-100">
                      <div className="card-body">
                        <h6 className="card-title fw-bold mb-3">"Excelente Iniciativa"</h6>
                        <div className="d-flex align-items-center">
                          <Image
                            src="/assets/img/icono_masculino.png"
                            className="rounded-circle me-3"
                            alt="Imagen de usuario"
                            height={50}
                            width={50}
                            style={{ objectFit: 'cover' }}
                          />
                          <div>
                            <p className="mb-0 fw-medium">Saul</p>
                            <p className="mb-0 text-muted small">Happy</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Tarjeta 2 */}
                  <div className="col">
                    <div className="card h-100">
                      <div className="card-body">
                        <h6 className="card-title fw-bold mb-3">"Muy Buen Servicio"</h6>
                        <div className="d-flex align-items-center">
                          <Image
                            src="/assets/img/imagen_femenino.jpg"
                            className="rounded-circle me-3"
                            alt="Imagen de usuario"
                            height={50}
                            width={50}
                            style={{ objectFit: 'cover' }}
                          />
                          <div>
                            <p className="mb-0 fw-medium">Ana</p>
                            <p className="mb-0 text-muted small">Satisfied</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Tarjeta 3 */}
                  <div className="col">
                    <div className="card h-100">
                      <div className="card-body">
                        <h6 className="card-title fw-bold mb-3">"Increíble Experiencia"</h6>
                        <div className="d-flex align-items-center">
                          <Image
                            src="/assets/img/icono_masculino2.png"
                            className="rounded-circle me-3"
                            alt="Imagen de usuario"
                            height={50}
                            width={50}
                            style={{ objectFit: 'cover' }}
                          />
                          <div>
                            <p className="mb-0 fw-medium">Carlos</p>
                            <p className="mb-0 text-muted small">Excited</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Tarjeta 4 */}
                  <div className="col">
                    <div className="card h-100">
                      <div className="card-body">
                        <h6 className="card-title fw-bold mb-3">"Recomendado 100%"</h6>
                        <div className="d-flex align-items-center">
                          <Image
                            src="/assets/img/imagen_femenino2.avif"
                            className="rounded-circle me-3"
                            alt="Imagen de usuario"
                            height={50}
                            width={50}
                            style={{ objectFit: 'cover' }}
                          />
                          <div>
                            <p className="mb-0 fw-medium">Laura</p>
                            <p className="mb-0 text-muted small">Impressed</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev d-none"
            type="button"
            data-bs-target="#carouselOpiniones"
            data-bs-slide="prev"
          ></button>
          <button
            className="carousel-control-next d-none"
            type="button"
            data-bs-target="#carouselOpiniones"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
}
