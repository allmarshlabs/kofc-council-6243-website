import type { Variant } from '../heritage';
import Home from './Home';
import CalendarPage from './CalendarPage';
import Join from './Join';
import Contact from './Contact';
import Gallery from './Gallery';

// Variant 2 "Modern parish community", Astryx Butter theme (preview only;
// the live site uses the Heritage White design in src/heritage).
export const community: Variant = {
  theme: 'butter',
  mode: 'light',
  pages: { home: Home, calendar: CalendarPage, join: Join, gallery: Gallery, contact: Contact },
};
