import { site } from '../data/site';
import type { Artwork } from './artworks';

export type JsonLd = Record<string, unknown>;

export const artistJsonLd = (origin: URL): JsonLd => ({
  '@type': 'Person',
  '@id': new URL('/#artista', origin).href,
  name: site.artistName,
  jobTitle: site.role,
  nationality: { '@type': 'Country', name: site.country },
  url: new URL('/', origin).href,
  description: site.bio[0],
  sameAs: [site.instagram.url],
});

export const websiteJsonLd = (origin: URL): JsonLd => ({
  '@type': 'WebSite',
  '@id': new URL('/#sitio', origin).href,
  name: site.artistName,
  url: new URL('/', origin).href,
  inLanguage: 'es',
  publisher: { '@id': new URL('/#artista', origin).href },
});

export const artworkJsonLd = (artwork: Artwork, origin: URL, imageUrl: string): JsonLd => {
  const { title, year, technique, dimensions } = artwork.data;
  return {
    '@type': 'VisualArtwork',
    name: title,
    url: new URL(`/obras/${artwork.id}/`, origin).href,
    image: imageUrl,
    artform: 'Pintura',
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
