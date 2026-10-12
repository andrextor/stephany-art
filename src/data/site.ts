// Source of truth for bio and exhibitions: "Biografía Artística - Stephany Londoño.pdf".
export const site = {
  artistName: 'Stephany Londoño',
  role: 'Artista plástica y pintora',
  country: 'Colombia',
  whatsapp: {
    display: '+57 313 793 7797',
    number: '573137937797',
    commissionMessage: 'Hola Stephany, me gustaría encargarte una obra.',
    artworkMessage: (title: string): string => `Hola Stephany, me interesa la obra "${title}". ¿Me cuentas más?`,
  },
  quote:
    'Más que una técnica, mi trabajo es una invitación a la pausa y a la contemplación; un territorio suspendido donde el arte, la naturaleza y el latido humano convergen.',
  // Short version of the official bio for the home page; the full text stays in `bio`.
  intro:
    'Artista colombiana y autodidacta. Pinta entre la luz y la sombra, con veladuras pacientes y texturas orgánicas, desde su nuevo estudio.',
  highlights: [
    { title: 'Bienal de Armenia', detail: '2024 · 2026' },
    { title: 'Portada de revista', detail: 'FILBo 2025' },
    { title: 'Óleo y acrílico', detail: 'Veladuras y texturas' },
  ],
  bio: [
    'Artista colombiana. En el universo pictórico de Stephany Londoño, el lienzo se abre como un umbral donde respiran los recuerdos y la memoria halla un refugio tangible. Su obra nace de una profunda inquietud filosófica y una necesidad introspectiva, trazando un mapa íntimo donde la transformación humana transita constantemente entre luz y sombra.',
    'Su camino en las artes se ha construido de forma autodidacta, desde la intuición, un inquebrantable amor por la técnica y un gusto constante por el aprendizaje. A través del estudio riguroso de la obra de otros grandes pintores y de la experimentación personal, ha consolidado un lenguaje creativo muy propio, dominado por el uso paciente de las veladuras y una meticulosa atención a los detalles y a las texturas orgánicas. En sus manos, el óleo y el acrílico dejan de ser simples materiales para convertirse en vehículos de sinceridad, donde la fragilidad y la fuerza conviven en un delicado equilibrio.',
    'Hoy, desde su nuevo estudio, da vida a una nueva etapa creativa: un universo visual profundamente conectado con la naturaleza, la introspección y aquellos seres que encarnan tanto la belleza interior como las oscuridades del alma.',
    'Gracias a una evolución constante y honesta, su obra ha ganado la confianza de coleccionistas que hoy integran sus piezas en espacios privados.',
  ],
  exhibitions: [
    { year: 2024, artwork: 'La noche oscura del alma', event: 'Bienal de Armenia' },
    {
      year: 2025,
      artwork: 'La noche oscura del alma',
      event: 'Portada de revista presentada en la Feria Internacional del Libro de Bogotá (FILBo)',
    },
    { year: 2026, artwork: 'Tránsito del alma', event: 'Bienal de Armenia' },
  ],
  // PENDIENTE: validar los pasos con Stephany (plazos, anticipo, envío)
  commissionSteps: [
    {
      title: 'Escríbeme',
      text: 'Cuéntame tu proyecto por WhatsApp, envíame las referencias visuales y hablemos sobre lo que te gustaría plasmar en el lienzo.',
    },
    {
      title: 'Conceptualización y diseño',
      text: 'Definimos juntos las dimensiones, la paleta cromática, los plazos y cada detalle técnico para asegurar que la pieza materialice tu visión.',
    },
    {
      title: 'Creación',
      text: 'Doy vida a la pieza en mi taller, dedicándole el tiempo necesario y aplicando técnicas de óleo y acrílico con un riguroso cuidado en cada detalle.',
    },
  ],
  // The FAQ section stays hidden until it has answers. PENDIENTE (preguntas para Stephany):
  // plazos de entrega, tamaños, envíos a otras ciudades o países, formas de pago,
  // retoques, si pinta a partir de una foto, certificado de autenticidad.
  faq: [] as ReadonlyArray<{ question: string; answer: string }>,
  instagram: {
    handle: '@stephanylondonoart',
    url: 'https://www.instagram.com/stephanylondonoart/',
  },
  email: 'stephanylondof@gmail.com',
  // PENDIENTE: ciudad
} as const;

export const whatsappUrl = (message: string): string =>
  `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
