import { copy, type Lang, localePath } from '../i18n';
import { site, whatsappUrl } from './site';

export interface WorldCta {
  label: string;
  href: string;
  external?: boolean;
}

export interface WorldStop {
  id: string;
  label: string;
  /** Landscape still; the portrait and 1440 variants share its basename (scripts/encode-world.mjs). */
  still: string;
  /** Desktop engine: viewport-heights of scroll spent on this stop. */
  scroll?: number;
  /** Desktop engine: viewport-heights of scroll for the walk that arrives at this stop. */
  walk?: number;
  titleTag?: 'h1' | 'h2';
  eyebrow: string;
  title: string;
  body: string;
  tags?: readonly string[];
  cta?: { primary?: WorldCta; secondary?: WorldCta };
}

export const portraitStill = (still: string): string => still.replace('.webp', '-portrait.webp');

// The five stops of the studio tour, shared by the desktop (ScrollWorld) and phone
// (ScrollWorldMobile) versions.
export const worldStops = (lang: Lang): WorldStop[] => {
  const { role, ui, messages, world } = copy[lang];
  const [home, studio, commissions, personal, inProgress] = world.stops;
  const commission: WorldCta = { label: ui.commission, href: whatsappUrl(messages.commission), external: true };

  return [
    {
      id: 'inicio',
      label: home.label,
      still: '/world/stop-0.webp',
      scroll: 1.2,
      titleTag: 'h1',
      eyebrow: role,
      title: site.artistName,
      body: home.body,
      cta: { primary: commission, secondary: { label: ui.viewWorks, href: localePath(lang, '/obras') } },
    },
    {
      id: 'taller',
      label: studio.label,
      still: '/world/stop-1.webp',
      eyebrow: studio.eyebrow,
      title: studio.title,
      body: studio.body,
    },
    {
      id: 'comision',
      label: commissions.label,
      still: '/world/stop-2.webp',
      eyebrow: commissions.eyebrow,
      title: commissions.title,
      body: commissions.body,
      cta: {
        primary: commission,
        secondary: { label: world.viewCommissions, href: localePath(lang, '/obras?cat=commission') },
      },
    },
    {
      id: 'personales',
      label: personal.label,
      still: '/world/stop-3.webp',
      eyebrow: personal.eyebrow,
      title: personal.title,
      body: personal.body,
      tags: world.personalTags,
      cta: { secondary: { label: world.viewPersonal, href: localePath(lang, '/obras?cat=personal') } },
    },
    {
      id: 'en-proceso',
      label: inProgress.label,
      still: '/world/stop-4.webp',
      scroll: 0.5,
      // The copy is fully in before this dive starts (copy lead), so a short dwell is
      // enough: anything longer is a still picture under finished copy before the page
      // slides up. clip-4 runs 20 s, the other walks 10 s: twice the scroll, same pace.
      walk: 2.8,
      eyebrow: inProgress.eyebrow,
      title: inProgress.title,
      body: inProgress.body,
      cta: {
        primary: commission,
        secondary: { label: world.viewInProgress, href: localePath(lang, '/obras?estado=in-progress') },
      },
    },
  ];
};
