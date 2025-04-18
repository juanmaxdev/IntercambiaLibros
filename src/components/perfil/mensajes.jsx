'use client';
import SideBar from '@components/perfil/sideBar';

export default function Mensajes() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 ps-0">
          {/* SIDE NAV */}
          <SideBar />
        </div>
        <div className="col-8">
          <h2 className="mb-4">Mensajes</h2>
          <div className="chat-container card shadow p-3 mb-4">
            {/* Encabezado con ID del usuario y título del libro */}
            <div className="chat-header bg-secondary text-white p-2 rounded d-flex justify-content-between align-items-center">
              <span>ID Usuario: 12345</span>
              <strong>Usuario: Laura</strong>
              <span>Título del libro: "El principito"</span>
            </div>
            {/* Área del chat */}
            <div className="chat-body p-3 d-flex flex-column overflow-auto" style={{ height: 225 }}>
              {/* Mensaje del otro usuario (izquierda) */}
              <div className="d-flex justify-content-start mb-2">
                <div className="bg-light text-dark p-2 rounded-pill" style={{ maxWidth: '75%' }}>
                  ¡Hola! Estoy interesado en el libro.
                </div>
              </div>
              {/* Mensaje del usuario actual (derecha) */}
              <div className="d-flex justify-content-end mb-2">
                <div className="bg-primary text-white p-2 rounded-pill" style={{ maxWidth: '75%' }}>
                  ¡Genial! ¿Quieres más detalles?
                </div>
              </div>
              {/* Más mensajes de prueba */}
              <div className="d-flex justify-content-start mb-2">
                <div className="bg-light text-dark p-2 rounded-pill" style={{ maxWidth: '75%' }}>
                  ¿Está en buen estado?
                </div>
              </div>
              <div className="d-flex justify-content-end mb-2">
                <div className="bg-primary text-white p-2 rounded-pill" style={{ maxWidth: '75%' }}>
                  Sí, está casi nuevo.
                </div>
              </div>
            </div>
            {/* Input para escribir mensajes */}
            <div className="chat-footer p-2">
              <input type="text" className="form-control" placeholder="Escribe un mensaje..." />
            </div>
          </div>
          {/* CHAT Nº2 */}
          <div className="chat-container card shadow p-3 mb-4">
            {/* Encabezado con ID del usuario y título del libro */}
            <div className="chat-header bg-secondary text-white p-2 rounded d-flex justify-content-between align-items-center">
              <span>ID Usuario: 12345</span>
              <strong>Usuario: Laura</strong>
              <span>Título del libro: "El principito"</span>
            </div>
            {/* Área del chat */}
            <div className="chat-body p-3 d-flex flex-column overflow-auto" style={{ height: 225 }}>
              {/* Mensaje del otro usuario (izquierda) */}
              <div className="d-flex justify-content-start mb-2">
                <div className="bg-light text-dark p-2 rounded-pill" style={{ maxWidth: '75%' }}>
                  ¡Hola! Estoy interesado en el libro.
                </div>
              </div>
              {/* Mensaje del usuario actual (derecha) */}
              <div className="d-flex justify-content-end mb-2">
                <div className="bg-primary text-white p-2 rounded-pill" style={{ maxWidth: '75%' }}>
                  ¡Genial! ¿Quieres más detalles?
                </div>
              </div>
              {/* Más mensajes de prueba */}
              <div className="d-flex justify-content-start mb-2">
                <div className="bg-light text-dark p-2 rounded-pill" style={{ maxWidth: '75%' }}>
                  ¿Está en buen estado?
                </div>
              </div>
              <div className="d-flex justify-content-end mb-2">
                <div className="bg-primary text-white p-2 rounded-pill" style={{ maxWidth: '75%' }}>
                  Sí, está casi nuevo.
                </div>
              </div>
            </div>
            {/* Input para escribir mensajes */}
            <div className="chat-footer p-2">
              <input type="text" className="form-control" placeholder="Escribe un mensaje..." />
            </div>
          </div>
          {/* CHAT Nº 3*/}
          <div className="chat-container card shadow p-3 mb-4">
            {/* Encabezado con ID del usuario y título del libro */}
            <div className="chat-header bg-secondary text-white p-2 rounded d-flex justify-content-between align-items-center">
              <span>ID Usuario: 12345</span>
              <strong>Usuario: Laura</strong>
              <span>Título del libro: "El principito"</span>
            </div>
            {/* Área del chat */}
            <div className="chat-body p-3 d-flex flex-column overflow-auto" style={{ height: 225 }}>
              {/* Mensaje del otro usuario (izquierda) */}
              <div className="d-flex justify-content-start mb-2">
                <div className="bg-light text-dark p-2 rounded-pill" style={{ maxWidth: '75%' }}>
                  ¡Hola! Estoy interesado en el libro.
                </div>
              </div>
              {/* Mensaje del usuario actual (derecha) */}
              <div className="d-flex justify-content-end mb-2">
                <div className="bg-primary text-white p-2 rounded-pill" style={{ maxWidth: '75%' }}>
                  ¡Genial! ¿Quieres más detalles?
                </div>
              </div>
              {/* Más mensajes de prueba */}
              <div className="d-flex justify-content-start mb-2">
                <div className="bg-light text-dark p-2 rounded-pill" style={{ maxWidth: '75%' }}>
                  ¿Está en buen estado?
                </div>
              </div>
              <div className="d-flex justify-content-end mb-2">
                <div className="bg-primary text-white p-2 rounded-pill" style={{ maxWidth: '75%' }}>
                  Sí, está casi nuevo.
                </div>
              </div>
            </div>
            {/* Input para escribir mensajes */}
            <div className="chat-footer p-2">
              <input type="text" className="form-control" placeholder="Escribe un mensaje..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
