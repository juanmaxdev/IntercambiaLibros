"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ModernSidebar from "./sideBar";
import "@/app/styles/perfil/perfil-styles.css";

export default function PerfilUser() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null); // Datos del usuario
  const [editData, setEditData] = useState(null); // Datos editables

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/?login=true");
    }
  }, [status, router]);

  // Obtener los datos del usuario al cargar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/perfil", {
            method: "GET",
            headers: {
              email: session.user.email, // Enviar el email del usuario
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserData(data);
            setEditData(data); // Inicializar los datos editables
          } else {
            console.error("Error al obtener los datos del usuario");
          }
        } catch (error) {
          console.error("Error del servidor:", error);
        }
      }
    };

    fetchUserData();
  }, [session]);

  const handleEditToggle = async () => {
    if (isEditing) {
      // Guardar cambios
      try {
        const response = await fetch("/api/perfil", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session.user.email, // Enviar el email del usuario
            ...editData, // Enviar los datos actualizados
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.message);
          setUserData({ ...editData }); // Actualizar los datos locales
        } else {
          console.error("Error al actualizar los datos del usuario");
        }
      } catch (error) {
        console.error("Error del servidor:", error);
      }
    }

    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  if (status === "loading" || !userData) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <h4>Verificando sesión...</h4>
          <p>Debes iniciar sesión para ver tu perfil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar moderna */}
          <div className="col-lg-3 col-xl-2 px-0">
            <ModernSidebar activeItem="perfil" />
          </div>

          {/* Contenido principal */}
          <div className="col-lg-9 col-xl-10 p-0">
            <div className="profile-content">
              <div className="profile-header">
                <div className="profile-cover">
                  <div className="cover-overlay"></div>
                </div>
                <div className="profile-avatar">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image || "/placeholder.svg"}
                      alt="Foto de perfil"
                      width={120}
                      height={120}
                      className="avatar-img"
                    />
                  ) : (
                    <div className="avatar-placeholder">{session?.user?.name?.charAt(0) || "U"}</div>
                  )}
                </div>
                <div className="profile-info">
                  <h2 className="profile-name">{session?.user?.name || "Usuario"}</h2>
                  <p className="profile-email">{session?.user?.email || ""}</p>
                  <button
                    className={`btn ${isEditing ? "btn-success" : "btn-outline-primary"} btn-sm mt-2`}
                    onClick={handleEditToggle}
                  >
                    {isEditing ? (
                      <>
                        <i className="bi bi-check-lg me-2"></i>Guardar cambios
                      </>
                    ) : (
                      <>
                        <i className="bi bi-pencil me-2"></i>Editar perfil
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="profile-body">
                <div className="row">
                  <div className="col-md-8">
                    <div className="profile-section">
                      <h3 className="section-title">Información Personal</h3>
                      <div className="section-content">
                        {isEditing ? (
                          <div className="row g-3">
                            {/* Campos editables */}
                          </div>
                        ) : (
                          <div className="info-grid">
                            {/* Información no editable */}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="profile-section">
                      <h3 className="section-title">Estadísticas</h3>
                      <div className="section-content">
                        <div className="stats-grid">
                          <div className="stat-item">
                            <div className="stat-icon">
                              <i className="bi bi-book"></i>
                            </div>
                            <div className="stat-content">
                              <div className="stat-value">12</div>
                              <div className="stat-label">Libros subidos</div>
                            </div>
                          </div>
                          <div className="stat-item">
                            <div className="stat-icon">
                              <i className="bi bi-arrow-left-right"></i>
                            </div>
                            <div className="stat-content">
                              <div className="stat-value">8</div>
                              <div className="stat-label">Intercambios</div>
                            </div>
                          </div>
                          <div className="stat-item">
                            <div className="stat-icon">
                              <i className="bi bi-heart"></i>
                            </div>
                            <div className="stat-content">
                              <div className="stat-value">15</div>
                              <div className="stat-label">Favoritos</div>
                            </div>
                          </div>
                          <div className="stat-item">
                            <div className="stat-icon">
                              <i className="bi bi-star"></i>
                            </div>
                            <div className="stat-content">
                              <div className="stat-value">4.8</div>
                              <div className="stat-label">Valoración</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
