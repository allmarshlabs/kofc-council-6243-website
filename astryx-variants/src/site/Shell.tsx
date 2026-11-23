// Shared frame for variant 2, adapted from the Astryx `shell-top-nav` template:
// AppShell + TopNav with plain nav items (no mega menus, search or cart),
// a primary "Become a Knight" action, and a parish footer.
import type { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { AppShell } from '@astryxdesign/core/AppShell';
import { TopNav, TopNavHeading, TopNavItem } from '@astryxdesign/core/TopNav';
import { useMediaQuery } from '@astryxdesign/core/hooks';
import { Button } from '@astryxdesign/core/Button';
import { Icon } from '@astryxdesign/core/Icon';
import { Section } from '@astryxdesign/core/Section';
import { Grid } from '@astryxdesign/core/Grid';
import { VStack, HStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { Divider } from '@astryxdesign/core/Divider';
import {
  CalendarDaysIcon,
  EnvelopeIcon,
  HomeIcon,
  MapPinIcon,
  PhotoIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { assets, council, navItems, type PageKey } from '../shared/content';

const styles = stylex.create({
  // Thin vertical rule between the official lockup and the council label.
  brandRule: {
    height: {default: 48, '@media (max-width: 768px)': 32},
    alignSelf: 'center',
  },
  // Cap + center the page body so wide screens show whitespace gutters (template value).
  contentMax: { maxWidth: 1100, marginInline: 'auto', width: '100%' },
  // Full-height column so the footer sits at the bottom of short pages.
  // At least one screen tall below the header (104px desktop / 84px phone),
  // so the footer sits at the bottom of short pages instead of leaving a gap.
  page: {
    minHeight: {
      default: 'calc(100dvh - 152px)',
      '@media (max-width: 768px)': 'calc(100dvh - 84px)',
    },
  },
  grow: { flexGrow: 1 },
  // Trimmed official lockup: height = visible artwork. Sized close to the
  // lockup on kofc.org so the emblem and wordmark read clearly.
  logo: {
    height: {default: 64, '@media (max-width: 768px)': 44},
    width: 'auto',
    display: 'block',
    marginBlock: 'var(--spacing-3)',
  },
  // Footer lockup matches the header size so the mark reads clearly here too.
  footerLogo: {
    height: {default: 64, '@media (max-width: 768px)': 48},
    width: 'auto',
    display: 'block',
    alignSelf: 'flex-start',
  },
});

const NAV_ICONS = {
  home: HomeIcon,
  calendar: CalendarDaysIcon,
  join: UserPlusIcon,
  gallery: PhotoIcon,
  contact: EnvelopeIcon,
} as const;

export const href = (page: PageKey) => `#/${page}`;

export function Shell({ current, children }: { current: PageKey; children: ReactNode }) {
  // Below the AppShell 'md' breakpoint the nav items move into the generated drawer;
  // the join action moves with them so the compact bar keeps the logo readable.
  const isMobile = useMediaQuery('(max-width: 767px)');
  // On very narrow phones the council's second line would truncate; show just the number.
  const isNarrow = useMediaQuery('(max-width: 380px)', false);
  return (
    <AppShell
      variant="surface"
      height="auto"
      contentPadding={6}
      topNav={
        <TopNav
          label="Council 6243 navigation"
          heading={
            <TopNavHeading
              heading={`Council ${council.number}`}
              subheading={isNarrow ? undefined : council.name}
              logo={
                <HStack gap={4} vAlign="center">
                  <img src={assets.logoHorizontalTrim} alt="Knights of Columbus" {...stylex.props(styles.logo)} />
                  <Divider orientation="vertical" variant="strong" xstyle={styles.brandRule} />
                </HStack>
              }
              headingHref={href('home')}
            />
          }
          centerContent={
            <>
              {navItems
                .filter((item) => isMobile || item.key !== 'join')
                .map((item) => (
                  <TopNavItem
                    key={item.key}
                    label={item.label}
                    href={href(item.key)}
                    icon={isMobile ? <Icon icon={NAV_ICONS[item.key]} size="sm" /> : undefined}
                    isSelected={item.key === current}
                  />
                ))}
            </>
          }
          endContent={
            isMobile ? undefined : (
              <Button
                label="Become a Knight"
                variant="primary"
                href={href('join')}
                icon={<Icon icon={UserPlusIcon} size="sm" />}
              />
            )
          }
        />
      }
    >
      <VStack gap={10} xstyle={styles.page}>
        <VStack gap={10} xstyle={[styles.contentMax, styles.grow]}>
          {children}
        </VStack>
        <Footer />
      </VStack>
    </AppShell>
  );
}

function Footer() {
  return (
    <Section variant="muted" padding={6}>
      <VStack gap={5} xstyle={styles.contentMax}>
        <Grid columns={{ minWidth: 240, max: 3 }} gap={6}>
          <VStack gap={2}>
            <img src={assets.logoHorizontalTrim} alt="Knights of Columbus" {...stylex.props(styles.footerLogo)} />
            <Text type="supporting" color="secondary">
              {council.fullName} · {council.location}
            </Text>
          </VStack>
          <VStack gap={2}>
            <Text type="label" weight="semibold">
              {council.hallName}
            </Text>
            <HStack gap={2} vAlign="start">
              <Icon icon={MapPinIcon} size="sm" color="secondary" />
              <Text type="supporting" color="secondary">
                {council.address}
              </Text>
            </HStack>
            <Link href={council.directionsUrl} isExternalLink type="supporting">
              Get directions
            </Link>
            <Link href={council.parishUrl} isExternalLink type="supporting">
              Visit our parish
            </Link>
          </VStack>
          <VStack gap={2}>
            <Text type="label" weight="semibold">
              Get in touch
            </Text>
            <HStack gap={2} vAlign="center">
              <Icon icon={EnvelopeIcon} size="sm" color="secondary" />
              <Link href={`mailto:${council.email}`} type="supporting">
                {council.email}
              </Link>
            </HStack>
            <Link href={council.facebookUrl} isExternalLink type="supporting">
              Join our Facebook group
            </Link>
          </VStack>
        </Grid>
        <Divider />
        <Text type="supporting" color="secondary">
          {council.name} Council {council.number}, Knights of Columbus.
        </Text>
      </VStack>
    </Section>
  );
}
