import type {ComponentType} from 'react';
import type {PageProps, Site} from '../../App';
import type {PageKey} from '../../shared/content';
type Variant = Omit<Site, 'theme'> & {theme: string};
import Home from './Home';
import Calendar from './Calendar';
import Join from './Join';
import Contact from './Contact';
import Gallery from './Gallery';
import {HERITAGE_MODES, HeritageProvider, type HeritageKey} from './mode';

const basePages: Record<PageKey, ComponentType<PageProps>> = {
  home: Home,
  calendar: Calendar,
  join: Join,
  gallery: Gallery,
  contact: Contact,
};

// Same pages, rendered for one Heritage flavour (see mode.ts).
function heritage(key: HeritageKey): Variant {
  const pages = Object.fromEntries(
    Object.entries(basePages).map(([page, Page]) => [
      page,
      (props: PageProps) => (
        <HeritageProvider variant={key}>
          <Page {...props} />
        </HeritageProvider>
      ),
    ]),
  ) as Record<PageKey, ComponentType<PageProps>>;
  return {theme: key === 'v1' ? 'gothic' : 'heritage-light', mode: HERITAGE_MODES[key], pages};
}

/** Variant 1 — Heritage, Gothic dark. */
export const v1 = heritage('v1');
/** Variant 4 — Heritage on white, Gothic light. */
export const v4 = heritage('v4');
