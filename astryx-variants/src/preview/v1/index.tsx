import type {Site} from '../../App';
type Variant = Omit<Site, 'theme'> & {theme: string};
import Home from './Home';
import Calendar from './Calendar';
import Join from './Join';
import Contact from './Contact';
import Gallery from './Gallery';
import {MODE} from './mode';

export const v1: Variant = {
  theme: 'gothic',
  mode: MODE,
  pages: {home: Home, calendar: Calendar, join: Join, gallery: Gallery, contact: Contact},
};
