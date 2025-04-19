'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <div className="container-fluid mx-0 p-0 border-top" style={{ '--bs-border-opacity': 0.5 }}>
      <footer className="py-5 position-static bottom-0 w-100 pb-0 pt-3 pe-4 mb-3">
        <div className="row align-items-center m-0">
          {/* Sección Izquierda */}
          <div className="col-12 col-md-4 d-flex flex-column align-items-center mb-4 mb-md-0">
            <p className="mb-0 me-0 text-center">¿Necesitas ayuda?</p>
            <Link
              href="/views/perfil/reportes"
              className="btn btn-outline-info mt-4 px-3 py-1 d-flex align-items-center justify-content-center rounded-pill"
              style={{ width: '120px' }}
            >
              Contáctanos
            </Link>
          </div>

          {/* Sección Derecha */}
          <div className="col-12 col-md-8 d-flex flex-wrap justify-content-center justify-content-md-end gap-4 gap-md-5 p-0">
            <div className="col-auto  text-md-start">
              <ul className="nav flex-column ">
                <li className="nav-item mb-2">
                  <Link href="/views/footer/sobreNosotros" className="nav-link p-0 text-body-secondary">
                    Sobre Nosotros
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link href="/views/footer/donaciones" className="nav-link p-0 text-body-secondary">
                    Donaciones
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 2 */}
            <div className="col-auto text-center text-md-start">
              <ul className="nav flex-column">
                <li className="nav-item mb-2">
                  <Link href="/views/footer/cookies" className="nav-link p-0 text-body-secondary">
                    Cookies
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link href="/views/footer/faqs" className="nav-link p-0 text-body-secondary">
                    FAQs
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link href="#" className="nav-link p-0 text-body-secondary text-nowrap">
                    España
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 3 */}
            <div className="col-auto text-center text-md-start">
              <ul className="nav flex-column">
                <li className="nav-item mb-2">
                  <Link href="/views/footer/politicaPrivacidad" className="nav-link p-0 text-body-secondary">
                    Política de privacidad
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link href="/views/footer/terminosCondiciones" className="nav-link p-0 text-body-secondary">
                    Términos y condiciones
                  </Link>
                </li>
                <li className="nav-item mb-2 d-flex justify-content-center justify-content-md-start gap-3">
                  <Link href="#" className="nav-link p-0 text-body-secondary">
                    <Image src="/assets/icons/instagram.svg" width={18} height={18} alt="Instagram" />
                  </Link>
                  <Link href="#" className="nav-link p-0 text-body-secondary">
                    <Image src="/assets/icons/facebook.svg" width={18} height="18" alt="Facebook" />
                  </Link>
                  <Link href="#" className="nav-link p-0 text-body-secondary">
                    <Image src="/assets/icons/youtube.svg" width={18} height={18} alt="YouTube" />
                  </Link>
                  <Link href="#" className="nav-link p-0 text-body-secondary">
                    <Image src="/assets/icons/twitter-x.svg" width={18} height={18} alt="Twitter" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
