// Single source of truth for all site copy. Every variant reads from here,
// so the three designs differ only in template, theme and component choice.

export const assets = {
  logoHorizontal: './kofc-official/kofc_r_hz_rgb_pos.png',
  logoHorizontalReverse: './kofc-official/kofc_r_hz_rgb_rev.png',
  // Same official lockups with the file's transparent margins trimmed, so a
  // CSS height equals the visible artwork height.
  logoHorizontalTrim: './kofc-official/kofc_r_hz_rgb_pos_trim.png',
  logoHorizontalReverseTrim: './kofc-official/kofc_r_hz_rgb_rev_trim.png',
  emblem: './kofc-official/kofc_r_emblem_rgb_pos.png',
  emblemReverse: './kofc-official/kofc_r_emblem_rgb_rev.png',
  emblemTrim: './kofc-official/kofc_r_emblem_rgb_pos_trim.png',
  emblemReverseTrim: './kofc-official/kofc_r_emblem_rgb_rev_trim.png',
  mcgivney: './kofc-official/mcgivney.webp',
  mcgivneyAlt:
    'Painting of Blessed Michael McGivney, founder of the Knights of Columbus, seated with an open book',
  rosary: './rosary.webp',
  volunteers: './contact-volunteers.jpg',
};

export const council = {
  name: 'Our Lady of Mount Carmel',
  number: '6243',
  fullName: 'Knights of Columbus Council 6243',
  location: 'Williamsburg, Brooklyn',
  // Where the council meets: its own hall, not the church.
  hallName: 'Sonny Mangone Hall',
  address: '16 Havemeyer Street, Brooklyn, NY 11211',
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=16+Havemeyer+St+Brooklyn+NY+11211',
  // The parish the council serves (kept for the "Visit our parish" link).
  parishAddress: '275 North 8th Street, Brooklyn, NY 11211',
  email: 'OLMC6243@gmail.com',
  parishUrl: 'https://mountcarmel-annunciation.com/',
  parishName: 'Shrine Church of Our Lady of Mount Carmel',
  joinUrl: 'https://www.kofc.org/joinus',
  facebookUrl: 'https://www.facebook.com/groups/3240552622838782',
  calendarEmbed:
    'https://calendar.google.com/calendar/embed?src=olmc6243%40gmail.com&ctz=America%2FNew_York',
  intro:
    'We’re the Knights of Columbus in Williamsburg, Brooklyn. Together with our families, we serve our parish and our neighbors.',
  givingNote:
    'Our Lady of Mount Carmel Council 6243 and the Ladies Auxiliary serve our Brooklyn parish together. The council reports that the two groups give more than $10,000 a year to charitable causes.',
};

export const principles = ['Charity', 'Unity', 'Fraternity', 'Patriotism'] as const;

export const founder = {
  name: 'Blessed Michael McGivney',
  blurb:
    'In 1882 Father Michael McGivney, a parish priest in New Haven, Connecticut, founded the Knights of Columbus to strengthen the faith of Catholic men and support families in need. He was beatified in 2020.',
  url: 'https://www.kofc.org/who-we-are/our-founder/',
};

export const meetings = [
  { title: 'Knights’ meetings', when: 'First and third Mondays of each month' },
  { title: 'Ladies Auxiliary meetings', when: 'Fourth Monday of each month' },
];
export const meetingsNote = 'Email the council to confirm the time and location.';

export const pillars = [
  {
    title: 'Faith',
    body: 'We sponsor seminarians, give rosaries to children receiving First Holy Communion, promote Holy Hours and provide memorial Masses for brother Knights who have died.',
  },
  {
    title: 'Community',
    body: 'We provide winter coats for children, support the Global Wheelchair Mission, and volunteer at parish fundraisers and Ladies Auxiliary events. We also sponsor free throw, soccer and hockey competitions.',
  },
  {
    title: 'Family',
    body: 'We volunteer at the food pantry, help feed neighbors experiencing hunger or homelessness, support the Keep Christ in Christmas campaign and invite families to Holy Week services.',
  },
  {
    title: 'Life',
    body: 'We support Bridge to Life, pregnancy support centers and Special Olympics. Members attend the annual Pro-Life and Pro Vita Masses and participate in the Novena for Life.',
  },
];

export const join = {
  headline: 'Become a Knight',
  eligibility: 'Practicing Catholic men age 18 and older can join online.',
  steps: [
    { title: 'Start online', body: 'Go to kofc.org/joinus and begin the free online membership form.' },
    { title: 'Choose our council', body: 'Enter 6243 when asked for your preferred council.' },
    { title: 'Meet your brothers', body: 'Come to a meeting on the first or third Monday of the month.' },
  ],
  volunteerTitle: 'Volunteer or meet the Ladies Auxiliary',
  volunteerBody:
    'Ask about the next parish fundraiser, food pantry activity or Auxiliary meeting.',
};

export const contacts = [
  { role: 'Grand Knight', name: 'Frank Ingenito', phone: '718-909-1203', tel: '+17189091203', email: 'Frankie8254@gmail.com' },
  { role: 'Financial Secretary', name: 'Joe Peluso, FVSM', phone: '917-623-0711', tel: '+19176230711', email: 'JoePeluso6243@gmail.com' },
  { role: 'Ladies Auxiliary President', name: 'Diana Salmon', phone: '917-578-2114', tel: '+19175782114', email: 'dcpeluso@gmail.com' },
];

// Contact form → Google Form owned by the council's Gmail.
// GitHub Pages can't receive submissions, so the site posts each message to
// the Google Form's response endpoint; answers land in the form's Sheet and
// Google emails the council. Until `formId` is filled in, the site falls back
// to opening the visitor's email app addressed to the council.
//
// To connect: in the Google Form, ⋮ → "Get pre-filled link", type a value in
// every question, copy the link. formId is the long id after /forms/d/e/, and
// each entry.NNNN in the link maps to a question below.
export const contactForm = {
  googleForm: {
    formId: '', // e.g. '1FAIpQLSe...'
    fields: {
      name: '', // e.g. 'entry.123456789'
      email: '',
      phone: '',
      topic: '',
      message: '',
    },
  },
  topics: ['Joining the Knights', 'Ladies Auxiliary', 'Volunteering', 'Council events', 'Something else'],
};

export type PageKey = 'home' | 'calendar' | 'join' | 'gallery' | 'contact';
export const navItems: { key: PageKey; label: string }[] = [
  { key: 'home', label: 'Our council' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'join', label: 'Become a Knight' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'contact', label: 'Contact us' },
];

// Gallery. Google Photos has no official embed (and closed its API to shared
// albums in 2025), so the page shows featured photos stored with the site and
// links out to the council's shared Google Photos album for everything else.
//
// To add the album: in Google Photos (council Gmail) open the album → Share →
// Create link, and paste it into albumUrl.
// To feature a photo: put the file in public/gallery/ and add an entry below,
// e.g. { src: './gallery/coat-drive-2026.jpg', alt: 'Knights handing out
// winter coats', caption: 'Coat drive, December 2026', category: 'Service' }.
export type GalleryPhoto = {
  src: string;
  alt: string;
  caption?: string;
  category: 'Events' | 'Service' | 'Parish';
};
export const gallery = {
  intro:
    'Moments from council meetings, parish events and our service projects, shared by our brother Knights and the Ladies Auxiliary.',
  albumUrl: '', // e.g. 'https://photos.app.goo.gl/...'
  photos: [] as GalleryPhoto[],
};
