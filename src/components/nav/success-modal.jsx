export function SuccessModal() {
  return (
    <div className="modal fade" id="modalExito" tabIndex={-1} aria-labelledby="modalExitoLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered d-flex justify-content-center text-center">
        <div className="modal-content text-center">
          <div className="modal-header bg-success text-white d-flex justify-content-center">
            <h5 className="modal-title text-center" id="modalExitoLabel">
              ¡Inicio de sesión exitoso!
            </h5>
          </div>
          <div className="modal-body text-center">
            <div className="mb-3">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "3rem" }}></i>
            </div>
            <p className="mb-0">Has iniciado sesión correctamente.</p>
            <p className="text-muted">Redirigiendo...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
