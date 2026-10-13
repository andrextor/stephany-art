import type { artworkCategories, artworkStatuses } from './content.config';
import { site } from './data/site';

export type Lang = 'es' | 'en';
type ArtworkCategory = (typeof artworkCategories)[number];
type ArtworkStatus = (typeof artworkStatuses)[number];

// Spanish lives at the root and English under /en, with the same page paths: each page in
// src/pages/en renders its Spanish twin, which reads the language from the URL.
export const langFromUrl = (url: URL): Lang => (/^\/en(\/|$)/.test(url.pathname) ? 'en' : 'es');

export const localePath = (lang: Lang, path: string): string => (lang === 'es' ? path : `/en${path}`);

export const otherLangPath = (url: URL): string =>
  langFromUrl(url) === 'en' ? url.pathname.replace(/^\/en/, '') || '/' : `/en${url.pathname}`;

const es = {
  htmlLang: 'es',
  ogLocale: 'es_CO',
  // Source of truth for bio and exhibitions: "Biografía Artística - Stephany Londoño.pdf".
  role: 'Artista colombiana',
  quote:
    'Más que una técnica, mi trabajo es una invitación a la pausa y a la contemplación; un territorio suspendido donde el arte, la naturaleza y el latido humano convergen.',
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
  // `artwork` is the artwork's slug; the page shows its title in the current language.
  exhibitions: [
    { year: 2024, artwork: 'la-noche-oscura-del-alma', event: 'Bienal de Armenia' },
    {
      year: 2025,
      artwork: 'la-noche-oscura-del-alma',
      event: 'Portada de revista presentada en la Feria Internacional del Libro de Bogotá (FILBo)',
    },
    { year: 2026, artwork: 'transito-del-alma', event: 'Bienal de Armenia' },
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
  messages: {
    commission: 'Hola Stephany, me gustaría encargarte una obra.',
    artwork: (title: string): string => `Hola Stephany, me interesa la obra "${title}". ¿Me cuentas más?`,
    reserved: (title: string): string => `Hola Stephany, ¿me avisas si "${title}" vuelve a estar disponible?`,
    sold: (title: string): string => `Hola Stephany, me encantó "${title}". ¿Podrías pintarme algo en esa línea?`,
  },
  categoryLabels: { commission: 'Obras por comisión', personal: 'Obras personales' } as Record<ArtworkCategory, string>,
  categoryNames: { commission: 'Por encargo', personal: 'Obra personal' } as Record<ArtworkCategory, string>,
  statusLabels: {
    available: 'Disponible',
    reserved: 'Reservada',
    sold: 'Vendida',
    delivered: 'Encargo entregado',
    'in-progress': 'En proceso',
    'private-collection': 'Colección personal',
  } as Record<ArtworkStatus, string>,
  techniques: {} as Record<string, string>,
  ui: {
    switchLabel: 'English',
    skip: 'Saltar al contenido',
    mainNav: 'Principal',
    tour: 'Recorrido',
    works: 'Obras',
    about: 'Sobre mí',
    contact: 'Contacto',
    commission: 'Encargar una obra',
    ctaAvailable: 'Preguntar por esta obra',
    ctaReserved: 'Avisarme si se libera',
    ctaSold: 'Encargar algo parecido',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    social: 'Redes y contacto',
    instagramLabel: `Instagram de ${site.artistName} (${site.instagram.handle})`,
    whatsappLabel: `Escribir por WhatsApp a ${site.artistName}`,
    defaultDescription: `${site.artistName}, artista colombiana. Obras personales y retratos por encargo pintados al óleo y acrílico.`,
    ogImageAlt: `El taller de ${site.artistName}`,
    viewWorks: 'Ver las obras',
    viewAllWorks: (count: number): string => `Ver las ${count} obras`,
    readBio: 'Leer la biografía',
    moreWorks: 'Más obras',
    commissionTitle: 'Cómo funciona un encargo',
    commissionText: 'Una obra hecha a mano a partir de tu historia, en tres pasos.',
    faqTitle: 'Preguntas frecuentes',
    footerTitle: '¿Tienes una idea para una obra?',
    footerText: 'Escríbeme por WhatsApp con tu idea o tu foto y te cuento cómo podemos convertirla en una pintura.',
    footerCta: 'Escribir por WhatsApp',
    rights: 'Todas las obras son originales.',
    credit: 'Sitio creado por',
    portraitAlt: 'Retrato de Stephany Londoño con el catálogo de la 5.ª Bienal Internacional de Arte de Armenia',
    portraitCaption: 'En la 5.ª Bienal Internacional de Arte de Armenia, 2024',
    aboutDescription: `Biografía de ${site.artistName}, artista colombiana y autodidacta: su técnica de veladuras y texturas, su taller y sus exposiciones en la Bienal de Armenia.`,
    exhibitionsTitle: 'Exposiciones y publicaciones',
    worksDescription:
      'Catálogo de obras de Stephany Londoño: obras personales, encargos entregados y obras en proceso.',
    worksIntro:
      'Exploraciones personales y obras por encargo, universos donde la introspección y la naturaleza cobran vida a través del óleo, el acrílico y la delicadeza de las texturas.',
    worksIntroInProgress:
      'Una sutil danza entre la luz, la sombra y la materia. Así avanza el proceso creativo en el caballete.',
    worksCollection: `Obras de ${site.artistName}`,
    filterAll: 'Todas',
    filterLabel: 'Filtrar obras',
    filterEmpty: 'No hay obras con este filtro por ahora.',
    allWorks: 'Ver todas las obras',
    backToWorks: 'Todas las obras',
    artworkDescription: (title: string, category: string): string =>
      `${title}, obra de ${site.artistName}, artista colombiana. ${category}.`,
    category: 'Categoría',
    status: 'Estado',
    year: 'Año',
    technique: 'Técnica',
    dimensions: 'Medidas',
    certificate: 'Incluye certificado de autenticidad',
    detailsTitle: 'Detalles y proceso',
    moreOf: (category: string): string => `Más ${category.toLowerCase()}`,
    viewAll: 'Ver todas',
    artform: 'Pintura',
    notFoundTitle: 'Página no encontrada',
    notFoundHeading: 'Esta pared está vacía',
    notFoundText: 'La página que buscas no existe o la obra ya no está publicada.',
  },
  world: {
    label: 'Recorrido por el taller',
    hint: 'Desliza para entrar',
    personalTags: ['La noche oscura del alma', 'Tránsito de luz eterna'],
    viewCommissions: 'Ver encargos',
    viewPersonal: 'Ver obras personales',
    viewInProgress: 'Ver obras en proceso',
    stops: [
      {
        label: 'Inicio',
        body: 'Un viaje visual hacia los rincones del alma. Pinturas al óleo y acrílico donde la memoria cobra latido y el tiempo se detiene en el lienzo.',
      },
      {
        label: 'El taller',
        eyebrow: 'El taller',
        title: 'Donde nace cada obra',
        body: 'Donde el tiempo se desacelera entre pigmentos y bastidores. El taller es un refugio íntimo para dar forma a lo invisible.',
      },
      {
        label: 'Por comisión',
        eyebrow: 'Obras por comisión',
        title: 'Tu historia, pintada a mano',
        body: 'Retratos, paisajes, animales y abstractos por encargo, con la misma atención al detalle que mi obra personal.',
      },
      {
        label: 'Personales',
        eyebrow: 'Obras personales',
        title: 'Entre la luz y la sombra',
        body: 'Obras sobre la memoria y la transformación humana, expuestas en la Bienal de Armenia en 2024 y 2026.',
      },
      {
        label: 'En proceso',
        eyebrow: 'En proceso',
        title: 'Capa a capa, en el caballete',
        body: 'Veladuras pacientes y texturas orgánicas: así avanza el retrato que estoy pintando ahora.',
      },
    ],
  },
};

type Copy = typeof es;

const en: Copy = {
  htmlLang: 'en',
  ogLocale: 'en_US',
  role: 'Colombian artist',
  quote:
    'More than a technique, my work is an invitation to pause and contemplate; a suspended territory where art, nature and the human heartbeat converge.',
  intro:
    'Colombian, self-taught artist. She paints between light and shadow, with patient glazes and organic textures, from her new studio.',
  highlights: [
    { title: 'Armenia Biennial', detail: '2024 · 2026' },
    { title: 'Magazine cover', detail: 'FILBo 2025' },
    { title: 'Oil and acrylic', detail: 'Glazes and textures' },
  ],
  bio: [
    'Colombian artist. In the pictorial universe of Stephany Londoño, the canvas opens like a threshold where memories breathe and memory finds a tangible refuge. Her work is born from a deep philosophical restlessness and an introspective need, tracing an intimate map where human transformation constantly moves between light and shadow.',
    'Her path in the arts has been self-taught, built on intuition, an unwavering love for technique and a constant joy in learning. Through the rigorous study of the work of other great painters and her own experimentation, she has developed a creative language entirely her own, defined by the patient use of glazes and meticulous attention to detail and organic textures. In her hands, oil and acrylic stop being mere materials and become vehicles of sincerity, where fragility and strength coexist in delicate balance.',
    'Today, from her new studio, she is bringing to life a new creative stage: a visual universe deeply connected with nature, introspection and those beings who embody both inner beauty and the darkness of the soul.',
    'Through constant and honest growth, her work has earned the trust of collectors who now bring her pieces into their private spaces.',
  ],
  exhibitions: [
    { year: 2024, artwork: 'la-noche-oscura-del-alma', event: 'Armenia Biennial' },
    {
      year: 2025,
      artwork: 'la-noche-oscura-del-alma',
      event: 'Magazine cover presented at the Bogotá International Book Fair (FILBo)',
    },
    { year: 2026, artwork: 'transito-del-alma', event: 'Armenia Biennial' },
  ],
  commissionSteps: [
    {
      title: 'Write to me',
      text: 'Tell me about your project on WhatsApp, send me your visual references and let’s talk about what you would like to see on the canvas.',
    },
    {
      title: 'Concept and design',
      text: 'Together we define the size, the color palette, the timeline and every technical detail so the piece brings your vision to life.',
    },
    {
      title: 'Creation',
      text: 'I bring the piece to life in my studio, giving it the time it needs and working in oil and acrylic with rigorous care in every detail.',
    },
  ],
  faq: [],
  messages: {
    commission: 'Hi Stephany, I would like to commission a painting.',
    artwork: (title) => `Hi Stephany, I’m interested in "${title}". Could you tell me more?`,
    reserved: (title) => `Hi Stephany, could you let me know if "${title}" becomes available again?`,
    sold: (title) => `Hi Stephany, I loved "${title}". Could you paint something along those lines for me?`,
  },
  categoryLabels: { commission: 'Commissioned works', personal: 'Personal works' },
  categoryNames: { commission: 'Commission', personal: 'Personal work' },
  statusLabels: {
    available: 'Available',
    reserved: 'Reserved',
    sold: 'Sold',
    delivered: 'Commission delivered',
    'in-progress': 'In progress',
    'private-collection': 'Private collection',
  },
  techniques: { 'Óleo sobre lienzo': 'Oil on canvas', 'Acrílico sobre lienzo': 'Acrylic on canvas' },
  ui: {
    switchLabel: 'Español',
    skip: 'Skip to content',
    mainNav: 'Main',
    tour: 'Tour',
    works: 'Works',
    about: 'About',
    contact: 'Contact',
    commission: 'Commission a painting',
    ctaAvailable: 'Ask about this work',
    ctaReserved: 'Let me know if it’s released',
    ctaSold: 'Commission something similar',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    social: 'Social and contact',
    instagramLabel: `${site.artistName} on Instagram (${site.instagram.handle})`,
    whatsappLabel: `Message ${site.artistName} on WhatsApp`,
    defaultDescription: `${site.artistName}, Colombian artist. Personal works and commissioned portraits painted in oil and acrylic.`,
    ogImageAlt: `${site.artistName}’s studio`,
    viewWorks: 'View the works',
    viewAllWorks: (count) => `View all ${count} works`,
    readBio: 'Read the biography',
    moreWorks: 'More works',
    commissionTitle: 'How a commission works',
    commissionText: 'A handmade painting based on your story, in three steps.',
    faqTitle: 'Frequently asked questions',
    footerTitle: 'Have an idea for a painting?',
    footerText:
      'Message me on WhatsApp with your idea or your photo and I’ll tell you how we can turn it into a painting.',
    footerCta: 'Message on WhatsApp',
    rights: 'All works are originals.',
    credit: 'Site by',
    portraitAlt: 'Portrait of Stephany Londoño holding the catalog of the 5th Armenia International Art Biennial',
    portraitCaption: 'At the 5th Armenia International Art Biennial, 2024',
    aboutDescription: `Biography of ${site.artistName}, a self-taught Colombian artist: her glazing and texture technique, her studio and her exhibitions at the Armenia Biennial.`,
    exhibitionsTitle: 'Exhibitions and publications',
    worksDescription:
      'Catalog of works by Stephany Londoño: personal works, delivered commissions and works in progress.',
    worksIntro:
      'Personal explorations and commissioned works, universes where introspection and nature come alive through oil, acrylic and delicate textures.',
    worksIntroInProgress:
      'A subtle dance between light, shadow and matter. This is how the creative process unfolds on the easel.',
    worksCollection: `Works by ${site.artistName}`,
    filterAll: 'All',
    filterLabel: 'Filter works',
    filterEmpty: 'There are no works with this filter yet.',
    allWorks: 'View all works',
    backToWorks: 'All works',
    artworkDescription: (title, category) =>
      `${title}, a painting by ${site.artistName}, Colombian artist. ${category}.`,
    category: 'Category',
    status: 'Status',
    year: 'Year',
    technique: 'Technique',
    dimensions: 'Size',
    certificate: 'Includes a certificate of authenticity',
    detailsTitle: 'Details and process',
    moreOf: (category) => `More ${category.toLowerCase()}`,
    viewAll: 'View all',
    artform: 'Painting',
    notFoundTitle: 'Page not found',
    notFoundHeading: 'This wall is empty',
    notFoundText: 'The page you are looking for doesn’t exist, or the work is no longer published.',
  },
  world: {
    label: 'A tour of the studio',
    hint: 'Scroll to enter',
    personalTags: ['The Dark Night of the Soul', 'Passage of Eternal Light'],
    viewCommissions: 'View commissions',
    viewPersonal: 'View personal works',
    viewInProgress: 'View works in progress',
    stops: [
      {
        label: 'Home',
        body: 'A visual journey into the corners of the soul. Oil and acrylic paintings where memory finds a heartbeat and time stands still on the canvas.',
      },
      {
        label: 'The studio',
        eyebrow: 'The studio',
        title: 'Where every work is born',
        body: 'Where time slows down among pigments and stretchers. The studio is an intimate refuge for giving shape to the invisible.',
      },
      {
        label: 'Commissions',
        eyebrow: 'Commissioned works',
        title: 'Your story, painted by hand',
        body: 'Commissioned portraits, landscapes, animals and abstracts, with the same attention to detail as my personal work.',
      },
      {
        label: 'Personal',
        eyebrow: 'Personal works',
        title: 'Between light and shadow',
        body: 'Works about memory and human transformation, exhibited at the Armenia Biennial in 2024 and 2026.',
      },
      {
        label: 'In progress',
        eyebrow: 'In progress',
        title: 'Layer by layer, on the easel',
        body: 'Patient glazes and organic textures: this is how the portrait I’m painting right now is coming along.',
      },
    ],
  },
};

export const copy: Record<Lang, Copy> = { es, en };
