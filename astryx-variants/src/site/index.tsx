import type { Site } from '../App';
import Home from './Home';
import CalendarPage from './CalendarPage';
import Join from './Join';
import Contact from './Contact';
import Gallery from './Gallery';

// Council 6243 site: "Modern parish community" design, Astryx Butter theme.
export const site: Site = {
  theme: 'butter',
  mode: 'light',
  pages: { home: Home, calendar: CalendarPage, join: Join, gallery: Gallery, contact: Contact },
};
