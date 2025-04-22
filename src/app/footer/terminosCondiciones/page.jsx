export default function TerminosCondiciones() {
  return (
    <main className="container my-5">
      <header className="mb-4 text-center">
        <h1 className="mb-3">Términos y Condiciones de IntercambiaLibros</h1>
        <p className="text-muted">Última actualización: Marzo 2025</p>
      </header>

      {/* 1. Introducción */}
      <section className="mb-4">
        <h2 className="h4">1. Introducción</h2>
        <p>
          Bienvenido a <strong>IntercambiaLibros</strong>, una plataforma que facilita el intercambio de libros entre
          usuarios. Estos términos regulan el acceso y uso del sitio web, así como las responsabilidades asociadas al
          intercambio y envío de los libros.
        </p>
      </section>

      {/* 2. Aceptación de los Términos */}
      <section className="mb-4">
        <h2 className="h4">2. Aceptación de los Términos</h2>
        <p>
          Al acceder y utilizar esta plataforma, aceptas cumplir con estos Términos y Condiciones en su totalidad. Si no
          estás de acuerdo con alguno de los puntos expuestos, debes abstenerte de utilizar el sitio.
        </p>
      </section>

      {/* 3. Registro de Usuario */}
      <section className="mb-4">
        <h2 className="h4">3. Registro de Usuario</h2>
        <p>
          Para participar en los intercambios es obligatorio registrarse proporcionando información veraz, actualizada y
          completa. Es responsabilidad del usuario proteger sus credenciales de acceso y no compartirlas con terceros.
        </p>
      </section>

      {/* 4. Responsabilidad del Intercambio y Envíos */}
      <section className="mb-4">
        <h2 className="h4">4. Responsabilidad del Intercambio y Envíos</h2>
        <ul>
          <li>
            Los intercambios de libros se realizan bajo la exclusiva responsabilidad de los usuarios involucrados.
          </li>
          <li>
            <strong>IntercambiaLibros</strong> actúa únicamente como un intermediario digital y no participa ni se
            responsabiliza por la calidad, estado, entrega o cualquier otra condición del libro intercambiado.
          </li>
          <li>
            Los usuarios acuerdan entre sí las condiciones de envío y asumen el coste asociado. No nos hacemos
            responsables de daños, pérdidas o retrasos en el transporte.
          </li>
          <li>
            Es responsabilidad del usuario asegurarse de que los libros intercambiados cumplan con las leyes aplicables,
            incluyendo la legalidad de los contenidos.
          </li>
        </ul>
      </section>

      {/* 5. Conducta del Usuario */}
      <section className="mb-4">
        <h2 className="h4">5. Conducta del Usuario</h2>
        <p>Al utilizar esta plataforma, te comprometes a:</p>
        <ul>
          <li>Publicar información veraz y no engañosa sobre los libros.</li>
          <li>No utilizar la plataforma para actividades ilegales o fraudulentas.</li>
          <li>Respetar las normas de convivencia y trato cordial con otros usuarios.</li>
          <li>Notificar cualquier comportamiento inapropiado o sospechoso.</li>
        </ul>
      </section>

      {/* 6. Limitación de Responsabilidad */}
      <section className="mb-4">
        <h2 className="h4">6. Limitación de Responsabilidad</h2>
        <p>
          <strong>IntercambiaLibros</strong> no se hace responsable de los siguientes casos:
        </p>
        <ul>
          <li>Pérdidas, daños o deterioros de los libros intercambiados.</li>
          <li>Problemas derivados de la gestión de los envíos (retrasos, pérdidas o costos adicionales).</li>
          <li>Controversias entre usuarios en relación con los intercambios.</li>
          <li>Acciones derivadas de un uso inadecuado o fraudulento de la plataforma.</li>
        </ul>
      </section>

      {/* 7. Privacidad y Protección de Datos */}
      <section className="mb-4">
        <h2 className="h4">7. Privacidad y Protección de Datos</h2>
        <p>
          Cumplimos con la <strong>Ley Orgánica 3/2018</strong> de Protección de Datos Personales (LOPDGDD) y el
          <strong> Reglamento (UE) 2016/679</strong> (GDPR). La información personal de los usuarios será tratada de
          acuerdo con nuestra <a href="/politica-privacidad">Política de Privacidad</a>.
        </p>
      </section>

      {/* 8. Modificaciones a los Términos */}
      <section className="mb-4">
        <h2 className="h4">8. Modificaciones a los Términos</h2>
        <p>
          Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios serán
          efectivos una vez publicados en esta página. Es responsabilidad del usuario revisar periódicamente las
          actualizaciones.
        </p>
      </section>

      {/* 9. Ley Aplicable y Jurisdicción */}
      <section className="mb-4">
        <h2 className="h4">9. Ley Aplicable y Jurisdicción</h2>
        <p>
          Estos Términos y Condiciones se rigen por la legislación española, en particular por la{' '}
          <strong>
            {' '}
            Ley 34/2002 de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE)
          </strong>
          . Cualquier controversia será resuelta por los tribunales competentes en España.
        </p>
      </section>

      {/* 10. Contacto */}
      <section>
        <h2 className="h4">10. Contacto</h2>
        <p>
          Si tienes alguna pregunta sobre estos Términos y Condiciones, puedes contactarnos en{' '}
          <a href="mailto:info@intercambialibros.com">info@intercambialibros.com</a>.
        </p>
      </section>
    </main>
  );
}
