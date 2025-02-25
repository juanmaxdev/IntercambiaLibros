'use client';

export default function Opiniones() {
  return (
    <div className="container-fluid">
      <div id="carouselOpiniones" className="carousel slide" data-bs-ride="carousel">
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
                          <img
                            src="/assets/img/icono_masculino2.png"
                            className="rounded-circle me-3"
                            alt="Imagen de usuario"
                            style={{ width: 50, height: 50, objectFit: 'cover' }}
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
                          <img
                            src="/assets/img/imagen_femenino2.avif"
                            className="rounded-circle me-3"
                            alt="Imagen de usuario"
                            style={{ width: 50, height: 50, objectFit: 'cover' }}
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
                          <img
                            src="/assets/img/icono_masculino.png"
                            className="rounded-circle me-3"
                            alt="Imagen de usuario"
                            style={{ width: 50, height: 50, objectFit: 'cover' }}
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
                          <img
                            src="/assets/img/imagen_femenino.jpg"
                            className="rounded-circle me-3"
                            alt="Imagen de usuario"
                            style={{ width: 50, height: 50, objectFit: 'cover' }}
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
            <div className="carousel-item active mb-4">
              <div className="row justify-content-center">
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 m-0">
                  {/* Tarjeta 1 */}
                  <div className="col">
                    <div className="card h-100">
                      <div className="card-body">
                        <h6 className="card-title fw-bold mb-3">"Excelente Iniciativa"</h6>
                        <div className="d-flex align-items-center">
                          <img
                            src="/assets/img/icono_masculino.png"
                            className="rounded-circle me-3"
                            alt="Imagen de usuario"
                            style={{ width: 50, height: 50, objectFit: 'cover' }}
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
                          <img
                            src="/assets/img/imagen_femenino.jpg"
                            className="rounded-circle me-3"
                            alt="Imagen de usuario"
                            style={{ width: 50, height: 50, objectFit: 'cover' }}
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
                          <img
                            src="/assets/img/icono_masculino2.png"
                            className="rounded-circle me-3"
                            alt="Imagen de usuario"
                            style={{ width: 50, height: 50, objectFit: 'cover' }}
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
                          <img
                            src="/assets/img/imagen_femenino2.avif"
                            className="rounded-circle me-3"
                            alt="Imagen de usuario"
                            style={{ width: 50, height: 50, objectFit: 'cover' }}
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
        </div>
      </div>
    </div>
  );
}
