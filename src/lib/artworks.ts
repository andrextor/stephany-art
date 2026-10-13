import { type CollectionEntry, getCollection } from 'astro:content';
import type { artworkCategories, artworkStatuses } from '../content.config';
import { whatsappUrl } from '../data/site';
import { copy, type Lang } from '../i18n';

// `content` is the entry whose body is the description in the artwork's language.
export type Artwork = CollectionEntry<'artworks'> & {
  content: CollectionEntry<'artworks'> | CollectionEntry<'artworksEn'>;
};
export type ArtworkCategory = (typeof artworkCategories)[number];
export type ArtworkStatus = (typeof artworkStatuses)[number];

const categoryOrder: Record<ArtworkCategory, number> = { personal: 0, commission: 1 };

// Spanish entries as they are; in English, title, technique and alts come from artworks-en
// when a translation exists.
export const getPublishedArtworks = async (lang: Lang): Promise<Artwork[]> => {
  const artworks = await getCollection('artworks', ({ data }) => !data.draft);
  const translations = lang === 'en' ? await getCollection('artworksEn') : [];
  const { techniques } = copy[lang];
  return artworks
    .map((artwork): Artwork => {
      const translation = translations.find((entry) => entry.id === artwork.id);
      if (!translation) return { ...artwork, content: artwork };
      const { title, alts } = translation.data;
      const { technique, images } = artwork.data;
      return {
        ...artwork,
        content: translation,
        data: {
          ...artwork.data,
          title,
          technique: technique && (techniques[technique] ?? technique),
          images: images.map((image, index) => ({ ...image, alt: alts[index] ?? image.alt })),
        },
      };
    })
    .sort((a, b) => categoryOrder[a.data.category] - categoryOrder[b.data.category] || a.data.order - b.data.order);
};

export const artworkPaths = async (lang: Lang) => {
  const artworks = await getPublishedArtworks(lang);
  return artworks.map((artwork) => ({ params: { slug: artwork.id }, props: { artwork, artworks } }));
};

export const mainImage = (artwork: Artwork): Artwork['data']['images'][number] =>
  artwork.data.images.find((image) => image.kind === 'main') ?? artwork.data.images[0];

interface ArtworkCta {
  label: string;
  href: string;
}

export const artworkCta = (artwork: Artwork, lang: Lang): ArtworkCta => {
  const { status, title } = artwork.data;
  const { messages, ui } = copy[lang];
  if (status === 'available') {
    return { label: ui.ctaAvailable, href: whatsappUrl(messages.artwork(title)) };
  }
  if (status === 'reserved') {
    return { label: ui.ctaReserved, href: whatsappUrl(messages.reserved(title)) };
  }
  if (status === 'sold') {
    return { label: ui.ctaSold, href: whatsappUrl(messages.sold(title)) };
  }
  return { label: ui.commission, href: whatsappUrl(messages.commission) };
};
