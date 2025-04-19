import Link from 'next/link';

export default function FAQs() {
  const faqs = [
    {
      pregunta: '¿Cómo funciona el intercambio de libros?',
      respuesta:
        'Los usuarios publican los libros que desean intercambiar. Puedes contactar con otro usuario para coordinar el intercambio de manera mutua y gestionar los envíos de forma independiente.',
    },
    {
      pregunta: '¿Es gratis utilizar la plataforma?',
      respuesta:
        'Sí, el uso de la plataforma para publicar y buscar libros es completamente gratuito. Solo debes hacerte cargo de los gastos de envío si corresponde.',
    },
    {
      pregunta: '¿Quién se encarga de los gastos de envío?',
      respuesta:
        'Los gastos de envío son responsabilidad de los usuarios que realizan el intercambio. Pueden acordar quién asume el costo o dividirlo.',
    },
    {
      pregunta: '¿Puedo intercambiar más de un libro a la vez?',
      respuesta: 'Sí, puedes acordar con otro usuario el intercambio de varios libros en una misma transacción.',
    },
    {
      pregunta: '¿Qué pasa si no recibo el libro?',
      respuesta:
        'La plataforma no se responsabiliza por la entrega de los libros. Te recomendamos utilizar servicios de envío con seguimiento y confirmar los detalles del intercambio con el otro usuario.',
    },
    {
      pregunta: '¿Cómo puedo contactar con otro usuario?',
      respuesta:
        'Puedes contactar a otros usuarios a través del sistema de chat integrado en la plataforma una vez hayas encontrado un libro de tu interés.',
    },
    {
      pregunta: '¿Puedo eliminar o editar una publicación?',
      respuesta:
        'Sí, puedes gestionar tus publicaciones desde tu perfil de usuario, donde puedes editarlas o eliminarlas en cualquier momento.',
    },
    {
      pregunta: '¿Hay alguna restricción sobre los libros que puedo intercambiar?',
      respuesta:
        'Puedes intercambiar cualquier libro siempre que cumpla con las políticas de la plataforma y las leyes aplicables. No se permiten materiales ilegales o ofensivos.',
    },
    {
      pregunta: '¿Cómo garantizan la seguridad de los intercambios?',
      respuesta:
        'La plataforma facilita el contacto entre usuarios, pero no garantiza ni media en los intercambios. Recomendamos seguir las mejores prácticas de seguridad y utilizar servicios de envío fiables.',
    },
    {
      pregunta: '¿Qué debo hacer si tengo un problema con un intercambio?',
      respuesta:
        'Si tienes un problema, intenta resolverlo directamente con el otro usuario. Si no lo logras, puedes reportar la incidencia a nuestro equipo de soporte.',
    },
  ];
  return (
    <main className="container my-5">
      <h2 className="text-center mb-4">Preguntas Frecuentes (FAQs)</h2>
      <div className="accordion" id="faqAccordion">
        {faqs.map((faq, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header" id={`heading${index}`}>
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${index}`}
                aria-expanded="false"
                aria-controls={`collapse${index}`}
              >
                {faq.pregunta}
              </button>
            </h2>
            <div
              id={`collapse${index}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading${index}`}
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">{faq.respuesta}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
