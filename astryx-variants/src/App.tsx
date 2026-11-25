import { useEffect, useState, type ComponentType } from 'react';
import { Theme } from '@astryxdesign/core/theme';
import { themes } from './astryx-themes';
import type { PageKey } from './shared/content';
// The live site: the Heritage White design the council chose.
import { site } from './heritage';
// Heritage's typefaces (Fustat, and Manufacturing Consent for display text)
// are loaded by the Gothic theme package's font stylesheet.
import '@astryxdesign/theme-gothic/fonts.css';

// Hash routing (#/join) works on GitHub Pages with no server rewrites.
export type NavigateFn = (page: PageKey) => void;
export type PageProps = { navigate: NavigateFn; current: PageKey };
export type Site = {
  theme: keyof typeof themes;
  mode: 'light' | 'dark';
  pages: Record<PageKey, ComponentType<PageProps>>;
};

const pageKeys: PageKey[] = ['home', 'calendar', 'join', 'gallery', 'contact'];

// Accepts #/join and the older preview form #/v2/join.
function parse(): PageKey {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const last = parts[parts.length - 1];
  return (pageKeys as string[]).includes(last) ? (last as PageKey) : 'home';
}

export default function App() {
  const [page, setPage] = useState(parse);
  useEffect(() => {
    const onHash = () => {
      setPage(parse());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const Page = site.pages[page];
  const navigate: NavigateFn = (p) => {
    window.location.hash = `/${p}`;
  };

  return (
    <Theme theme={themes[site.theme]} mode={site.mode}>
      <Page navigate={navigate} current={page} />
    </Theme>
  );
}
