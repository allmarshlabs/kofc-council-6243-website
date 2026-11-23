// Variant 1 shell — adapted from the Astryx `shell-top-nav` page template.
// Kept: AppShell + TopNav frame, contentPadding, centered capped content.
// Removed: mega menus, search, sign-in and cart (nothing to shop or search).

import type {ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {AppShell, useAppShellMobile} from '@astryxdesign/core/AppShell';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {TopNav, TopNavHeading, TopNavItem} from '@astryxdesign/core/TopNav';
import {Button} from '@astryxdesign/core/Button';
import {VStack, HStack} from '@astryxdesign/core/Stack';
import {Grid} from '@astryxdesign/core/Grid';
import {Section} from '@astryxdesign/core/Section';
import {Text} from '@astryxdesign/core/Text';
import {Link} from '@astryxdesign/core/Link';
import {Divider} from '@astryxdesign/core/Divider';
import {assets, council, navItems, type PageKey} from '../../shared/content';
import {MODE} from './mode';

const styles = stylex.create({
  // Thin vertical rule between the official lockup and the council label.
  brandRule: {
    height: {default: 48, '@media (max-width: 768px)': 32},
    alignSelf: 'center',
  },
  // Cap + center the page body so wide screens show whitespace gutters.
  contentMax: {maxWidth: 1200, marginInline: 'auto', width: '100%'},
  // Trimmed official lockup: height = visible artwork. Sized close to the
  // lockup on kofc.org so the emblem and wordmark read clearly.
  logo: {
    height: {default: 64, '@media (max-width: 768px)': 44},
    width: 'auto',
    display: 'block',
    marginBlock: 'var(--spacing-3)',
  },
  // Footer lockup matches the header size so the mark reads clearly here too.
  footerLogo: {height: {default: 64, '@media (max-width: 768px)': 48}, width: 'auto', display: 'block', alignSelf: 'flex-start'},
});

export const logoSrc =
  MODE === 'dark' ? assets.logoHorizontalReverseTrim : assets.logoHorizontalTrim;

export const href = (page: PageKey) => `#/v1/${page}`;

export function Shell({
  current,
  children,
}: {
  current: PageKey;
  children: ReactNode;
}) {
  // Pages keep their templates' own padding; on phones the shell drops its
  // gutter so the two don't stack into a narrow column.
  const isPhone = useMediaQuery('(max-width: 640px)', false);
  // On very narrow phones the council's second line would truncate; show just the number.
  const isNarrow = useMediaQuery('(max-width: 380px)', false);
  return (
    <AppShell
      variant="section"
      height="auto"
      contentPadding={isPhone ? 0 : 6}
      topNav={
        <TopNav
          label="Council 6243 navigation"
          heading={
            <TopNavHeading
              heading={`Council ${council.number}`}
              subheading={isNarrow ? undefined : council.name}
              headingHref={href('home')}
              logo={
                <HStack gap={4} vAlign="center">
                  <img src={logoSrc} alt="Knights of Columbus" {...stylex.props(styles.logo)} />
                  <Divider orientation="vertical" variant="strong" xstyle={styles.brandRule} />
                </HStack>
              }
            />
          }
          centerContent={<NavItems current={current} />}
          endContent={<JoinAction />}
        />
      }>
      <VStack gap={10} xstyle={styles.contentMax}>
        {children}
        <SiteFooter isPhone={isPhone} />
      </VStack>
    </AppShell>
  );
}

// Below AppShell's mobile breakpoint the nav folds into its drawer; "Become a
// Knight" moves into the drawer list instead of crowding the compact bar.
function NavItems({current}: {current: PageKey}) {
  const {isMobile} = useAppShellMobile();
  return (
    <>
      {navItems
        .filter(item => isMobile || item.key !== 'join')
        .map(item => (
          <TopNavItem
            key={item.key}
            label={item.label}
            href={href(item.key)}
            isSelected={current === item.key}
          />
        ))}
    </>
  );
}

function JoinAction() {
  const {isMobile} = useAppShellMobile();
  if (isMobile) return null;
  return <Button label="Become a Knight" variant="primary" href={href('join')} />;
}

function SiteFooter({isPhone}: {isPhone: boolean}) {
  return (
    <Section
      variant="transparent"
      padding={0}
      paddingInline={isPhone ? 4 : 6}
      paddingBlockEnd={6}>
      <VStack gap={6}>
        <Divider />
        <Grid columns={{minWidth: 240, repeat: 'fit'}} gap={6}>
          <VStack gap={2}>
            <img
              src={logoSrc}
              alt="Knights of Columbus"
              {...stylex.props(styles.footerLogo)}
            />
            <Text type="supporting" color="secondary">
              {council.name} Council {council.number} · {council.location}
            </Text>
          </VStack>
          <VStack gap={1}>
            <Text type="label">{council.parishName}</Text>
            <Text type="supporting" color="secondary">
              {council.address}
            </Text>
            <Link href={council.parishUrl} isExternalLink type="supporting">
              Visit our parish
            </Link>
          </VStack>
          <VStack gap={1}>
            <Text type="label">Write to the council</Text>
            <Link href={`mailto:${council.email}`} type="supporting">
              {council.email}
            </Link>
            <HStack gap={3} wrap="wrap">
              {navItems.map(item => (
                <Link
                  key={item.key}
                  href={href(item.key)}
                  type="supporting"
                  color="secondary">
                  {item.label}
                </Link>
              ))}
            </HStack>
          </VStack>
        </Grid>
      </VStack>
    </Section>
  );
}
