"use client"
import { useState, useEffect } from "react"
import SideBar from "@/components/perfil/sideBar"
import Link from "next/link"
import Image from "next/image"
import "./stylesFormSubirLibro.css"

export default function FormSubirLibro() {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    isbn: "",
    titulo: "",
    autor: "",
    genero_id: "",
    estado_libro: "",
    descripcion: "",
    donacion: false,
    ubicacion: "",
    archivo: null,
    tipo_tapa: "",
    editorial: "",
  })

  // Estado para los errores de validación
  const [errors, setErrors] = useState({})

  // Estado para controlar si el formulario ha sido enviado
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Estado para la vista previa de la imagen
  const [imagePreview, setImagePreview] = useState(null)

  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Lista de géneros con sus IDs

  const generos = [
    { id: 1, nombre: "Novela" },
    { id: 2, nombre: "Misterio" },
    { id: 3, nombre: "Ciencia Ficción" },
    { id: 4, nombre: "Fantasía" },
    { id: 5, nombre: "Histórico" },
    { id: 6, nombre: "Fábula" },
    { id: 7, nombre: "Romántica" },
    { id: 8, nombre: "Filosofía" },
    { id: 9, nombre: "Clásico" },
    { id: 10, nombre: "Finanzas" },
    { id: 11, nombre: "Autoayuda" },
    { id: 12, nombre: "Cocina" },
    { id: 13, nombre: "Terror" },
    { id: 14, nombre: "Aventura" },
    { id: 15, nombre: "Biografía" },
    { id: 16, nombre: "Poesía" },
    { id: 17, nombre: "Juvenil" },
    { id: 18, nombre: "Infantil" },
    { id: 19, nombre: "Aprendizaje" },
    { id: 20, nombre: "Drama" },
  ]

  // Función para manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    // Para el checkbox de donación
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      })
    }
    // Para el select de género (convertir a número)
    else if (name === "genero_id") {
      setFormData({
        ...formData,
        [name]: Number.parseInt(value, 10),
      })
    }
    // Para los demás campos
    else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  // Función para manejar cambios en el archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        archivo: file,
      })

      // Crear URL para vista previa
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  // Función para eliminar la imagen seleccionada
  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      archivo: null,
    })
    setImagePreview(null)
    // Resetear el input de archivo
    const fileInput = document.getElementById("archivoInput")
    if (fileInput) fileInput.value = ""
  }

  // Validar el formulario
  const validateForm = () => {
    const tempErrors = {}
    let formIsValid = true

    // Validar título
    if (!formData.titulo) {
      tempErrors.titulo = "El título es obligatorio"
      formIsValid = false
    } else if (formData.titulo.length < 3) {
      tempErrors.titulo = "El título debe tener al menos 3 caracteres"
      formIsValid = false
    }

    // Validar autor
    if (!formData.autor) {
      tempErrors.autor = "El autor es obligatorio"
      formIsValid = false
    } else if (formData.autor.length < 3) {
      tempErrors.autor = "El autor debe tener al menos 3 caracteres"
      formIsValid = false
    }

    // Validar género
    if (!formData.genero_id) {
      tempErrors.genero_id = "Debes seleccionar un género"
      formIsValid = false
    }

    // Validar ubicación
    if (!formData.ubicacion) {
      tempErrors.ubicacion = "La ubicación es obligatoria"
      formIsValid = false
    } else if (formData.ubicacion.length < 5) {
      tempErrors.ubicacion = "La ubicación debe tener al menos 5 caracteres"
      formIsValid = false
    }

    // Validar estado del libro
    if (!formData.estado_libro) {
      tempErrors.estado_libro = "Debes seleccionar el estado del libro"
      formIsValid = false
    }

    // Validar método de intercambio
    if (!formData.metodo_intercambio) {
      tempErrors.metodo_intercambio = "Debes seleccionar un método de intercambio"
      formIsValid = false
    }

    // Validar archivo
    if (!formData.archivo) {
      tempErrors.archivo = "Debes subir al menos una imagen"
      formIsValid = false
    } else {
      // Validar que sea una imagen
      const validTypes = ["image/jpeg", "image/png", "image/jpg"]
      if (!validTypes.includes(formData.archivo.type)) {
        tempErrors.archivo = "El archivo debe ser una imagen (JPG, PNG)"
        formIsValid = false
      }

      // Validar tamaño (máximo 2MB)
      const maxSize = 2 * 1024 * 1024 // 2MB en bytes
      if (formData.archivo.size > maxSize) {
        tempErrors.archivo = "La imagen no debe superar los 2MB"
        formIsValid = false
      }
    }

    // Validar descripción
    if (!formData.descripcion) {
      tempErrors.descripcion = "La descripción es obligatoria"
      formIsValid = false
    } else if (formData.descripcion.length < 20) {
      tempErrors.descripcion = "La descripción debe tener al menos 20 caracteres"
      formIsValid = false
    }

    setErrors(tempErrors)
    return formIsValid
  }

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitted(true)
    setSuccessMessage("")

    if (validateForm()) {
      setIsLoading(true)
      try {
        // Crear un objeto FormData para enviar los datos, incluyendo la imagen
        const formDataToSend = new FormData()

        // Añadir todos los campos al FormData con los nombres correctos que espera el servidor
        formDataToSend.append("isbn", formData.isbn || "")
        formDataToSend.append("titulo", formData.titulo)
        formDataToSend.append("autor", formData.autor)
        formDataToSend.append("genero_id", formData.genero_id)
        formDataToSend.append("estado_libro", formData.estado_libro) // Cambio de estado_libro a estado
        formDataToSend.append("descripcion", formData.descripcion)
        formDataToSend.append("donacion", formData.donacion)
        formDataToSend.append("ubicacion", formData.ubicacion)
        formDataToSend.append("tipo_tapa", formData.tipo_tapa || "")
        formDataToSend.append("editorial", formData.editorial || "")
        formDataToSend.append("metodoIntercambio", formData.metodo_intercambio) // Cambio de metodo_intercambio a metodoIntercambiodonación)

        // Generar nombre de archivo con fecha actual
        if (formData.archivo) {
          const now = new Date()
          const timestamp = now.toISOString().replace(/[:.]/g, "-")
          const originalFileName = formData.archivo.name
          const fileExtension = originalFileName.split(".").pop()
          const newFileName = `${formData.titulo.replace(/\s+/g, "_")}_${timestamp}.${fileExtension}`

          // Construir la ruta completa para la imagen
          const imagePath = `https://heythjlroyqoqhqbmtlc.supabase.co/storage/v1/object/public/portada-libros/subidas/${newFileName}`

          // Añadir la imagen al FormData con el nombre "archivo"
          formDataToSend.append("archivo", formData.archivo)

          // Añadir la ruta de la imagen al FormData con el nombre "imagenes"
          formDataToSend.append("imagenes", imagePath)
        }

        // Depuración - mostrar las entradas del FormData
        console.log("Contenido del FormData:")
        for (const [key, value] of formDataToSend.entries()) {
          console.log(`${key}: ${value instanceof File ? value.name : value}`)
        }

        // Enviar los datos al servidor
        const response = await fetch("/api/proxy-books/formBooks", {
          method: "POST",
          body: formDataToSend,
          // No establecer Content-Type, el navegador lo hará automáticamente con el boundary correcto
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Error del servidor:", errorText)
          throw new Error(`Error en la solicitud: ${response.status} - ${errorText}`)
        }

        const result = await response.json()
        setSuccessMessage("Libro registrado correctamente")

        // Resetear el formulario después de enviar
        setFormData({
          isbn: "",
          titulo: "",
          autor: "",
          genero_id: "",
          estado_libro: "",
          descripcion: "",
          donacion: false,
          ubicacion: "",
          archivo: null,
          tipo_tapa: "",
          editorial: "",
        })
        setImagePreview(null)
        setIsSubmitted(false)

        // Resetear el input de archivo
        const fileInput = document.getElementById("archivoInput")
        if (fileInput) fileInput.value = ""
      } catch (error) {
        console.error("Error al enviar el formulario:", error)
        alert(`Error al enviar el formulario: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    } else {
      console.log("Formulario con errores")
    }
  }

  // Validar cuando cambian los datos y ya se ha intentado enviar
  useEffect(() => {
    if (isSubmitted) {
      validateForm()
    }
  }, [formData, isSubmitted])

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
          {successMessage && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <strong>{successMessage}</strong>
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccessMessage("")}
                aria-label="Close"
              ></button>
            </div>
          )}
          <form style={{ maxWidth: "80%" }} onSubmit={handleSubmit}>
            <div className="form-floating my-3">
              <input
                type="text"
                className={`form-control ${errors.titulo ? "is-invalid" : ""}`}
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
                className={`form-control ${errors.autor ? "is-invalid" : ""}`}
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
                className={`form-select py-0 ${errors.genero_id ? "is-invalid" : ""}`}
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
                className={`form-control ${errors.ubicacion ? "is-invalid" : ""}`}
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
                className={`form-select py-0 ${errors.estado_libro ? "is-invalid" : ""}`}
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
                <option value="Aceptable">Aceptable</option>
                <option value="Deteriorado">Deteriorado</option>
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
                <option value="Tapa dura">Tapa dura</option>
                <option value="Tapa blanda">Tapa blanda</option>
                <option value="Espiral">Espiral</option>
              </select>
              <label htmlFor="tipo_tapa">Tipo de tapa</label>
            </div>

            <div className="form-floating my-3">
              <select
                className={`form-select py-0 ${errors.metodo_intercambio ? "is-invalid" : ""}`}
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
                <option value="Presencial/Envío">Presencial / Envío</option>
              </select>
              <label htmlFor="metodo_intercambio">Método de intercambio</label>
              {errors.metodo_intercambio && <div className="invalid-feedback">{errors.metodo_intercambio}</div>}
            </div>

            <div className="form-floating my-4">
              <select
                className="form-select py-0"
                id="donacionSelect"
                name="donacion"
                value={formData.donacion ? "true" : "false"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    donacion: e.target.value === "true",
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
                className={`form-control ${errors.archivo ? "is-invalid" : ""}`}
                id="archivoInput"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                required
              />
              {errors.archivo && <div className="invalid-feedback">{errors.archivo}</div>}
              <small className="form-text text-muted">Formatos permitidos: JPG, PNG. Tamaño máximo: 2MB</small>

              {imagePreview && (
                <div className="mt-3 position-relative">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Vista previa"
                    className="img-thumbnail"
                    width={200}
                    height={300}
                    style={{ objectFit: "contain" }}
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
                className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
                id="floatingInputDescripcion"
                placeholder="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                style={{ height: "100px" }}
                required
              ></textarea>
              <label htmlFor="floatingInputDescripcion">Descripción del libro</label>
              {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
            </div>

            <div className="d-flex justify-content-between gap-3 mt-3">
              <Link href="/" className="btn btn-outline-secondary" style={{ minWidth: "45%" }}>
                Cancelar
              </Link>

              <button className="btn btn-primary" type="submit" style={{ minWidth: "45%" }} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Enviando...
                  </>
                ) : (
                  "Enviar"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
