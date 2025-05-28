'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/app/hooks/use-auth';
import Link from 'next/link';
import Image from 'next/image';
import '@/app/styles/stylesFormSubirLibro.css';

export default function FormSubirLibro() {
  const router = useRouter();
  const { data: session, status: nextAuthStatus } = useSession();
  const { isLoggedIn, userId, userName, userEmail, loading: authLoading } = useAuth();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/?login=true');
    }
  }, [isLoggedIn, authLoading, router]);

  const [formData, setFormData] = useState({
    isbn: '',
    titulo: '',
    autor: '',
    genero_id: '',
    estado_libro: '',
    descripcion: '',
    donacion: false,
    ubicacion: '',
    archivo: null,
    tipo_tapa: '',
    editorial: '',
    metodo_intercambio: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generos = [
    { id: 1, nombre: 'Novela' },
    { id: 2, nombre: 'Misterio' },
    { id: 3, nombre: 'Ciencia Ficción' },
    { id: 4, nombre: 'Fantasía' },
    { id: 5, nombre: 'Histórico' },
    { id: 6, nombre: 'Fábula' },
    { id: 7, nombre: 'Romántica' },
    { id: 8, nombre: 'Filosofía' },
    { id: 9, nombre: 'Clásico' },
    { id: 10, nombre: 'Finanzas' },
    { id: 11, nombre: 'Autoayuda' },
    { id: 12, nombre: 'Cocina' },
    { id: 13, nombre: 'Terror' },
    { id: 14, nombre: 'Aventura' },
    { id: 15, nombre: 'Biografía' },
    { id: 16, nombre: 'Poesía' },
    { id: 17, nombre: 'Juvenil' },
    { id: 18, nombre: 'Infantil' },
    { id: 19, nombre: 'Aprendizaje' },
    { id: 20, nombre: 'Drama' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (name === 'genero_id') {
      setFormData({
        ...formData,
        [name]: Number.parseInt(value, 10),
      });

    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        archivo: file,
      });

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      archivo: null,
    });
    setImagePreview(null);
    // Resetear el input de archivo
    const fileInput = document.getElementById('archivoInput');
    if (fileInput) fileInput.value = '';
  };


  // Limpiar la URL de vista previa al desmontar el componente , es importante para liberar recursos del nav
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const validateForm = () => {
    const tempErrors = {};
    let formIsValid = true;

    if (!formData.titulo || formData.titulo.length < 3) {
      tempErrors.titulo = 'El título es obligatorio y debe tener al menos 3 caracteres';
      formIsValid = false;
    }

    if (!formData.autor) {
      tempErrors.autor = 'El autor es obligatorio';
      formIsValid = false;
    } else if (formData.autor.length < 3) {
      tempErrors.autor = 'El autor debe tener al menos 3 caracteres';
      formIsValid = false;
    }

    if (!formData.genero_id) {
      tempErrors.genero_id = 'Debes seleccionar un género';
      formIsValid = false;
    }

    if (!formData.ubicacion) {
      tempErrors.ubicacion = 'La ubicación es obligatoria';
      formIsValid = false;
    } else if (formData.ubicacion.length < 5) {
      tempErrors.ubicacion = 'La ubicación debe tener al menos 5 caracteres';
      formIsValid = false;
    }

    if (!formData.estado_libro) {
      tempErrors.estado_libro = 'Debes seleccionar el estado del libro';
      formIsValid = false;
    }

    if (!formData.metodo_intercambio) {
      tempErrors.metodo_intercambio = 'Debes seleccionar un método de intercambio';
      formIsValid = false;
    }

    if (formData.archivo) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(formData.archivo.type)) {
        tempErrors.archivo = 'El archivo debe ser una imagen (JPG, PNG)';
        formIsValid = false;
      }

      const maxSize = 2 * 1024 * 1024; // 2MB en bytes
      if (formData.archivo.size > maxSize) {
        tempErrors.archivo = 'La imagen no debe superar los 2MB';
        formIsValid = false;

      }
    }

    if (!formData.descripcion) {
      tempErrors.descripcion = 'La descripción es obligatoria';
      formIsValid = false;
    } else if (formData.descripcion.length < 20) {
      tempErrors.descripcion = 'La descripción debe tener al menos 20 caracteres';
      formIsValid = false;
    }

    if (formData.isbn && !/^\d{10}(\d{3})?$/.test(formData.isbn)) {
      tempErrors.isbn = 'El ISBN debe tener 10 o 13 caracteres numéricos';
      formIsValid = false;

    }

    setErrors(tempErrors);
    return formIsValid;
  };

  const resetFileInput = () => {
    const fileInput = document.getElementById('archivoInput');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);


    if (validateForm()) {
      setIsLoading(true)
      try {
        const formDataToSend = new FormData();

        if (!session?.user?.email) {
          setErrors({ server: 'Debes iniciar sesión para subir un libro.' });
          setIsLoading(false);
          return;
        }

        formDataToSend.append('isbn', formData.isbn || '');
        formDataToSend.append('titulo', formData.titulo);
        formDataToSend.append('autor', formData.autor);
        formDataToSend.append('genero_id', String(formData.genero_id));
        formDataToSend.append('estado_libro', formData.estado_libro);
        formDataToSend.append('descripcion', formData.descripcion);
        formDataToSend.append('donacion', String(formData.donacion));
        formDataToSend.append('ubicacion', formData.ubicacion);
        formDataToSend.append('tipo_tapa', formData.tipo_tapa || '');
        formDataToSend.append('editorial', formData.editorial || '');
        formDataToSend.append('metodoIntercambio', formData.metodo_intercambio || 'Presencial');

        if (formData.archivo) {
          formDataToSend.append('archivo', formData.archivo);
        }

        const response = await fetch('/api/libros/subirLibros', {
          method: 'POST',
          body: formDataToSend,
          duplex: 'half',
        });

        if (!response.ok) {
          const errorText = await response.text();
          setErrors({ server: errorText || 'Error al subir el libro.' });
          throw new Error(`Error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        setSuccessMessage('Libro registrado correctamente');
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);

        setFormData({
          isbn: '',
          titulo: '',
          autor: '',
          genero_id: '',
          estado_libro: '',
          descripcion: '',
          donacion: false,
          ubicacion: '',
          archivo: null,
          tipo_tapa: '',
          editorial: '',
          metodo_intercambio: '',
        });

        setImagePreview(null);
        setIsSubmitted(false);
        resetFileInput();
      } catch (error) {
        alert(`Error al enviar el formulario: ${error.message}`);
      } finally {
        setIsLoading(false)
      }
    } else {
    }
  };


  useEffect(() => {
    if (isSubmitted) {
      validateForm();
    }
  }, [formData, isSubmitted]);

  if (authLoading || (!isLoggedIn && nextAuthStatus !== 'unauthenticated')) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <h4>Verificando sesión...</h4>
          <p>Debes iniciar sesión para subir un libro.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 ps-0"></div>
        <div className="col-10 mb-5">
          <h4 className="mb-4">Subir Libro</h4>
          {showSuccessModal && (
            <div
              className="modal fade show"
              style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
              role="dialog"
            >
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header border-0">
                    <h5 className="modal-title text-center text-success">¡Felicidades!</h5>
                  </div>
                  <div className="modal-body text-center">
                    <p>Libro subido correctamente</p>
                  </div>
                </div>
              </div>
            </div>
          )}
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
                required
              />
              <label htmlFor="floatingInputTitle">Título del libro</label>
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
                required
              />
              <label htmlFor="floatingAutor">Autor</label>
              {errors.autor && <div className="invalid-feedback">{errors.autor}</div>}
            </div>

            <div className="form-floating my-3">
              <select
                className={`form-select py-0 ${errors.genero_id ? 'is-invalid' : ''}`}
                aria-label="Género del libro"
                name="genero_id"
                value={formData.genero_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un género</option>
                {generos.map((genero) => (
                  <option key={genero.id} value={genero.id}>
                    {genero.nombre}
                  </option>
                ))}
              </select>
              <label htmlFor="genero_id">Género</label>
              {errors.genero_id && <div className="invalid-feedback">{errors.genero_id}</div>}
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
                type="text"
                className={`form-control ${errors.isbn ? 'is-invalid' : ''}`}
                id="floatingisbn"
                placeholder="ISBN"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
              />
              <label htmlFor="floatingIsbn">ISBN</label>
              {errors.isbn && <div className="invalid-feedback">{errors.isbn}</div>}
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
                required
              />
              <label htmlFor="floatingUbi">Ubicación</label>
              {errors.ubicacion && <div className="invalid-feedback">{errors.ubicacion}</div>}
            </div>

            <div className="form-floating my-3">
              <select
                className={`form-select py-0 ${errors.estado_libro ? 'is-invalid' : ''}`}
                aria-label="Estado del libro"
                name="estado_libro"
                value={formData.estado_libro}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Estado del libro
                </option>
                <option value="Nuevo">Nuevo</option>
                <option value="Seminuevo">Seminuevo</option>
                <option value="Usado">Usado</option>
                <option value="Deteriorado">Deteriorado</option>
                <option value="Muy Deteriorado">Muy Deteriorado</option>
              </select>
              <label htmlFor="estado_libro">Estado del libro</label>
              {errors.estado_libro && <div className="invalid-feedback">{errors.estado_libro}</div>}
            </div>

            <div className="form-floating my-3">
              <select
                className="form-select py-0"
                aria-label="Tipo de tapa"
                name="tipo_tapa"
                value={formData.tipo_tapa}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Tipo de tapa
                </option>
                <option value="Dura">Tapa dura</option>
                <option value="Blanda">Tapa blanda</option>
              </select>
              <label htmlFor="tipo_tapa">Tipo de tapa</label>
            </div>

            <div className="form-floating my-3">
              <select
                className={`form-select py-0 ${errors.metodo_intercambio ? 'is-invalid' : ''}`}
                aria-label="Método de intercambio"
                name="metodo_intercambio"
                value={formData.metodo_intercambio}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Método de intercambio
                </option>
                <option value="Presencial">Presencial</option>
                <option value="Envío">Envío</option>
              </select>
              <label htmlFor="metodo_intercambio">Método de intercambio</label>
              {errors.metodo_intercambio && <div className="invalid-feedback">{errors.metodo_intercambio}</div>}
            </div>

            <div className="form-floating my-4">
              <select
                className="form-select py-0"
                id="donacionSelect"
                name="donacion"
                value={formData.donacion ? 'true' : 'false'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    donacion: e.target.value === 'true',
                  })
                }
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
              <label htmlFor="donacionSelect">¿Es para donación?</label>
            </div>

            <div className="my-3">
              <label htmlFor="archivoInput" className="form-label">
                Imagen del libro
              </label>
              <input
                type="file"
                className={`form-control ${errors.archivo ? 'is-invalid' : ''}`}
                id="archivoInput"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              {errors.archivo && <div className="invalid-feedback">{errors.archivo}</div>}
              <small className="form-text text-muted">Formatos permitidos: JPG, PNG. Tamaño máximo: 2MB</small>

              {imagePreview && (
                <div className="mt-3 position-relative">
                  <Image
                    src={imagePreview || '/placeholder.svg'}
                    alt="Vista previa"
                    className="img-thumbnail"
                    width={200}
                    height={300}
                    style={{ objectFit: 'contain' }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                    onClick={handleRemoveImage}
                  >
                    <i className="bi bi-x"></i> Eliminar
                  </button>
                </div>
              )}
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
                required
              ></textarea>
              <label htmlFor="floatingInputDescripcion">Descripción del libro</label>
              {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
            </div>

            <div className="d-flex justify-content-between gap-3 mt-3">
              <Link href="/" className="btn btn-outline-secondary" style={{ minWidth: '45%' }}>
                Cancelar
              </Link>

              <button className="btn btn-primary" type="submit" style={{ minWidth: '45%' }} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Enviando...
                  </>
                ) : (
                  'Enviar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="modal-backdrop" style={{ display: "block" }}>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">¡Operación exitosa!</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowSuccessModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body text-center py-4">
                  <i className="bi bi-check-circle-fill text-success fs-1 mb-3"></i>
                  <h4>El libro se ha subido correctamente</h4>
                  <p className="mb-0">Tu libro ya está disponible para intercambio.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={() => setShowSuccessModal(false)}>
                    Aceptar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
