// pages/politica-cookies.jsx

export default function PoliticaCookies() {
    return (
      <main className="container my-5">
        <header className="text-center mb-4">
          <h1 className="mb-3">Política de Cookies</h1>
          <p className="text-muted">Última actualización: Marzo 2025</p>
        </header>
  
        {/* 1. ¿Qué son las cookies? */}
        <section className="mb-4">
          <h2 className="h4">1. ¿Qué son las cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo (ordenador, móvil o
            tablet) cuando los visitas. Estos archivos permiten recordar información sobre tu navegación para mejorar tu
            experiencia, analizar el uso del sitio o habilitar funcionalidades específicas.
          </p>
        </section>
  
        {/* 2. Tipos de cookies que utilizamos */}
        <section className="mb-4">
          <h2 className="h4">2. Tipos de cookies que utilizamos</h2>
          <p>
            En <strong>IntercambiaLibros</strong> utilizamos diferentes tipos de cookies para garantizar el correcto
            funcionamiento de la plataforma y ofrecerte una experiencia optimizada. A continuación, te explicamos cada
            tipo:
          </p>
  
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light text-center">
                <tr>
                  <th>Tipo de Cookie</th>
                  <th>Finalidad</th>
                  <th>Duración</th>
                  <th>Ejemplo de Uso</th>
                </tr>
              </thead>
              <tbody>
                {/* Cookies técnicas */}
                <tr>
                  <td><strong>Cookies Técnicas</strong></td>
                  <td>Esenciales para el funcionamiento de la plataforma (autenticación, seguridad, gestión de sesiones).</td>
                  <td>Sesión o persistentes (hasta 1 año).</td>
                  <td>Mantener tu sesión activa tras iniciar sesión.</td>
                </tr>
  
                {/* Cookies de personalización */}
                <tr>
                  <td><strong>Cookies de Personalización</strong></td>
                  <td>Permiten recordar tus preferencias (idioma, configuración de interfaz).</td>
                  <td>Persistentes (hasta 6 meses).</td>
                  <td>Recordar tu idioma preferido (español o inglés).</td>
                </tr>
  
                {/* Cookies analíticas */}
                <tr>
                  <td><strong>Cookies Analíticas</strong></td>
                  <td>Recogen información anónima sobre el uso de la plataforma para mejorar el servicio.</td>
                  <td>Persistentes (hasta 2 años).</td>
                  <td>Analizar las páginas más visitadas mediante Google Analytics.</td>
                </tr>
  
                {/* Cookies de terceros */}
                <tr>
                  <td><strong>Cookies de Terceros</strong></td>
                  <td>Proporcionadas por servicios externos como Google, para estadísticas o autenticación.</td>
                  <td>Persistentes (hasta 2 años).</td>
                  <td>Autenticación con Google o redes sociales.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
  
        {/* 3. Cookies específicas que usamos */}
        <section className="mb-4">
          <h2 className="h4">3. Cookies específicas utilizadas en IntercambiaLibros</h2>
          <p>A continuación se detallan las cookies concretas que utilizamos en nuestra plataforma:</p>
  
          <ul className="list-group">
            <li className="list-group-item">
              <strong>session_id:</strong> Cookie técnica para mantener tu sesión activa. Duración: 24 horas.
            </li>
            <li className="list-group-item">
              <strong>user_preferences:</strong> Cookie de personalización para guardar tus preferencias de idioma. Duración: 6 meses.
            </li>
            <li className="list-group-item">
              <strong>_ga:</strong> Cookie analítica de Google Analytics para recopilar estadísticas de uso. Duración: 2 años.
            </li>
            <li className="list-group-item">
              <strong>g_auth:</strong> Cookie de autenticación de Google para iniciar sesión con tu cuenta. Duración: 1 año.
            </li>
          </ul>
        </section>
  
        {/* 4. Gestión de Cookies */}
        <section className="mb-4">
          <h2 className="h4">4. ¿Cómo gestionar y desactivar las cookies?</h2>
          <p>
            Puedes aceptar, rechazar o configurar el uso de cookies en cualquier momento a través de nuestro{' '}
            <strong>panel de configuración de cookies</strong>. Además, puedes ajustar las preferencias directamente desde
            tu navegador:
          </p>
  
          <ul>
            <li>
              <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
                Google Chrome
              </a>
            </li>
            <li>
              <a href="https://support.mozilla.org/es/kb/Eliminar%20cookies" target="_blank" rel="noopener noreferrer">
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
                Apple Safari
              </a>
            </li>
            <li>
              <a href="https://support.microsoft.com/es-es/help/17442" target="_blank" rel="noopener noreferrer">
                Microsoft Edge
              </a>
            </li>
          </ul>
        </section>
  
        {/* 5. Legislación Aplicable */}
        <section className="mb-4">
          <h2 className="h4">5. Legislación Aplicable</h2>
          <p>
            Esta Política de Cookies se rige por la legislación española, en cumplimiento del{' '}
            <strong>Reglamento (UE) 2016/679 (GDPR)</strong> y la <strong>Ley 34/2002 (LSSI-CE)</strong>. Tienes derecho a
            acceder, rectificar o eliminar tus datos personales, así como a retirar el consentimiento en cualquier
            momento.
          </p>
        </section>
  
        {/* 6. Contacto */}
        <section>
          <h2 className="h4">6. Contacto</h2>
          <p>
            Si tienes alguna consulta sobre nuestra política de cookies, puedes escribirnos a{' '}
            <a href="mailto:info@intercambialibros.com">info@intercambialibros.com</a>.
          </p>
        </section>
      </main>
    );
  }
  