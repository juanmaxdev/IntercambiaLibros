'use client';
import Image from 'next/image';

export default function CarouselSimple() {
  return (
    <div className="container-fluid">
      <div id="carouselSimpleGenero" className="carousel slide" data-bs-ride="carousel" data-bs-interval="7000">
        {/* AÑADIR PARA QUE FUNCIONE EL CAROUSEL + PONER TIEMPO data-bs-ride="carousel"*/}
        <div className="border-bottom m-4 pb-2">
          <div className="d-flex justify-content-center justify-content-md-start ps-lg-5 ms-lg-5">
            <h4 className="m-0 ps-1">GÉNEROS</h4>
          </div>
        </div>
        {/* Mantiene el ancho completo */}
        <div className="carousel-inner">
          {/* Primera diapositiva con tarjetas */}
          <div className="carousel-item active p-3">
            <div className="row justify-content-center">
              {/* Card 1 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/terrifying-hand-silhouettes-studio.jpg"
                    className="card-img-top"
                    alt="Imagen de Terror"
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      TERROR
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 2 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/science-fiction-7828391_1280.jpg"
                    className="card-img-top"
                    alt="Imagen de ficción"
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-b*ody d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0 w-100 text-center text-nowrap">
                      CIENCIA FICCIÓN
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 3 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/vintage-4188771_1280.jpg"
                    className="card-img-top"
                    alt="Imagen de Romance"
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      ROMANCE
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 4 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/cosmos.jpg"
                    className="card-img-top"
                    alt="Imagen del Cosmos"
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      COSMOS
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 5 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/kyoto-jishoji-temple-fckidpm20fotp9rp.jpg"
                    className="card-img-top"
                    height={200}
                    width={100}
                    alt="..."
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      AVENTURA
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Segunda diapositiva */}
          <div className="carousel-item p-3" data-bs-interval="5000">
            {/* data-bs-interval="5000" */}
            <div className="row justify-content-center">
              {/* Card 1 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/terror-1.png"
                    className="card-img-top"
                    height={200}
                    width={100}
                    alt="Imagen de Terror"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      JUVENIL
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 2 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/terror-2.png"
                    className="card-img-top"
                    height={200}
                    width={100}
                    alt="Imagen de ficción"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0 w-100 text-center text-nowrap">
                      COMIC &amp; MANGA
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 3 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/terror-3.png"
                    className="card-img-top"
                    alt="Imagen de Romance"
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      IDIOMAS
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 4 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/terror-4.png"
                    className="card-img-top"
                    alt="..."
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      INFANTIL
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 5 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/terror-5.png"
                    className="card-img-top"
                    alt="..."
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      COCINA
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Tercera diapositiva */}
          <div className="carousel-item p-3" data-bs-interval="5000">
            {/* data-bs-interval="5000" */}
            <div className="row justify-content-center">
              {/* Card 1 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/portada1.png"
                    className="card-img-top"
                    alt="Imagen de Terror"
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      POESÍA
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 2 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/portada2.png"
                    className="card-img-top"
                    alt="Imagen de ficción"
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0 w-100 text-center text-nowrap">
                      HISTORIA
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 3 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/Portada3.png"
                    className="card-img-top"
                    alt="Imagen de Romance"
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      ARTE
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 4 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/Portada4.png"
                    className="card-img-top"
                    alt="..."
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      MUSICA
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 5 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/sereno-templo-zen-japones-tranquilo-fondo-pantalla-jardin-telefono_964851-8823.avif"
                    className="card-img-top"
                    alt="..."
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      MEDICINA
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Botones de navegación */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselSimpleGenero"
          data-bs-slide="prev"
          style={{ top: '20%' }}
        >
          <Image src="/assets/icons/Back.gif" alt="atras" width={65} height={65} />

          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselSimpleGenero"
          data-bs-slide="next"
          style={{ top: '20%' }}
        >
          <Image src="/assets/icons/Forward1.gif" alt="atras" width={50} height={50} />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

export function CarouselNuevosLibros() {
  return (
    <div className="container-fluid">
      <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel" data-bs-interval="7000">
        {/* AÑADIR PARA QUE FUNCIONE EL CAROUSEL + PONER TIEMPO data-bs-ride="carousel"*/}
        <div className="border-bottom m-4 pt-3 pb-2">
          <div className="d-flex justify-content-center justify-content-md-start ps-lg-5 ms-lg-5">
            <h4 className="m-0 ps-1">NUEVOS LIBROS</h4>
          </div>
        </div>
        {/* Mantiene el ancho completo */}
        <div className="carousel-inner">
          {/* Primera diapositiva con tarjetas */}
          <div className="carousel-item active p-3">
            {/* data-bs-interval="7000" */}
            <div className="row justify-content-center">
              {/* Card 1 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/terrifying-hand-silhouettes-studio.jpg"
                    className="card-img-top"
                    alt="Imagen de Terror"
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      TERROR
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 2 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/science-fiction-7828391_1280.jpg"
                    className="card-img-top"
                    alt="Imagen de ficción"
                    height={200}
                    width={100}
                    style={{objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0 w-100 text-center text-nowrap">
                      CIENCIA FICCIÓN
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 3 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/vintage-4188771_1280.jpg"
                    className="card-img-top"
                    alt="Imagen de Romance"
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      ROMANCE
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 4 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/cosmos.jpg"
                    className="card-img-top"
                    alt="Imagen del Cosmos"
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      COSMOS
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 5 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/kyoto-jishoji-temple-fckidpm20fotp9rp.jpg"
                    className="card-img-top"
                    alt="..."
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      AVENTURA
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Segunda diapositiva */}
          <div className="carousel-item p-3" data-bs-interval="5000">
            {/* data-bs-interval="5000" */}
            <div className="row justify-content-center">
              {/* Card 1 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/terror-1.png"
                    className="card-img-top"
                    alt="Imagen de Terror"
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      JUVENIL
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 2 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/terror-2.png"
                    className="card-img-top"
                    alt="Imagen de ficción"
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0 w-100 text-center text-nowrap">
                      COMIC &amp; MANGA
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 3 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/terror-3.png"
                    className="card-img-top"
                    alt="Imagen de Romance"
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      IDIOMAS
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 4 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/terror-4.png"
                    className="card-img-top"
                    alt="..."
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      INFANTIL
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 5 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/terror-5.png"
                    className="card-img-top"
                    alt="..."
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      COCINA
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Tercera diapositiva */}
          <div className="carousel-item p-3" data-bs-interval="5000">
            {/* data-bs-interval="5000" */}
            <div className="row justify-content-center">
              {/* Card 1 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/portada1.png"
                    className="card-img-top"
                    alt="Imagen de Terror"
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      POESÍA
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 2 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/portada2.png"
                    className="card-img-top"
                    alt="Imagen de ficción"
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0 w-100 text-center text-nowrap">
                      HISTORIA
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 3 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/Portada3.png"
                    className="card-img-top"
                    alt="Imagen de Romance"
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      ARTE
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 4 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/Portada4.png"
                    className="card-img-top"
                    alt="..."
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      MUSICA
                    </a>
                  </div>
                </div>
              </div>
              {/* Card 5 */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100">
                  <Image
                    src="/assets/img/sereno-templo-zen-japones-tranquilo-fondo-pantalla-jardin-telefono_964851-8823.avif"
                    className="card-img-top"
                    alt="..."
                    height={200}
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-center p-0">
                    <a href="#" className="btn border-0">
                      MEDICINA
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Botones de navegación */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleInterval"
          data-bs-slide="prev"
          style={{ top: '20%' }}
        >
          <Image src="/assets/icons/Back.gif" alt="atras" width={65} height={65}/>

          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleInterval"
          data-bs-slide="next"
          style={{ top: '20%' }}
        >
          <Image src="/assets/icons/Forward1.gif" alt="atras" width={50} height={50} />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
