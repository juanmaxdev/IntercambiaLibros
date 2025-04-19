import CarouselDoble from '../components/carousel/carouselDouble';
import CarouselSimple, { CarouselNuevosLibros } from '../components/carousel/carouselSimple';
import Opiniones from '../components/opiniones/opiniones';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <main className="container-fluid">
        <CarouselSimple />
        <CarouselNuevosLibros />
        <CarouselDoble />
        <div className="container-fluid  my-5 rounded">
          <div className="row my-4 mb-1">
            <div className="col-1 d-none d-md-block"></div>
            <div className="col-12 col-md-5 col-lg-5 ps-md-4">
              <h3>Gracias por leer</h3>
              <p className="text-start lh-1 pt-3 fw-bold fst-italic">Ventajas de leer</p>
              <ul>
                <li>
                  <p className="text-start fw-light lh-1">
                    <span className="fw-medium">Desarrollo personal:&nbsp;&nbsp;</span>
                    fomenta la imaginación, la creatividad y el pensamiento crítico.
                  </p>
                </li>
                <li>
                  <p className="text-start fw-light lh-1">
                    <span className="fw-medium">Conocimiento:&nbsp;</span>
                    amplía la perspectiva y enriquece el vocabulario.
                  </p>
                </li>
                <li>
                  <p className="text-start fw-light lh-1">
                    <span className="fw-medium">Reducción del estrés:&nbsp;</span>
                    leer ayuda a desconectar y relajarse.
                  </p>
                </li>
              </ul>

              <p className="text-start lh-1 pt-3 fw-bold fst-italic">Ventajas de utilizar IntercambiaLibros</p>
              <ul>
                <li>
                  <p className="text-start fw-light lh-1">
                    <span className="fw-medium">Sostenibilidad:&nbsp;</span>
                    fomenta la reutilización, reduciendo el desperdicio
                  </p>
                </li>
                <li>
                  <p className="text-start fw-light lh-1">
                    <span className="fw-medium">Comunidad:&nbsp;</span>
                    conecta a amantes de los libros para compartir recomendaciones y experiencias.
                  </p>
                </li>
              </ul>

              <p className="text-start lh-1 fw-bold fst-italic">Quienes somos</p>
              <p className="text-start fw-light lh-1">
                Somos una plataforma creada por y para los amantes de los libros. Creemos en la magia de compartir
                historias y en el impacto positivo de reutilizar libros.
                <br />
                Nuestro objetivo es ofrecer un espacio donde las personas puedan intercambiar libros fácilmente,
                promoviendo la sostenibilidad y el acceso al conocimiento. Buscamos construir una comunidad unida por el
                amor a la lectura y el deseo de marcar la diferencia.
              </p>
            </div>

            <div className="col-12 col-md-5 col-lg-5 pe-0 mt-4 mt-md-0">
              <Image
                src="/assets/img/cerebro_lectura_fm_mundo.jpg"
                className="rounded img-fluid"
                alt="imagen de un libro y un cerebro"
                width={580}
                height={500}
              />
            </div>
          </div>
        </div>
        <Opiniones />
      </main>
    </>
  );
}
