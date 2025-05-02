"use client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import ComentariosLibro from "./comentarios-libro"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import "@/app/styles/books/styles.css"

export default function LibroSeleccionado({ book }) {
  const router = useRouter()
  const { data: session, status } = useSession();
  const [enviandoMensaje, setEnviandoMensaje] = useState(false);
  const [yaEsFavorito, setYaEsFavorito] = useState(false);
  const [mensajeFavorito, setMensajeFavorito] = useState("");

  useEffect(() => {
    const verificarFavorito = async () => {
      if (session?.user?.email) {
        const res = await fetch(`/api/libros/favoritos/verificar?id=${book.id}`);
        const data = await res.json();
        setYaEsFavorito(data.enFavoritos);
      }
    };

    verificarFavorito();
  }, [session, book.id]);

  const agregarAFavoritos = async () => {
    if (!session?.user) {
      alert("Debes iniciar sesión para añadir a favoritos.");
      return;
    }

    try {
      const res = await fetch("/api/libros/favoritos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_libro: book.id }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al guardar favorito");

      setYaEsFavorito(true);
      setMensajeFavorito("Libro añadido a favoritos");
      setTimeout(() => setMensajeFavorito(""), 3000);
    } catch (err) {
      console.error("Error al añadir a favoritos:", err);
      alert("No se pudo añadir a favoritos");
    }
  };

  if (!book) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger">
          No se pudo cargar la información del libro. Por favor, inténtalo de nuevo.
        </div>
        <button className="btn btn-dark mt-3" onClick={() => router.push("/")}>Volver a la página principal</button>
      </div>
    )
  }

  const tituloCompleto = `${book.titulo?.toUpperCase() || "TÍTULO DESCONOCIDO"} - ${book.autor?.toUpperCase() || "AUTOR DESCONOCIDO"}`;

  const contactarVendedor = (e) => {
    e.preventDefault();

    if (!session) {
      document.getElementById("loginModal").classList.add("show");
      document.getElementById("loginModal").style.display = "block";
      return;
    }

    router.push(
      `/perfil/mensajes?contacto=${encodeURIComponent(book.correo_usuario)}&libro=${encodeURIComponent(book.titulo)}`
    );
  }

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col-5 col my-5 ps-0">
          <div className="custom-rectangle bg-secondario ms-5 rounded-top">
            <div className="row">
              <div className="col-12 col d-flex flex-column align-items-center h-100 mt-5 mb-4">
                {book.imagenes ? (
                  <Image
                    src={book.imagenes || "/placeholder.svg"}
                    className="rounded"
                    alt={book.titulo || "Portada del libro"}
                    width={225}
                    height={300}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="rounded bg-light d-flex justify-content-center align-items-center"
                    style={{ width: 225, height: 300 }}
                  >
                    <span className="text-muted">Imagen no disponible</span>
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-6 col ps-5 mt-2">
                <p className="ps-3 fw-semibold">Autor</p>
                <p className="ps-3 fw-semibold">Editorial</p>
                <p className="ps-3 fw-semibold">Categoria</p>
                <p className="ps-3 fw-semibold">Tapa</p>
                <p className="ps-3 fw-semibold">ISBN</p>
                <p className="ps-3 fw-semibold">Intercambio</p>
                <p className="ps-3 fw-semibold">Estado</p>
                <p className="ps-3 fw-semibold">Ubicación</p>
                <p className="ps-3 fw-semibold pt-3">Vendedor</p>
              </div>
              <div className="col-6 col mt-2">
                <p className="fst-italic">{book.autor || "-"}</p>
                <p className="fst-italic">{book.editorial || "-"}</p>
                <p className="fst-italic">{book.nombre_genero || "-"}</p>
                <p className="fst-italic">{book.tipo_tapa || "-"}</p>
                <p className="fst-italic">{book.isbn || "-"}</p>
                <p className="fst-italic">{book.donacion === false ? "Presencial" : "Donación"}</p>
                <p className="fst-italic">{book.estado_libro || "-"}</p>
                <p className="fst-italic">{book.ubicacion || "-"}</p>
                <p className="pt-3 fst-italic">{book.nombre_usuario || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-5 col">
          <div className="container mt-5 pt-4">
            <h2 className="fw-semibold">{tituloCompleto}</h2>
            <p className="fw-medium mt-5 fs-5">Descripción del vendedor:</p>
            <p className="fw-light mt-4 fs-5 fw-lighter">
              {book.descripcion || "No hay descripción disponible para este libro."}
            </p>
            <p className="fw-semibold mt-5 fs-5">
              "¡Gracias por elegir el intercambio de libros! Al dar una nueva vida a este libro, estás ayudando a
              reducir el desperdicio y a cuidar el medio ambiente. Juntos fomentamos la reutilización, apoyamos la
              sostenibilidad y construimos una comunidad más consciente."
            </p>
            <p>🌱📚</p>
          </div>

          <div className="container d-flex align-items-center justify-content-center gap-2 mt-5">
            {!yaEsFavorito ? (
              <>
                <button
                  type="button"
                  className="btn btn-outline-danger rounded-circle border-0"
                  onClick={agregarAFavoritos}
                  title="Añadir a favoritos"
                >
                  <Image src="/assets/icons/Cupid.gif" alt="Icono de corazón" width={50} height={50} unoptimized />
                </button>
                <p className="fw-semibold pt-3 mb-0">Agregar a lista de deseados</p>
              </>
            ) : (
              <p className="fw-semibold pt-3 text-success mb-0">✓ Ya está en favoritos</p>
            )}

            {mensajeFavorito && (
              <div className="alert alert-success py-1 px-3 ms-3 mb-0" role="alert" style={{ fontSize: "0.9rem" }}>
                {mensajeFavorito}
              </div>
            )}
          </div>

          <div className="container d-flex justify-content-between gap-5 mt-3">
            <button
              type="button"
              className="btn btn-dark mt-5"
              onClick={contactarVendedor}
              disabled={enviandoMensaje || status === "loading"}
            >
              {enviandoMensaje ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Procesando...
                </>
              ) : (
                "Contactar con el vendedor"
              )}
            </button>
            <button type="button" className="btn btn-dark mt-5">Solicitar intercambio</button>
          </div>
        </div>

        <div className="col-2 col" />
      </div>

      <div className="container-fluid my-5 ps-0">
        <ComentariosLibro titulo={book.titulo || ""} session={session} />
      </div>

      <div className="container mt-4 mb-5 text-center">
        <button className="btn btn-dark" onClick={() => router.push("/")}>Volver a la galería de libros</button>
      </div>
    </div>
  );
}