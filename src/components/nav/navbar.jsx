'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Nav() {
  // Handler para el formulario de registro
  const handleRegister = async (e) => {
    e.preventDefault();

    // Acceder a los valores de los inputs a través de e.target
    const username = e.target.usernameInput.value;
    const email = e.target.emailInput.value;
    const password = e.target.passwordInput.value;
    const repeatPassword = e.target.repeatPasswordInput.value;

    if (password !== repeatPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const res = await fetch('/api/perfil/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_usuario: username,
          correo_electronico: email,
          contrasena: password,
        }),
      });
      
      const result = await res.json();
      alert(result.message);
      
      if (res.ok) {
        // Reinicia el formulario si se creó correctamente
        e.target.reset();
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Ocurrió un error al registrar el usuario');
    }
  };

  // Handler para el formulario de login
  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.floatingInput.value;
    const password = e.target.floatingPassword.value;

    try {
      const res = await fetch('/api/perfil/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo_electronico: email,
          contrasena: password,
        }),
      });
      
      const result = await res.json();
      alert(result.message);
      
      if (res.ok) {
        e.target.reset();
      }
    } catch (error) {
      console.error('Error en el login:', error);
      alert('Ocurrió un error al iniciar sesión');
    }
  };

  return (
    <>
      <header>
        <nav className="navbar fixed-top pb-3 shadow-sm">
          <div className="container-fluid">
            <div className="d-flex w-100 justify-content-between align-items-center">
              {/* Menú izquierdo */}
              <ul className="navbar-nav d-flex flex-row align-items-center">
                <li className="nav-item dropdown me-3 position-relative">
                  <a
                    className="nav-link"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <Image src="/assets/icons/list.svg" alt="iconoMenu" width={35} height={25} />
                  </a>
                  <ul className="dropdown-menu" style={{ position: 'absolute' }}>
                    <li>
                      <Link className="dropdown-item" href="/action">Géneros</Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" href="/views/footer/donaciones">Donaciones</Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link className="dropdown-item" href="#">Cerrar Sesión</Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" href="/">IntercambiaLibros</Link>
                </li>
              </ul>

              {/* Barra de búsqueda */}
              <div className="d-flex justify-content-center w-100 mx-3">
                <form className="d-flex" role="search" style={{ maxWidth: 600, width: '100%' }}>
                  <div className="input-group">
                    <input type="search" className="form-control" placeholder="Buscar" />
                    <button className="btn btn-outline-secondary" type="submit">
                      <Image src="/assets/icons/search.svg" alt="iconoBusqueda" width={20} height={20} />
                    </button>
                  </div>
                </form>
              </div>

              {/* Menú derecho */}
              <ul className="navbar-nav d-flex flex-row align-items-center">
                <li className="nav-item me-3">
                  <Link className="nav-link d-flex align-items-center gap-2" href="/views/subirLibro">
                    <Image src="/assets/icons/cloud-upload.svg" alt="iconoSubirLibro" width={18} height={18} />
                    <span className="d-none d-md-inline">Subir Libro</span>
                  </Link>
                </li>
                <li className="nav-item me-3">
                  <a
                    className="nav-link d-flex align-items-center gap-2"
                    data-bs-toggle="modal"
                    data-bs-target="#modalIniciarSesion"
                    href="#"
                  >
                    <Image src="/assets/icons/person-fill.svg" alt="iconoCuenta" width={18} height={18} />
                    <span className="d-none d-md-inline">Iniciar sesión</span>
                  </a>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center gap-2" href="/views/perfil">
                    <Image src="/assets/icons/bell.svg" alt="iconoNotificacion" width={18} height={18} />
                    <span className="d-none d-md-inline">Notificación</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Modales */}
        <LoginModal onLogin={handleLogin} />
        <RegistroModal onRegister={handleRegister} />
      </header>
    </>
  );
}

function LoginModal({ onLogin }) {
  return (
    <div className="modal fade" id="modalIniciarSesion" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <button type="button" className="btn-close" data-bs-dismiss="modal" />
          </div>
          <div className="modal-body p-0">
            <section className="gradient-form bg-light rounded-bottom">
              <div className="container py-4">
                <div className="text-center mb-4">
                  <Image src="/assets/img/lotus.png" width={185} height={185} alt="logo" />
                  <h4 className="mt-3">IntercambiaLibros</h4>
                </div>
                <form id="login-form" onSubmit={onLogin}>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="floatingInput"
                      name="floatingInput"
                      placeholder="Usuario"
                      required
                    />
                    <label htmlFor="floatingInput">Usuario</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="floatingPassword"
                      name="floatingPassword"
                      placeholder="Contraseña"
                      required
                    />
                    <label htmlFor="floatingPassword">Contraseña</label>
                  </div>
                  <div className="text-center">
                    <button className="btn btn-outline-primary w-100 mb-3" type="submit">
                      Iniciar Sesión
                    </button>
                    <p className="mb-2">¿No tienes una cuenta?</p>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      data-bs-target="#modalRegistro"
                      data-bs-toggle="modal"
                    >
                      Regístrate
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegistroModal({ onRegister }) {
  return (
    <div className="modal fade" id="modalRegistro" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <button type="button" className="btn-close" data-bs-dismiss="modal" />
          </div>
          <div className="modal-body p-0">
            <section className="gradient-form bg-light rounded-bottom">
              <div className="container py-4">
                <div className="text-center mb-4">
                  <h4>Crear cuenta</h4>
                  <Image src="/assets/img/lotus.png" width={120} height={120} alt="logo" />
                </div>
                <form id="register-form" onSubmit={onRegister}>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="usernameInput"
                      name="usernameInput"
                      placeholder="Nombre de usuario"
                      required
                    />
                    <label htmlFor="usernameInput">Nombre de usuario</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="emailInput"
                      name="emailInput"
                      placeholder="Email"
                      required
                    />
                    <label htmlFor="emailInput">Email</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="passwordInput"
                      name="passwordInput"
                      placeholder="Contraseña"
                      required
                    />
                    <label htmlFor="passwordInput">Contraseña</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="repeatPasswordInput"
                      name="repeatPasswordInput"
                      placeholder="Repetir Contraseña"
                      required
                    />
                    <label htmlFor="repeatPasswordInput">Repetir Contraseña</label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexCheckTerminos"
                      required
                    />
                    <label className="form-check-label" htmlFor="flexCheckTerminos">
                      He leído y acepto la <a href="#">política de privacidad</a>
                    </label>
                  </div>
                  <button className="btn btn-outline-primary w-100" type="submit">
                    Crear cuenta
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}