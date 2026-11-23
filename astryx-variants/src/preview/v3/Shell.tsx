// Variant 3 shell — adapted from the Astryx `shell-top-nav` page template.
// Kept: AppShell (surface variant) + TopNav with heading, center items and an
// end action. Removed: mega menus, search, sign-in and cart (nothing to shop).
// Added beneath the content: a quiet bulletin-style colophon (footer).

import type { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { AppShell, useAppShellMobile } from '@astryxdesign/core/AppShell';
import { useMediaQuery } from '@astryxdesign/core/hooks';
import { TopNav, TopNavHeading, TopNavItem } from '@astryxdesign/core/TopNav';
import { Button } from '@astryxdesign/core/Button';
import { Section } from '@astryxdesign/core/Section';
import { Center } from '@astryxdesign/core/Center';
import { Grid } from '@astryxdesign/core/Grid';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { Divider } from '@astryxdesign/core/Divider';
import { assets, council, navItems, type PageKey } from '../../shared/content';

const styles = stylex.create({
  // Thin vertical rule between the official lockup and the council label.
  brandRule: {
    height: {default: 48, '@media (max-width: 768px)': 32},
    alignSelf: 'center',
  },
  // Trimmed official lockup: height = visible artwork. Sized close to the
  // lockup on kofc.org so the emblem and wordmark read clearly.
  logo: {
    height: {default: 64, '@media (max-width: 768px)': 44},
    width: 'auto',
    display: 'block',
    marginBlock: 'var(--spacing-3)',
  },
  // At least one screen tall below the header (104px desktop / 84px phone),
  // so the footer sits at the bottom of short pages instead of leaving a gap.
  page: {
    minHeight: {
      default: 'calc(100dvh - 104px)',
      '@media (max-width: 768px)': 'calc(100dvh - 84px)',
    },
  },
  grow: { flexGrow: 1 },
  // Footer lockup matches the header size, as in the other variants.
  footerLogo: {
    height: {default: 64, '@media (max-width: 768px)': 48},
    width: 'auto',
    display: 'block',
    alignSelf: 'flex-start',
  },
});

export const href = (page: PageKey) => `#/v3/${page}`;

// On phones the nav folds into AppShell's drawer (which already lists
// "Become a Knight"), so the button drops out and the heading keeps its room.
function JoinAction() {
  const { isMobile } = useAppShellMobile();
  if (isMobile) return null;
  return <Button label="Join online" variant="primary" href={council.joinUrl} target="_blank" />;
}

export function Shell({ current, children }: { current: PageKey; children: ReactNode }) {
  // On very narrow phones the council's second line would truncate; show just the number.
  const isNarrow = useMediaQuery('(max-width: 380px)', false);
  return (
    <AppShell
      variant="surface"
      height="auto"
      contentPadding={0}
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
                  <img src={assets.logoHorizontalTrim} alt="Knights of Columbus" {...stylex.props(styles.logo)} />
                  <Divider orientation="vertical" variant="strong" xstyle={styles.brandRule} />
                </HStack>
              }
            />
          }
          centerContent={
            <>
              {navItems.map((item) => (
                <TopNavItem
                  key={item.key}
                  label={item.label}
                  href={href(item.key)}
                  isSelected={item.key === current}
                />
              ))}
            </>
          }
          endContent={<JoinAction />}
        />
      }
    >
      <VStack gap={0} xstyle={styles.page}>
        <VStack gap={0} xstyle={styles.grow}>
          {children}
        </VStack>
        <Section variant="muted" dividers={['top']} padding={8}>
          <Center axis="horizontal">
            <VStack gap={6} width="100%" maxWidth={1200}>
              <Grid columns={{ minWidth: 240, max: 3, repeat: 'fit' }} gap={6}>
                {/* Logo + one quiet line, so the logo's top lines up with the
                    headings of the other columns (as in the other variants). */}
                <VStack gap={3}>
                  <img
                    src={assets.logoHorizontalTrim}
                    alt="Knights of Columbus"
                    {...stylex.props(styles.footerLogo)}
                  />
                  <Text type="supporting" color="secondary">
                    {council.name} Council {council.number} · {council.location}
                  </Text>
                </VStack>
                <VStack gap={1}>
                  <Text type="label">{council.hallName}</Text>
                  <Text type="supporting" color="secondary">
                    {council.address}
                  </Text>
                  <Link href={council.directionsUrl} isExternalLink type="supporting">
                    Get directions
                  </Link>
                  <Link href={council.parishUrl} isExternalLink type="supporting">
                    Visit our parish
                  </Link>
                </VStack>
                <VStack gap={1}>
                  <Text type="label">Write to the council</Text>
                  <Link href={`mailto:${council.email}`} type="supporting">
                    {council.email}
                  </Link>
                </VStack>
              </Grid>
            </VStack>
          </Center>
        </Section>
      </VStack>
    </AppShell>
  );
}
