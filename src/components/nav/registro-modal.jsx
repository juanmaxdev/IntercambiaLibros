"use client";
import Image from "next/image";
import { useState } from "react";

export function RegistroModal() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito

  const handleRegister = async (e) => {
    e.preventDefault();

    // Obtener los valores del formulario
    const username = document.getElementById("usernameInput").value;
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    const repeatPassword = document.getElementById("repeatPasswordInput").value;

    // Validar contraseñas coincidan
    if (password !== repeatPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    try {
      // Enviar los datos a la API
      const response = await fetch("/api/perfil/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_usuario: username,
          correo_electronico: email,
          contrasena: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Registro exitoso:", data);

        // Mostrar mensaje de éxito
        setSuccessMessage("Cuenta creada exitosamente. Ya puedes iniciar sesión.");
        setErrorMessage(""); // Limpiar mensajes de error

        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
          setSuccessMessage("");
          document.getElementById("modalRegistro").click(); // Cerrar el modal
        }, 3000);
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Error al registrar el usuario");
      }
    } catch (err) {
      console.error("Error del servidor:", err);
      setErrorMessage("Error del servidor. Inténtalo más tarde.");
    }
  };

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
                      <Image src="/assets/img/logo2.png" width={160} height={40} alt="logo" />
                    </div>
                    <form onSubmit={handleRegister}>
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
                        <input
                          type="password"
                          className="form-control"
                          id="passwordInput"
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
                      {errorMessage && <p className="text-danger">{errorMessage}</p>}
                      {successMessage && <p className="text-success">{successMessage}</p>}
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
