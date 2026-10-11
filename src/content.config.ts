import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const artworkCategories = ['commission', 'personal'] as const;

export const artworkStatuses = [
  'available',
  'reserved',
  'sold',
  'delivered',
  'in-progress',
  'private-collection',
] as const;

export const imageKinds = ['main', 'detail', 'process', 'studio', 'certificate'] as const;

const artworks = defineCollection({
  loader: glob({ base: './src/content/artworks', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        category: z.enum(artworkCategories),
        // Unset while the artist confirms it: the UI then shows no badge.
        status: z.enum(artworkStatuses).optional(),
        year: z.number().int().min(1990).max(2100).optional(),
        technique: z.string().min(1).optional(),
        dimensions: z
          .object({
            width: z.number().positive(),
            height: z.number().positive(),
            unit: z.literal('cm').default('cm'),
          })
          .optional(),
        price: z
          .object({
            amount: z.number().int().positive(),
            currency: z.literal('COP').default('COP'),
            visible: z.boolean().default(false),
          })
          .optional(),
        images: z
          .array(
            z.object({
              src: image(),
              alt: z.string().min(1),
              kind: z.enum(imageKinds).default('main'),
            }),
          )
          .min(1),
        featured: z.boolean().default(false),
        order: z.number().int().default(0),
        draft: z.boolean().default(false),
      })
      .refine((artwork) => artwork.category !== 'commission' || artwork.price === undefined, {
        message: 'Commissions never show a price',
        path: ['price'],
      })
      .refine(
        (artwork) =>
          artwork.category !== 'commission' || (artwork.status !== 'available' && artwork.status !== 'reserved'),
        { message: 'A commission cannot be available or reserved', path: ['status'] },
      ),
});

export const collections = { artworks };
