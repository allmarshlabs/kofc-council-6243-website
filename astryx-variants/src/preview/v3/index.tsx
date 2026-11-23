import type { Site } from '../../App';
type Variant = Omit<Site, 'theme'> & { theme: string };
import Home from './Home';
import Calendar from './Calendar';
import Join from './Join';
import Contact from './Contact';
import Gallery from './Gallery';

// Variant 3 — "Parish bulletin": type-led, Stone theme, light mode.
export const v3: Variant = {
  theme: 'stone',
  mode: 'light',
  pages: { home: Home, calendar: Calendar, join: Join, gallery: Gallery, contact: Contact },
};
