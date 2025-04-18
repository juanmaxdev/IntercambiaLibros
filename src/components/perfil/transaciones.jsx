'use client';
import SideBar from '@components/perfil/sideBar';

export default function Transacciones() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 ps-0">
          {/* SIDE NAV */}
          <SideBar />
        </div>
        <div className="col-8">
          <h2 className="mb-4">Transacciones</h2>
          {/* Transaccion 1*/}
          <div className="transaction-container card shadow p-3 my-4">
            {/* Encabezado con ID, título del libro y fecha */}
            <div className="transaction-header bg-secondary text-white p-2 rounded-top d-flex justify-content-between align-items-center">
              <span>ID: 98765</span>
              <strong>El principito</strong>
              <span>18/02/2025</span>
            </div>
            {/* Cuerpo de la transacción */}
            <div className="transaction-body p-3 d-flex justify-content-between align-items-center">
              {/* Usuario de origen */}
              <div className="text-center">
                <strong>Laura</strong>
                <div className="text-muted">Madrid</div>
              </div>
              {/* Estado de la transacción con icono */}
              <div className="text-center">
                <span className="fw-bold text-success">Transacción: Completada</span>
                <br />
                <i className="bi bi-arrow-right-circle fs-4 text-success" />
              </div>
              {/* Usuario de destino */}
              <div className="text-center">
                <strong>Carlos</strong>
                <div className="text-muted">Barcelona</div>
              </div>
            </div>
          </div>
          {/* Transaccion 2*/}
          <div className="transaction-container card shadow p-3 my-4">
            {/* Encabezado con ID, título del libro y fecha */}
            <div className="transaction-header bg-secondary text-white p-2 rounded-top d-flex justify-content-between align-items-center">
              <span>ID: 98765</span>
              <strong>El principito</strong>
              <span>18/02/2025</span>
            </div>
            {/* Cuerpo de la transacción */}
            <div className="transaction-body p-3 d-flex justify-content-between align-items-center">
              {/* Usuario de origen */}
              <div className="text-center">
                <strong>Laura</strong>
                <div className="text-muted">Madrid</div>
              </div>
              {/* Estado de la transacción con icono */}
              <div className="text-center">
                <span className="fw-bold text-warning">Transacción: Pendiente</span>
                <br />
                <i className="bi bi-arrow-right-circle fs-4 text-success" />
              </div>
              {/* Usuario de destino */}
              <div className="text-center">
                <strong>Carlos</strong>
                <div className="text-muted">Barcelona</div>
              </div>
            </div>
          </div>
          {/* Transaccion Nº3*/}
          <div className="transaction-container card shadow p-3 my-4">
            {/* Encabezado con ID, título del libro y fecha */}
            <div className="transaction-header bg-secondary text-white p-2 rounded-top d-flex justify-content-between align-items-center">
              <span>ID: 98765</span>
              <strong>El principito</strong>
              <span>18/02/2025</span>
            </div>
            {/* Cuerpo de la transacción */}
            <div className="transaction-body p-3 d-flex justify-content-between align-items-center">
              {/* Usuario de origen */}
              <div className="text-center">
                <strong>Laura</strong>
                <div className="text-muted">Madrid</div>
              </div>
              {/* Estado de la transacción con icono */}
              <div className="text-center">
                <span className="fw-bold text-success">Transacción: Completada</span>
                <br />
                <i className="bi bi-arrow-right-circle fs-4 text-success" />
              </div>
              {/* Usuario de destino */}
              <div className="text-center">
                <strong>Carlos</strong>
                <div className="text-muted">Barcelona</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
