"use client"
import Image from "next/image"

export default function WhyChooseUs() {
  return (
    <section className="why-choose-us py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h2 className="mb-4">¿Por qué elegir IntercambiaLibros?</h2>
            <div className="features-list">
              <div className="feature-item d-flex align-items-start mb-4">
                <div className="feature-icon me-3">
                  <div className="icon-circle">
                    <i className="bi bi-recycle"></i>
                  </div>
                </div>
                <div>
                  <h3 className="h5 mb-2">Sostenibilidad</h3>
                  <p className="mb-0">
                    Damos nueva vida a los libros, reduciendo el desperdicio y promoviendo el consumo responsable.
                  </p>
                </div>
              </div>
              <div className="feature-item d-flex align-items-start mb-4">
                <div className="feature-icon me-3">
                  <div className="icon-circle">
                    <i className="bi bi-people"></i>
                  </div>
                </div>
                <div>
                  <h3 className="h5 mb-2">Comunidad</h3>
                  <p className="mb-0">
                    Conectamos a personas con intereses similares, creando una red de lectores apasionados.
                  </p>
                </div>
              </div>
              <div className="feature-item d-flex align-items-start">
                <div className="feature-icon me-3">
                  <div className="icon-circle">
                    <i className="bi bi-wallet2"></i>
                  </div>
                </div>
                <div>
                  <h3 className="h5 mb-2">Economía</h3>
                  <p className="mb-0">
                    Accede a nuevas lecturas sin gastar dinero, intercambiando los libros que ya has disfrutado.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="position-relative">
              <Image
                src="/assets/img/index/rincon_naturaleza.jpg"
                alt="Rincón de lectura en la naturaleza"
                width={600}
                height={400}
                className="img-fluid rounded-4 shadow-lg"
              />
              <div className="stats-card">
                <div className="row g-3">
                  <div className="col-6 text-center">
                    <h4 className="counter mb-0">500+</h4>
                    <p className="small text-muted mb-0">Libros intercambiados</p>
                  </div>
                  <div className="col-6 text-center">
                    <h4 className="counter mb-0">250+</h4>
                    <p className="small text-muted mb-0">Usuarios activos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
