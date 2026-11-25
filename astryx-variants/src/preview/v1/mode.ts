// Heritage renders in two flavours from the same pages:
//   Variant 1 — Gothic's signature dark mode (deep blue-gray grounds, the
//               reverse light-on-dark official logos);
//   Variant 4 — Gothic light mode on white, with the positive logos.
// Everything that differs between them (colour mode, which official artwork
// suits the ground, and the preview route prefix) comes from this context.
import {createContext, createElement, useContext, type ReactNode} from 'react';
import type {PageKey} from '../../shared/content';
import {assets} from '../../shared/content';

export type HeritageKey = 'v1' | 'v4';
export type HeritageMode = 'light' | 'dark';

export const HERITAGE_MODES: Record<HeritageKey, HeritageMode> = {
  v1: 'dark',
  v4: 'light',
};

const HeritageContext = createContext<HeritageKey>('v1');

export function HeritageProvider({
  variant,
  children,
}: {
  variant: HeritageKey;
  children: ReactNode;
}) {
  return createElement(HeritageContext.Provider, {value: variant}, children);
}

export function useHeritage() {
  const key = useContext(HeritageContext);
  const isDark = HERITAGE_MODES[key] === 'dark';
  return {
    mode: HERITAGE_MODES[key],
    // Official KofC artwork: reverse versions on dark grounds, positive on white.
    logoSrc: isDark ? assets.logoHorizontalReverseTrim : assets.logoHorizontalTrim,
    emblemSrc: isDark ? assets.emblemReverse : assets.emblem,
    href: (page: PageKey) => `#/${key}/${page}`,
  };
}
