'use client';
import { useState } from 'react';
import SideBar from '@components/perfil/sideBar';
import Image from 'next/image';

export default function Reportes() {
  // Estado para almacenar los datos del formulario y errores
  const [formValues, setFormValues] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    motivo: '',
    mensaje: '',
    acepto: false,
  });
  const [errors, setErrors] = useState({});

  // Maneja cambios en el formulario

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Función de validación
  const validate = () => {
    const newErrors = {};
    const msg = 'Este campo es obligatorio.';

    if (!formValues.nombre.trim()) {
      newErrors.nombre = msg;
    } else if (formValues.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe contener al menos 3 caracteres.';
    }
    if (!formValues.apellidos.trim()) {
      newErrors.apellidos = msg;
    } else if (formValues.apellidos.trim().length < 3) {
      newErrors.apellidos = 'El apellido debe contener al menos 3 caracteres.';
    }

    if (!formValues.email.trim()) {
      newErrors.email = 'Este campo es obligatorio.';
    } else if (!formValues.email.includes('@')) {
      newErrors.email = 'El email debe contener @';
    }

    if (!formValues.motivo.trim()) {
      newErrors.motivo = msg;
    } else if (formValues.motivo.trim().length < 3) {
      newErrors.motivo = 'El título debe contener al menos 3 caracteres.';
    }

    if (!formValues.mensaje.trim()) {
      newErrors.mensaje = msg;
    } else if (formValues.mensaje.trim().length < 20) {
      newErrors.mensaje =
        'El mensaje debe contener al menos 20 caracteres para explicar detalladamente el motivo. Por favor, proporciona una explicación completa.';
    }

    if (!formValues.acepto) {
      newErrors.acepto = 'Debes aceptar los términos y condiciones.';
    }
    // Se devuelven los errores
    return newErrors;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Si no hay errores, puedes proceder a enviar los datos al servidor
    setErrors({});
    
    const dataForm = {
      nombre: formValues.nombre,
      apellidos: formValues.apellidos,
      email: formValues.email,
      titulo: formValues.motivo,
      mensaje: formValues.mensaje,
      fecha_envio: new Date().toISOString(),
    }

    const response = await fetch("/api/contacto", {
      method: "POST",
      headers : {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataForm),
    })

    if(!response.ok){
      throw new Error("Error al enviar el formulario")
    }else{
      alert("Formulario enviado correctamente")
      setFormValues({
        nombre: '',
        apellidos: '',
        email: '',
        motivo: '',
        mensaje: '',
        acepto: false,
      });
    }

  };

  return (
    <div className="container-fluid">
      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-12 col-lg-2 ps-0">
          <SideBar />
        </div>

        {/* Contenido principal */}
        <div className="col-12 col-lg-10">
          <div className="row gx-lg-5">
            {/* Sección de imagen para móvil */}
            <div className="col-12 col-xl-7 order-0 order-xl-1 mb-4 mb-xl-0">
              <div className="d-flex justify-content-center align-items-start h-100 ps-xl-4">
                <Image
                  src="/assets/img/img_report.png"
                  alt="Imagen de un simbolo de reporte"
                  className="img-fluid rounded"
                  width={750}
                  height={400}
                />
              </div>
            </div>

            {/* Sección de contenido y formulario */}
            <div className="col-12 col-xl-5 order-1 order-xl-0">
              <h2>Sistema de reporte & Contacto</h2>
              <p className="text-secondary fs-5">Instrucciones para el sistema de reporte</p>
              <p>
                En nuestra página, queremos garantizar un ambiente seguro y agradable para todos los usuarios. Sigue
                estas instrucciones para utilizarlo correctamente:
              </p>
              <ol>
                <li>
                  <p>
                    Identifica el problema: Si encuentras un libro, usuario o contenido que infrinja nuestras normas o
                    sea inapropiado, puedes reportarlo.
                  </p>
                </li>
                <li>
                  <p>
                    Selecciona la categoría del reporte: Indica la razón del reporte seleccionando una de las opciones
                    disponibles, como:
                  </p>
                  <ul>
                    <li>Contenido inapropiado</li>
                    <li>Información falsa o engañosa</li>
                    <li>Actividad sospechosa</li>
                    <li>Otros (con posibilidad de detallar el problema)</li>
                  </ul>
                </li>
                <li>
                  <p className="mt-2">Envía el reporte: Haz clic en "Enviar" para que nuestro equipo revise el caso.</p>
                </li>
                <li>
                  <p>
                    Seguimiento: Nuestro equipo de moderación revisará el reporte y tomará las medidas necesarias.
                    Podrás recibir una notificación si se requiere más información o si se toma una acción basada en tu
                    reporte.
                  </p>
                </li>
              </ol>
              <p>
                Confidencialidad garantizada: Tus reportes son anónimos, y no compartiremos tu identidad con la persona
                reportada.
              </p>

              {/* Formulario */}
              <h4 className="mt-5">Contacto</h4>
              <form
                onSubmit={handleSubmit}
                noValidate
                className="row g-3 mb-5 mt-2"
                aria-label="Formulario de reportes"
              >
                <div className="form-floating col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInputNombre"
                    placeholder="Nombre"
                    name="nombre"
                    value={formValues.nombre}
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingInputNombre">Nombre</label>
                  {errors.nombre && <small className="text-danger">{errors.nombre}</small>}
                </div>
                <div className="form-floating col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingApellidos"
                    placeholder="Apellidos"
                    name="apellidos"
                    value={formValues.apellidos}
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingApellidos">Apellidos</label>
                  {errors.apellidos && <small className="text-danger">{errors.apellidos}</small>}
                </div>
                <div className="form-floating col-12">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingEmail"
                    placeholder="Email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    data-testid="email-input"
                  />
                  <label htmlFor="floatingEmail">Email</label>
                  {errors.email && (
                    <small data-testid="email-error-message" className="text-danger">
                      {errors.email}
                    </small>
                  )}
                </div>

                <div className="form-floating col-12">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingReason"
                    placeholder="Motivo"
                    name="motivo"
                    value={formValues.motivo}
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingReason">Título del mensaje</label>
                  {errors.motivo && <small className="text-danger">{errors.motivo}</small>}
                </div>
                <div className="form-floating col-12 my-3">
                  <textarea
                    className="form-control"
                    id="floatingInputDescripcion"
                    placeholder="Mensaje"
                    name="mensaje"
                    style={{ height: '100px' }}
                    value={formValues.mensaje}
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingInputDescripcion">Mensaje</label>
                  {errors.mensaje && <small className="text-danger">{errors.mensaje}</small>}
                </div>
                <div className="col-12">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="gridCheck"
                      name="acepto"
                      checked={formValues.acepto}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="gridCheck">
                      Acepto los términos y condiciones{' '}
                      {/* PONER UN Link con el import hacia los terminos y condiciones cuando esten READY */}
                    </label>
                  </div>
                  {errors.acepto && <small className="text-danger">{errors.acepto}</small>}
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary">
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
