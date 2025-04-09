'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Nav() {
  return (
    <>
      <header>
        <nav className="navbar fixed-top pb-2 shadow-sm">
          <div className="container-fluid">
            <div className="d-flex w-100 justify-content-between align-items-center">
              {/* Menú izquierdo */}
              <ul className="navbar-nav d-flex flex-row align-items-center">
                <li className="nav-item dropdown me-3 position-relative">
                  <a className="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <Image src="/assets/icons/list.svg" alt="iconoMenu" width={35} height={25} />
                  </a>
                  <ul className="dropdown-menu" style={{ position: 'absolute' }}>
                    <li>
                      <Link className="dropdown-item" href="/action">
                        Generos
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" href="/views/footer/donaciones">
                        Donaciones
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link className="dropdown-item" href="/something-else">
                        Cerrar Sesión
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active p-0 " aria-current="page" href="/">
                    <Image src="/assets/img/logo2.png" alt="logo" width={150} height={28} />
                  </Link>
                </li>
              </ul>

              {/* Barra de búsqueda */}
              <div className="d-flex justify-content-center w-100 mx-3">
                <form className="d-flex" role="search" style={{ maxWidth: 600, width: '100%' }}>
                  <div className="input-group">
                    <input type="search" className="form-control" placeholder="Buscar" aria-label="Buscar" />
                    <button className="btn btn-outline-secondary" type="submit">
                      <Image src="/assets/icons/search.svg" alt="iconoBusqueda" width={20} height={20} />
                    </button>
                  </div>
                </form>
              </div>

              {/* Menú derecho */}
              <ul className="navbar-nav d-flex flex-row align-items-center">
                <li className="nav-item me-3">
                  <Link className="nav-link d-flex align-items-center gap-2 text-nowrap" href="/views/subirLibro">
                    <Image src="/assets/icons/cloud-upload.svg" alt="iconoSubirLibro" width={18} height={18} />
                    <span className="d-none d-md-inline">Subir Libro</span>
                  </Link>
                </li>
                <li className="nav-item me-3">
                  <Link
                    className="nav-link d-flex align-items-center gap-2 text-nowrap"
                    data-bs-toggle="modal"
                    data-bs-target="#modalIniciarSesion"
                    href="#"
                  >
                    <Image src="/assets/icons/person-fill.svg" alt="iconoCuenta" width={18} height={18} />
                    <span className="d-none d-md-inline">Iniciar sesión</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center gap-2 text-nowrap" href="/views/perfil">
                    <Image src="/assets/icons/bell.svg" alt="iconoNotificacion" width={18} height={18} />
                    <span className="d-none d-md-inline">Notificación</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* Modales renderizados siempre */}
        <LoginModal />
        <RegistroModal />
      </header>
    </>
  );
}
export function LoginModal() {
  return (
    <div
      className="modal fade"
      id="modalIniciarSesion"
      tabIndex={-1}
      aria-labelledby="modalIniciarSesion"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body p-0">
            <section className="gradient-form rounded-bottom bg-light">
              <div className="container py-4">
                <div className="row justify-content-center align-items-center">
                  <div className="col-12">
                    <div className="text-center mb-4">
                      <Image src="/assets/img/lotus.png" width={185} height={185} alt="logo" />
                      <h4 className="mt-3">IntercambiaLibros</h4>
                    </div>
                    <form>
                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className="form-control"
                          id="floatingInput"
                          placeholder="name@example.com"
                          required
                        />
                        <label htmlFor="floatingInput">Usuario</label>
                      </div>
                      <div className="form-floating mb-3">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" required/>
                        <label htmlFor="floatingPassword">Contraseña</label>
                      </div>
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3">
                        <button className="btn btn-outline-primary w-100 w-sm-75 mb-2 mb-sm-0" type="submit">
                          Iniciar Sesión
                        </button>
                        <a className="text-muted ms-sm-3" href="#!">
                          ¿Olvidaste la contraseña?
                        </a>
                      </div>
                      <div className="text-center">
                        <p className="mb-2">¿No tienes una cuenta?</p>
                        <button
                          type="button"
                          className="btn btn-outline-danger border-0"
                          data-bs-target="#modalRegistro"
                          data-bs-toggle="modal"
                        >
                          Regístrate
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RegistroModal() {
  return (
    <div className="modal fade" id="modalRegistro" tabIndex={-1} aria-labelledby="modalRegistro" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content ">
          <div className="modal-header bg-light">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body p-0">
            <section className="gradient-form rounded-bottom bg-light">
              <div className="container py-4">
                <div className="row justify-content-center align-items-center">
                  <div className="col-12">
                    <div className="text-center mb-4">
                      <h4 className="mb-2">Crear cuenta</h4>
                      <Image src="/assets/img/lotus.png" width={120} height={120} alt="logo" />
                    </div>
                    <form>
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="usernameInput"
                          placeholder="Nombre de usuario"
                          required
                        />
                        <label htmlFor="usernameInput">Nombre de usuario</label>
                      </div>
                      <div className="form-floating mb-3">
                        <input type="email" className="form-control" id="emailInput" placeholder="Email" required />
                        <label htmlFor="emailInput">Email</label>
                      </div>
                      <div className="form-floating mb-3">
                        <input type="password" className="form-control" id="passwordInput" placeholder="Contraseña" required/>
                        <label htmlFor="passwordInput">Contraseña</label>
                      </div>
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          className="form-control"
                          id="repeatPasswordInput"
                          placeholder="Repetir Contraseña"
                          required
                        />
                        <label htmlFor="repeatPasswordInput">Repetir Contraseña</label>
                      </div>
                      <div className="form-check mb-3">
                        <input className="form-check-input" type="checkbox" id="flexCheckTerminos" required />
                        <label className="form-check-label" htmlFor="flexCheckTerminos">
                          He leído y acepto la <a href="#">política de privacidad</a>
                        </label>
                      </div>
                      <div className="mb-3">
                        <button className="btn btn-outline-primary w-100" type="submit">
                          Crear cuenta
                        </button>
                      </div>
                      <div className="d-flex align-items-center justify-content-center mb-3">
                        <div className="flex-grow-1 border-top"></div>
                        <span className="px-3">Ya tengo una cuenta</span>
                        <div className="flex-grow-1 border-top"></div>
                      </div>
                      <div className="text-center">
                        <button
                          type="button"
                          className="btn btn-outline-danger w-100"
                          data-bs-target="#modalIniciarSesion"
                          data-bs-toggle="modal"
                        >
                          Iniciar sesión
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
