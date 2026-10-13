// Language-independent details. The texts (bio, quote, steps...) live per language in src/i18n.ts.
export const site = {
  artistName: 'Stephany Londoño',
  country: 'Colombia',
  whatsapp: {
    display: '+57 313 793 7797',
    number: '573137937797',
  },
  instagram: {
    handle: '@stephanylondonoart',
    url: 'https://www.instagram.com/stephanylondonoart/',
  },
  email: 'stephanylondof@gmail.com',
  // PENDIENTE: ciudad
} as const;

export const whatsappUrl = (message: string): string =>
  `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
