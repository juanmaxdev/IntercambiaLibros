"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ModernSidebar from "./sideBar";
import "@/app/styles/perfil/perfil-styles.css";

export default function PerfilUser() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/?login=true");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/perfil");
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setEditData(data);
        }
      } catch (err) {
        console.error("Error obteniendo perfil:", err);
      }
    };

    if (status === "authenticated") {
      fetchUserData();
    }
  }, [status]);

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        const res = await fetch("/api/perfil", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editData),
        });

        if (res.ok) {
          setUserData({ ...editData });
          alert("Perfil actualizado");
        } else {
          alert("Error al guardar cambios");
        }
      } catch (err) {
        console.error(err);
      }
    }

    setIsEditing(!isEditing);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const res = await signIn("credentials", {
      redirect: false,
      email: correo, // del input
      password: contrasena, // del input
    });
  
    if (res.ok) {
      router.push("/perfil");
    } else {
      setError("Correo o contraseña incorrectos");
    }
  }; 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  if (status === "loading" || !userData) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" />
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
          <div className="col-lg-3 col-xl-2 px-0">
            <ModernSidebar activeItem="perfil" />
          </div>

          <div className="col-lg-9 col-xl-10 p-0">
            <div className="profile-content">
              <div className="profile-header">
                <div className="profile-cover"><div className="cover-overlay"></div></div>
                <div className="profile-avatar">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Foto de perfil"
                      width={120}
                      height={120}
                      className="avatar-img"
                    />
                  ) : (
                    <div className="avatar-placeholder">{userData?.nombre_usuario?.charAt(0) || "U"}</div>
                  )}
                </div>
                <div className="profile-info">
                  <h2 className="profile-name">{userData?.nombre_usuario || "Usuario"}</h2>
                  <p className="profile-email">{userData?.correo_electronico}</p>
                  <button
                    className={`btn ${isEditing ? "btn-success" : "btn-outline-primary"} btn-sm mt-2`}
                    onClick={handleEditToggle}
                  >
                    {isEditing ? (
                      <><i className="bi bi-check-lg me-2"></i>Guardar cambios</>
                    ) : (
                      <><i className="bi bi-pencil me-2"></i>Editar perfil</>
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
                            <div className="col-12">
                              <label className="form-label">Nombre</label>
                              <input
                                type="text"
                                className="form-control"
                                name="nombre_usuario"
                                value={editData?.nombre_usuario || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label">Ubicación</label>
                              <input
                                type="text"
                                className="form-control"
                                name="ubicacion"
                                value={editData?.ubicacion || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label">Biografía</label>
                              <textarea
                                className="form-control"
                                name="biografia"
                                rows="3"
                                value={editData?.biografia || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="info-grid">
                            <p><strong>Nombre:</strong> {userData?.nombre_usuario}</p>
                            <p><strong>Correo:</strong> {userData?.correo_electronico}</p>
                            <p><strong>Ubicación:</strong> {userData?.ubicacion}</p>
                            <p><strong>Biografía:</strong> {userData?.biografia}</p>
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
                            <div className="stat-icon"><i className="bi bi-book"></i></div>
                            <div className="stat-content">
                              <div className="stat-value">12</div>
                              <div className="stat-label">Libros subidos</div>
                            </div>
                          </div>
                          <div className="stat-item">
                            <div className="stat-icon"><i className="bi bi-arrow-left-right"></i></div>
                            <div className="stat-content">
                              <div className="stat-value">8</div>
                              <div className="stat-label">Intercambios</div>
                            </div>
                          </div>
                          <div className="stat-item">
                            <div className="stat-icon"><i className="bi bi-heart"></i></div>
                            <div className="stat-content">
                              <div className="stat-value">15</div>
                              <div className="stat-label">Favoritos</div>
                            </div>
                          </div>
                          <div className="stat-item">
                            <div className="stat-icon"><i className="bi bi-star"></i></div>
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