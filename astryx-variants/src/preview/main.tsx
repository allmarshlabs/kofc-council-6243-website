// Local-only preview of all four design variants (open /preview.html on the
// dev server). Not part of the production build: vite build only bundles
// index.html, the live site, which is Variant 4's design (Heritage White).
// Variants 1–3 and the Gothic, Butter and Stone themes never ship.
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as stylex from '@stylexjs/stylex';
import { Theme } from '@astryxdesign/core/theme';
import { Card } from '@astryxdesign/core/Card';
import { HStack } from '@astryxdesign/core/Stack';
import { Button } from '@astryxdesign/core/Button';
import { Text } from '@astryxdesign/core/Text';
import { gothicTheme } from '@astryxdesign/theme-gothic/built';
import '@astryxdesign/theme-gothic/theme.css';
import '@astryxdesign/theme-gothic/fonts.css';
import { stoneTheme } from '@astryxdesign/theme-stone/built';
import '@astryxdesign/theme-stone/theme.css';
import '@astryxdesign/theme-stone/fonts.css';
// Variant 4: Heritage on white — a light theme made with the Astryx theme
// editor (themes/heritage-light/) from Gothic's fonts, accent and grays.
// Gothic's fonts.css above supplies Fustat and Manufacturing Consent.
import { heritageLightTheme } from '../themes/heritage-light/heritage-light.js';
import '../themes/heritage-light/heritage-light.css';
import '../index.css';
import { butterTheme } from '@astryxdesign/theme-butter/built';
import '@astryxdesign/theme-butter/theme.css';
import '@astryxdesign/theme-butter/fonts.css';
import type { PageKey } from '../shared/content';
import { community } from '../community';
import { v1, v4 } from '../heritage';
import { v3 } from './v3';

const variants = {
  v1: { label: '1 · Heritage', def: v1, theme: gothicTheme },
  v2: { label: '2 · Community', def: community, theme: butterTheme },
  v3: { label: '3 · Bulletin', def: v3, theme: stoneTheme },
  v4: { label: '4 · Heritage White', def: v4, theme: heritageLightTheme },
} as const;
type VKey = keyof typeof variants;
const pageKeys: PageKey[] = ['home', 'calendar', 'join', 'gallery', 'contact'];

// #/v1/join, #/v3/home … ; unprefixed links (#/join) come from the
// Variant 2 code (written when Community was the main build), so they stay
// on Variant 2.
// Opening preview.html with no hash starts on Variant 1 (Heritage).
function parse(): { v: VKey; page: PageKey } {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const v = (parts.length === 0 ? 'v1' : parts[0] in variants ? parts[0] : 'v2') as VKey;
  const last = parts[parts.length - 1];
  const page = (pageKeys as string[]).includes(last) ? (last as PageKey) : 'home';
  return { v, page };
}

const styles = stylex.create({
  bar: {
    position: 'fixed',
    insetInline: 0,
    bottom: 16,
    marginInline: 'auto',
    width: 'fit-content',
    maxWidth: 'calc(100% - 32px)',
    zIndex: 1000,
  },
});

function Preview() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onHash = () => {
      setRoute(parse());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const current = variants[route.v];
  const Page = current.def.pages[route.page];
  const prefix = route.v === 'v2' ? '' : `/${route.v}`;
  const navigate = (p: PageKey) => {
    window.location.hash = `${prefix}/${p}`;
  };

  return (
    <>
      <Theme theme={current.theme} mode={current.def.mode}>
        <Page navigate={navigate} current={route.page} />
      </Theme>
      {/* Variant switcher, always in the same (Butter) theme */}
      <Theme theme={butterTheme} mode="light">
        <Card padding={2} xstyle={styles.bar}>
          <HStack gap={1} wrap="wrap" vAlign="center">
            <Text type="supporting" color="secondary">
              Preview
            </Text>
            {(Object.keys(variants) as VKey[]).map((k) => (
              <Button
                key={k}
                size="sm"
                label={variants[k].label}
                variant={k === route.v ? 'primary' : 'secondary'}
                href={`#${k === 'v2' ? '' : `/${k}`}/${route.page}`}
              />
            ))}
          </HStack>
        </Card>
      </Theme>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Preview />
  </StrictMode>,
);
