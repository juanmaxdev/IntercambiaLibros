"use client"
import Image from "next/image"
import { signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function LoginModal() {
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" })
  }

  useEffect(() => {
    let timeout

    const resetTimeout = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        signOut()
      }, 30 * 60 * 1000) // 30 minutos en milisegundos
    }

    const events = ["mousemove", "keydown", "click"]
    events.forEach((event) => window.addEventListener(event, resetTimeout))

    resetTimeout()

    return () => {
      clearTimeout(timeout)
      events.forEach((event) => window.removeEventListener(event, resetTimeout))
    }
  }, [])

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
                          type="text"
                          className="form-control"
                          id="floatingInput"
                          placeholder="name@example.com"
                          required
                        />
                        <label htmlFor="floatingInput">Usuario o email</label>
                      </div>
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          className="form-control"
                          id="floatingPassword"
                          placeholder="Password"
                          required
                        />
                        <label htmlFor="floatingPassword">Contraseña</label>
                      </div>
                      <div className="d-grid mb-3">
                        <button
                          type="button"
                          className="btn btn-outline-success d-flex align-items-center justify-content-center gap-2"
                          onClick={handleGoogleSignIn}
                        >
                          <Image src="/assets/icons/google.svg" alt="Google" width={18} height={18} />
                          Iniciar sesión con Google
                        </button>
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
  )
}
