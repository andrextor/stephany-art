import type { APIRoute } from 'astro';
import { site, whatsappUrl } from '../data/site';
import { copy } from '../i18n';
import { getPublishedArtworks } from '../lib/artworks';

// Plain-text summary for AI agents (https://llmstxt.org), built from the same data as the pages.
export const GET: APIRoute = async ({ site: origin }) => {
  const t = copy.es;
  const url = (path: string): string => new URL(path, origin).href;
  const artworks = await getPublishedArtworks('es');
  const artworkLine = ({ id, data }: (typeof artworks)[number]): string => {
    const facts = [
      t.categoryNames[data.category],
      data.status && t.statusLabels[data.status],
      data.technique,
      data.year,
      data.dimensions && `${data.dimensions.width} × ${data.dimensions.height} ${data.dimensions.unit}`,
    ].filter(Boolean);
    return `- [${data.title}](${url(`/obras/${id}/`)}): ${facts.join(' · ')}`;
  };

  const body = [
    `# ${site.artistName}`,
    `> ${t.ui.defaultDescription}`,
    t.bio.join('\n\n'),
    `## Exposiciones y publicaciones\n${t.exhibitions.map(({ year, event }) => `- ${year}: ${event}`).join('\n')}`,
    `## Encargos\n${t.ui.commissionText}\n${t.commissionSteps.map(({ title, text }, index) => `${index + 1}. ${title}: ${text}`).join('\n')}`,
    `## Contacto\n- WhatsApp: ${site.whatsapp.display} (${whatsappUrl(t.messages.commission)})\n- Instagram: ${site.instagram.handle} (${site.instagram.url})\n- Email: ${site.email}`,
    `## Páginas\n- [Inicio](${url('/')})\n- [Obras](${url('/obras/')})\n- [Sobre mí](${url('/sobre-mi/')})\n- [English version](${url('/en/')})`,
    `## Obras\n${artworks.map(artworkLine).join('\n')}`,
  ].join('\n\n');

  return new Response(`${body}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
