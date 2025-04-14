'use client';
import { useState, useEffect } from 'react';
import SideBar from '@/components/perfil/sideBar';
import Link from 'next/link';

export default function FormSubirLibro() {
  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    editorial: '',
    isbn: '',
    ubicacion: '',
    estado: '',
    metodoIntercambio: '',
    tipoIntercambio: '',
    archivo: null,
    descripcion: '',
  });

  // Estado para los errores de validación
  const [errors, setErrors] = useState({});

  // Estado para controlar si el formulario ha sido enviado
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Función para manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función para manejar cambios en el archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      archivo: file,
    });
  };

  // Validar el formulario
  const validateForm = () => {
    const tempErrors = {};
    let formIsValid = true;

    // Validar título
    if (!formData.titulo) {
      tempErrors.titulo = 'El título es obligatorio';
      formIsValid = false;
    } else if (formData.titulo.length < 3) {
      tempErrors.titulo = 'El título debe tener al menos 3 caracteres';
      formIsValid = false;
    }

    // Validar autor
    if (!formData.autor) {
      tempErrors.autor = 'El autor es obligatorio';
      formIsValid = false;
    } else if (formData.autor.length < 3) {
      tempErrors.autor = 'El autor debe tener al menos 3 caracteres';
      formIsValid = false;
    }

    // Validar ubicación
    if (!formData.ubicacion) {
      tempErrors.ubicacion = 'La ubicación es obligatoria';
      formIsValid = false;
    }

    // Validar estado del libro
    if (!formData.estado) {
      tempErrors.estado = 'Debes seleccionar el estado del libro';
      formIsValid = false;
    }

    // Validar método de intercambio
    if (!formData.metodoIntercambio) {
      tempErrors.metodoIntercambio = 'Debes seleccionar un método de intercambio';
      formIsValid = false;
    }

    // Validar tipo de intercambio
    if (!formData.tipoIntercambio) {
      tempErrors.tipoIntercambio = 'Debes seleccionar intercambio o donación';
      formIsValid = false;
    }

    // Validar archivo
    if (!formData.archivo) {
      tempErrors.archivo = 'Debes subir al menos una imagen';
      formIsValid = false;
    } else {
      // Validar que sea una imagen
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(formData.archivo.type)) {
        tempErrors.archivo = 'El archivo debe ser una imagen (JPG, PNG)';
        formIsValid = false;
      }

      // Validar tamaño (máximo 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB en bytes
      if (formData.archivo.size > maxSize) {
        tempErrors.archivo = 'La imagen no debe superar los 2MB';
        formIsValid = false;
      }
    }

    // Validar descripción
    if (!formData.descripcion) {
      tempErrors.descripcion = 'La descripción es obligatoria';
      formIsValid = false;
    } else if (formData.descripcion.length < 20) {
      tempErrors.descripcion = 'La descripción debe tener al menos 20 caracteres';
      formIsValid = false;
    }

    setErrors(tempErrors);
    return formIsValid;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm()) {
      // Aquí iría la lógica para enviar los datos al servidor
      alert('Formulario enviado correctamente');
      console.log('Datos del formulario:', formData);

      // Resetear el formulario después de enviar
      setFormData({
        titulo: '',
        autor: '',
        editorial: '',
        isbn: '',
        ubicacion: '',
        estado: '',
        metodoIntercambio: '',
        tipoIntercambio: '',
        archivo: null,
        descripcion: '',
      });
      setIsSubmitted(false);
    } else {
      console.log('Formulario con errores');
    }
  };

  // Validar cuando cambian los datos y ya se ha intentado enviar
  useEffect(() => {
    if (isSubmitted) {
      validateForm();
    }
  }, [formData, isSubmitted]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 ps-0">
          {/* SIDE NAV */}
          <SideBar />
        </div>
        <div className="col-10 mb-5">
          {/* FORMULARIO */}
          <h4 className="mb-4">Subir Libro</h4>
          <form style={{ maxWidth: '80%' }} onSubmit={handleSubmit}>
            <div className="form-floating my-3">
              <input
                type="text"
                className={`form-control ${errors.titulo ? 'is-invalid' : ''}`}
                id="floatingInputTitle"
                placeholder="Titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
              />
              <label htmlFor="floatingInputTitle">Titulo del libro</label>
              {errors.titulo && <div className="invalid-feedback">{errors.titulo}</div>}
            </div>

            <div className="form-floating my-3">
              <input
                type="text"
                className={`form-control ${errors.autor ? 'is-invalid' : ''}`}
                id="floatingAutor"
                placeholder="Autor"
                name="autor"
                value={formData.autor}
                onChange={handleChange}
              />
              <label htmlFor="floatingAutor">Autor</label>
              {errors.autor && <div className="invalid-feedback">{errors.autor}</div>}
            </div>

            <div className="form-floating my-3">
              <input
                type="text"
                className="form-control"
                id="floatingEditorial"
                placeholder="Editorial"
                name="editorial"
                value={formData.editorial}
                onChange={handleChange}
              />
              <label htmlFor="floatingEditorial">Editorial</label>
            </div>

            <div className="form-floating my-3">
              <input
                type="number"
                className="form-control"
                id="floatingisbn"
                placeholder="ISBN"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
              />
              <label htmlFor="floatingIsbn">ISBN</label>
            </div>

            <div className="form-floating my-3">
              <input
                type="text"
                className={`form-control ${errors.ubicacion ? 'is-invalid' : ''}`}
                id="floatingUbi"
                placeholder="Ubicación"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
              />
              <label htmlFor="floatingUbi">Ubicación</label>
              {errors.ubicacion && <div className="invalid-feedback">{errors.ubicacion}</div>}
            </div>

            <div className="form-floating my-3">
              <select
                className={`form-select py-0 ${errors.estado ? 'is-invalid' : ''}`}
                aria-label="Estado del libro"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Estado del libro
                </option>
                <option value="1">Nuevo</option>
                <option value="2">Seminuevo</option>
                <option value="3">Aceptable</option>
                <option value="4">Deteriorado</option>
              </select>
              {errors.estado && <div className="invalid-feedback">{errors.estado}</div>}
            </div>

            <div className="form-floating my-3">
              <select
                className={`form-select py-0 ${errors.metodoIntercambio ? 'is-invalid' : ''}`}
                aria-label="Método de intercambio"
                name="metodoIntercambio"
                value={formData.metodoIntercambio}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Metodo de intercambio
                </option>
                <option value="1">Presencial</option>
                <option value="2">Intercambio Online</option>
              </select>
              {errors.metodoIntercambio && <div className="invalid-feedback">{errors.metodoIntercambio}</div>}
            </div>

            <div className="form-floating my-3">
              <select
                className={`form-select py-0 ${errors.tipoIntercambio ? 'is-invalid' : ''}`}
                aria-label="Tipo de intercambio"
                name="tipoIntercambio"
                value={formData.tipoIntercambio}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Intercambio / Donacion
                </option>
                <option value="1">Intercambio</option>
                <option value="2">Donación</option>
              </select>
              {errors.tipoIntercambio && <div className="invalid-feedback">{errors.tipoIntercambio}</div>}
            </div>

            <div className="form-floating my-3">
              <input
                type="file"
                className={`form-control ${errors.archivo ? 'is-invalid' : ''}`}
                id="archivoInput"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              <label htmlFor="archivoInput">Subir archivo</label>
              {errors.archivo && <div className="invalid-feedback">{errors.archivo}</div>}
              <small className="form-text text-muted">Formatos permitidos: JPG, PNG. Tamaño máximo: 2MB</small>
            </div>

            <div className="form-floating my-3">
              <textarea
                className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
                id="floatingInputDescripcion"
                placeholder="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                style={{ height: '100px' }}
              ></textarea>
              <label htmlFor="floatingInputDescripcion">Descripción del libro</label>
              {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
            </div>

            <div className="d-flex justify-content-between gap-3 mt-3">
              <Link href="/" className="btn btn-outline-secondary" style={{ minWidth: '45%' }}>
                Cancelar
              </Link>

              <button className="btn btn-primary" type="submit" style={{ minWidth: '45%' }}>
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
