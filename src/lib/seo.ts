import { site } from '../data/site';
import { copy, type Lang, localePath } from '../i18n';
import type { Artwork } from './artworks';

export type JsonLd = Record<string, unknown>;

export const artistJsonLd = (origin: URL, lang: Lang): JsonLd => ({
  '@type': 'Person',
  '@id': new URL('/#artista', origin).href,
  name: site.artistName,
  jobTitle: copy[lang].role,
  nationality: { '@type': 'Country', name: site.country },
  url: new URL(localePath(lang, '/'), origin).href,
  description: copy[lang].bio[0],
  email: site.email,
  sameAs: [site.instagram.url],
});

export const websiteJsonLd = (origin: URL, lang: Lang): JsonLd => ({
  '@type': 'WebSite',
  '@id': new URL('/#sitio', origin).href,
  name: site.artistName,
  url: new URL(localePath(lang, '/'), origin).href,
  inLanguage: lang,
  publisher: { '@id': new URL('/#artista', origin).href },
});

export const artworkJsonLd = (artwork: Artwork, origin: URL, imageUrl: string, lang: Lang): JsonLd => {
  const { title, year, technique, dimensions } = artwork.data;
  return {
    '@type': 'VisualArtwork',
    name: title,
    url: new URL(localePath(lang, `/obras/${artwork.id}/`), origin).href,
    image: imageUrl,
    artform: copy[lang].ui.artform,
    creator: { '@type': 'Person', '@id': new URL('/#artista', origin).href, name: site.artistName },
    ...(year && { dateCreated: String(year) }),
    ...(technique && { artMedium: technique }),
    ...(dimensions && {
      width: { '@type': 'Distance', name: `${dimensions.width} ${dimensions.unit}` },
      height: { '@type': 'Distance', name: `${dimensions.height} ${dimensions.unit}` },
    }),
  };
};

export const graph = (...nodes: JsonLd[]): JsonLd => ({ '@context': 'https://schema.org', '@graph': nodes });
