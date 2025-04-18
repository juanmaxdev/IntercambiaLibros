import Image from 'next/image';

export default function PoliticaPrivacidad() {
  return (
    <>
      <main className="container my-5">
        <header className="mb-4 text-center">
          <h1 className="mb-3">Política de Privacidad</h1>
          <p className="text-muted">Última actualización: Marzo 2025</p>
        </header>
        <section className="mb-4">
          <h2 className="h4">1. Introducción</h2>
          <p>
            En <strong>IntercambiaLibros</strong> nos comprometemos a proteger y respetar su privacidad.
            Esta política de privacidad explica cómo recogemos, usamos y protegemos la información personal
            de nuestros usuarios, en cumplimiento del Reglamento General de Protección de Datos (RGPD) y la normativa española vigente.
          </p>
        </section>
        <section className="mb-4">
          <h2 className="h4">2. Información que Recopilamos</h2>
          <p>
            Recopilamos datos personales cuando los usuarios se registran en la plataforma, solicitan información o realizan transacciones de intercambio.
            Entre los datos se incluyen, entre otros, nombre, correo electrónico, teléfono y ubicación.
          </p>
        </section>
        <section className="mb-4">
          <h2 className="h4">3. Uso de la Información</h2>
          <p>Utilizamos la información para:</p>
          <ul>
            <li>Gestionar las cuentas de usuario.</li>
            <li>Facilitar los intercambios de libros.</li>
            <li>Mejorar nuestros servicios y la experiencia del usuario.</li>
            <li>Enviar información relevante y actualizaciones.</li>
          </ul>
        </section>
        <section className="mb-4">
          <h2 className="h4">4. Protección de Datos</h2>
          <p>
            Hemos implementado medidas de seguridad técnicas y organizativas para proteger sus datos contra acceso no autorizado, pérdida o destrucción,
            en conformidad con el RGPD y la legislación española.
          </p>
        </section>
        <section className="mb-4">
          <h2 className="h4">5. Derechos de los Usuarios</h2>
          <p>
            Usted tiene derecho a acceder, rectificar y eliminar sus datos personales, así como a oponerse o limitar su tratamiento.
            Para ejercer estos derechos, contacte a nuestro delegado de protección de datos en{' '}
            <a href="mailto:privacidad@intercambialibros.com">privacidad@intercambialibros.com</a>.
          </p>
        </section>
        <section className="mb-4">
          <h2 className="h4">6. Cookies</h2>
          <p>
            Nuestra web utiliza cookies para mejorar la experiencia del usuario. Puede configurar su navegador para rechazarlas,
            aunque esto pueda afectar algunas funcionalidades.
          </p>
        </section>
        <section className="mb-4">
          <h2 className="h4">7. Cambios en la Política</h2>
          <p>
            Nos reservamos el derecho a actualizar esta política según cambios legislativos o mejoras en nuestros servicios.
            Las actualizaciones se publicarán en esta página.
          </p>
        </section>
        <section>
          <h2 className="h4">8. Contacto</h2>
          <p>
            Si tiene alguna pregunta sobre nuestra política de privacidad, contáctenos en{' '}
            <a href="mailto:info@intercambialibros.com">info@intercambialibros.com</a>.
          </p>
        </section>
      </main>
    </>
  );
}