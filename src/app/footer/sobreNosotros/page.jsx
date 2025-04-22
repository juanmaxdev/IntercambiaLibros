import Image from 'next/image';

export default function AboutUs() {
    return (
      <main className="container my-5">
        <h2 className="text-center mb-4">Sobre Nosotros</h2>
        <div className="row align-items-center">
          {/* Imagen a la izquierda en dispositivos grandes, arriba en móviles */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <Image
              src="/assets/img/dibujos-animados-leer-libro-cuentos-sala-estar_29190-3174.avif"
              alt="Sobre Nosotros"
              width={500}
              height={500}
              className="img-fluid rounded shadow-sm"
            />
          </div>
  
          {/* Contenido descriptivo */}
          <div className="col-lg-6">
            <p className="lead">
              En <strong>IntercambiaLibros</strong>, creemos en el poder de compartir conocimiento y experiencias a
              través de los libros. Nuestra plataforma facilita el intercambio de libros entre personas apasionadas por
              la lectura, permitiéndote descubrir nuevas historias y darle una segunda vida a esos libros que ya has
              disfrutado.
            </p>
  
            <h4 className="mt-4">Nuestra Misión</h4>
            <p>
              Fomentar una comunidad de lectores donde los libros circulen libremente, promoviendo la sostenibilidad,
              el acceso a la cultura y la conexión entre personas con intereses similares.
            </p>
  
            <h4 className="mt-4">¿Cómo Funciona?</h4>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">📚 Regístrate gratis y crea tu perfil de usuario.</li>
              <li className="list-group-item">🔍 Busca libros disponibles o publica los que deseas intercambiar.</li>
              <li className="list-group-item">📦 Contacta con otros usuarios para coordinar el intercambio.</li>
              <li className="list-group-item">🌍 Disfruta de nuevas lecturas mientras das una nueva vida a tus libros.</li>
            </ul>
  
            <h4 className="mt-4">Compromiso con la Comunidad</h4>
            <p>
              Valoramos la transparencia y la confianza. Por eso, cada intercambio es responsabilidad de los usuarios,
              quienes acuerdan los detalles del envío y las condiciones del intercambio.
            </p>
          </div>
        </div>
  
        {/* Sección de Valores */}
        <div className="row mt-5">
          <h3 className="text-center mb-4">Nuestros Valores</h3>
  
          <div className="col-md-4 text-center mb-4">
            <i className="bi bi-people fs-1"></i>
            <h5 className="mt-3">Comunidad</h5>
            <p>Creemos en el poder de la conexión y el intercambio entre personas con intereses comunes.</p>
          </div>
  
          <div className="col-md-4 text-center mb-4">
            <i className="bi bi-recycle fs-1"></i>
            <h5 className="mt-3">Sostenibilidad</h5>
            <p>Fomentamos la reutilización de libros para reducir el desperdicio y cuidar el planeta.</p>
          </div>
  
          <div className="col-md-4 text-center mb-4">
            <i className="bi bi-book fs-1"></i>
            <h5 className="mt-3">Accesibilidad</h5>
            <p>Queremos que más personas tengan acceso a la cultura y a nuevas lecturas.</p>
          </div>
        </div>
      </main>
    );
  }
  