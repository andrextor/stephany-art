import { type CollectionEntry, getCollection } from 'astro:content';
import type { artworkCategories, artworkStatuses } from '../content.config';
import { site, whatsappUrl } from '../data/site';

export type Artwork = CollectionEntry<'artworks'>;
export type ArtworkCategory = (typeof artworkCategories)[number];
export type ArtworkStatus = (typeof artworkStatuses)[number];

export const categoryLabels: Record<ArtworkCategory, string> = {
  commission: 'Obras por comisión',
  personal: 'Obras personales',
};

export const statusLabels: Record<ArtworkStatus, string> = {
  available: 'Disponible',
  reserved: 'Reservada',
  sold: 'Vendida',
  delivered: 'Encargo entregado',
  'in-progress': 'En proceso',
  'private-collection': 'Colección personal',
};

export const categoryNames: Record<ArtworkCategory, string> = {
  commission: 'Por encargo',
  personal: 'Obra personal',
};

const categoryOrder: Record<ArtworkCategory, number> = { personal: 0, commission: 1 };

export const getPublishedArtworks = async (): Promise<Artwork[]> => {
  const artworks = await getCollection('artworks', ({ data }) => !data.draft);
  return artworks.sort(
    (a, b) => categoryOrder[a.data.category] - categoryOrder[b.data.category] || a.data.order - b.data.order,
  );
};

export const mainImage = (artwork: Artwork): Artwork['data']['images'][number] =>
  artwork.data.images.find((image) => image.kind === 'main') ?? artwork.data.images[0];

interface ArtworkCta {
  label: string;
  href: string;
}

export const artworkCta = (artwork: Artwork): ArtworkCta => {
  const { status, title } = artwork.data;
  if (status === 'available') {
    return { label: 'Preguntar por esta obra', href: whatsappUrl(site.whatsapp.artworkMessage(title)) };
  }
  if (status === 'reserved') {
    return {
      label: 'Avisarme si se libera',
      href: whatsappUrl(`Hola Stephany, ¿me avisas si "${title}" vuelve a estar disponible?`),
    };
  }
  if (status === 'sold') {
    return {
      label: 'Encargar algo parecido',
      href: whatsappUrl(`Hola Stephany, me encantó "${title}". ¿Podrías pintarme algo en esa línea?`),
    };
  }
  return { label: 'Encargar una obra', href: whatsappUrl(site.whatsapp.commissionMessage) };
};
