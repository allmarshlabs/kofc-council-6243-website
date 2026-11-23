// Home — adapted from the Astryx `documentation` page template (Documentation
// Catalog: a banner above a grid of category cards). Kept: Layout with
// contentWidth 1200, LayoutContent padding 8, VStack gap 10, the gray banner
// Card (padding 10 / 6 on phones) and the ClickableCard category grid.
// Replaced: the component catalog with the council's own wayfinding, then
// bulletin-style sections written in the same heading + grid rhythm.

import * as stylex from '@stylexjs/stylex';
import { Heading, Text } from '@astryxdesign/core/Text';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { HStack, VStack, Stack, StackItem } from '@astryxdesign/core/Stack';
import { Layout, LayoutContent } from '@astryxdesign/core/Layout';
import { Grid } from '@astryxdesign/core/Grid';
import { Center } from '@astryxdesign/core/Center';
import { Icon } from '@astryxdesign/core/Icon';
import { Badge } from '@astryxdesign/core/Badge';
import { Divider } from '@astryxdesign/core/Divider';
import { Link } from '@astryxdesign/core/Link';
import { List, ListItem } from '@astryxdesign/core/List';
import { Blockquote } from '@astryxdesign/core/Blockquote';
import { AspectRatio } from '@astryxdesign/core/AspectRatio';
import { useMediaQuery } from '@astryxdesign/core/hooks';
import { spacingVars } from '@astryxdesign/core/theme/tokens.stylex';
import {
  CalendarDaysIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  BuildingLibraryIcon,
  HeartIcon,
  LinkIcon,
  UserGroupIcon,
  FlagIcon,
} from '@heroicons/react/24/outline';
import type { PageProps } from '../../App';
import {
  assets,
  council,
  contacts,
  founder,
  join,
  meetings,
  meetingsNote,
  pillars,
  principles,
  type PageKey,
} from '../../shared/content';
import { Shell, href } from './Shell';
import { formatDay, isToday, meetingsThisMonth } from './schedule';

const styles = stylex.create({
  // Negative margin offsets each card's 8px padding so the grid content stays
  // visually aligned while giving every card a padded hover/click target.
  // (Template value, moved from an inline style into StyleX.)
  cardGrid: { margin: `calc(-1 * ${spacingVars['--spacing-2']})` },
  emblem: { width: '100%', maxWidth: 220, height: 'auto', display: 'block' },
  emblemSmall: { width: 96, height: 'auto', display: 'block' },
  // The painting is 16:9 with McGivney seated on the right: crop toward him.
  portrait: { width: '100%', height: '100%', objectFit: 'cover', objectPosition: '78% 30%' },
});

const OUR_COUNCIL_ID = 'v3-our-council';

const principleIcon = {
  Charity: HeartIcon,
  Unity: LinkIcon,
  Fraternity: UserGroupIcon,
  Patriotism: FlagIcon,
} as const;

type Category = {
  key: string;
  name: string;
  desc: string;
  icon: typeof CalendarDaysIcon;
  page?: PageKey;
};

const CATEGORIES: Category[] = [
  {
    key: 'calendar',
    name: 'Calendar',
    desc: `${meetings[0].title}: ${meetings[0].when}. ${meetings[1].title}: ${meetings[1].when}.`,
    icon: CalendarDaysIcon,
    page: 'calendar',
  },
  {
    key: 'join',
    name: join.headline,
    desc: join.eligibility,
    icon: ShieldCheckIcon,
    page: 'join',
  },
  {
    key: 'contact',
    name: 'Contact us',
    desc: `Write to ${council.email} or reach our ${contacts.map((c) => c.role).join(', ')}.`,
    icon: EnvelopeIcon,
    page: 'contact',
  },
  {
    key: 'council',
    name: 'Our council',
    desc: council.intro,
    icon: BuildingLibraryIcon,
  },
];

export default function Home({ current }: PageProps) {
  // On a phone, the spacer's gap squeezes the title until a word breaks. A
  // phone drops the spacer and narrows the card inset. (Template behaviour.)
  const isNarrow = useMediaQuery('(max-width: 640px)', true);
  const thisMonth = meetingsThisMonth();
  const now = new Date();
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now);

  return (
    <Shell current={current}>
      <Layout
        height="auto"
        contentWidth={1200}
        content={
          <LayoutContent padding={isNarrow ? 4 : 8}>
            <VStack gap={10}>
              {/* Banner */}
              <Card variant="gray" padding={isNarrow ? 6 : 10}>
                <HStack gap={8} vAlign="center">
                  <StackItem size="fill">
                    <VStack gap={4}>
                      {/* The council leads; the parish name is the small label. */}
                      <Text type="label" color="secondary">
                        {council.name} · {council.location}
                      </Text>
                      {/* Two lines at every size so "Council 6243" never strands; one
                          display step smaller on phones so it fits. */}
                      <Text as="h1" type={isNarrow ? 'display-2' : 'display-1'}>
                        Knights of Columbus
                        <br />
                        {`Council\u00A0${council.number}`}
                      </Text>
                      <Text type="large" weight="normal" color="secondary">
                        {council.intro}
                      </Text>
                      <HStack gap={2} wrap="wrap">
                        <Button
                          label={join.headline}
                          variant="primary"
                          size="lg"
                          href={href('join')}
                        />
                        <Button
                          label="See the calendar"
                          variant="secondary"
                          size="lg"
                          href={href('calendar')}
                        />
                      </HStack>
                    </VStack>
                  </StackItem>
                  {!isNarrow && (
                    <StackItem size="fill">
                      <Center axis="horizontal">
                        <img
                          src={assets.emblem}
                          alt="Knights of Columbus emblem"
                          {...stylex.props(styles.emblem)}
                        />
                      </Center>
                    </StackItem>
                  )}
                </HStack>
              </Card>

              {/* Category cards: pure wayfinding */}
              <VStack gap={4}>
                <Heading level={2}>Find your way</Heading>
                <Grid columns={{ minWidth: 240 }} gap={2} xstyle={styles.cardGrid}>
                  {CATEGORIES.map((item) => (
                    <ClickableCard
                      key={item.key}
                      label={`Open ${item.name}`}
                      href={item.page ? href(item.page) : undefined}
                      onClick={
                        item.page
                          ? undefined
                          : () =>
                              document
                                .getElementById(OUR_COUNCIL_ID)
                                ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                      variant="default"
                      padding={isNarrow ? 4 : 5}
                    >
                      <VStack gap={3}>
                        <Icon icon={item.icon} size="lg" color="accent" />
                        <VStack gap={0.5}>
                          <Text type="body" weight="bold">
                            {item.name}
                          </Text>
                          <Text type="body" color="secondary" maxLines={3}>
                            {item.desc}
                          </Text>
                        </VStack>
                      </VStack>
                    </ClickableCard>
                  ))}
                </Grid>
              </VStack>

              {/* Principles: an icon row */}
              <VStack gap={4}>
                <Heading level={2}>Our principles</Heading>
                <Divider variant="strong" />
                <Grid columns={{ minWidth: 140 }} gap={6}>
                  {principles.map((p) => (
                    <HStack key={p} gap={3} vAlign="center">
                      <Icon icon={principleIcon[p]} size="lg" color="accent" />
                      <Heading level={3}>{p}</Heading>
                    </HStack>
                  ))}
                </Grid>
                <Divider variant="strong" />
              </VStack>

              {/* This month */}
              <VStack gap={4}>
                <HStack gap={3} vAlign="center" wrap="wrap">
                  <StackItem size="fill">
                    <Heading level={2}>This month: {monthName}</Heading>
                  </StackItem>
                  <Link href={href('calendar')}>Full calendar</Link>
                </HStack>
                <List hasDividers edge="flush">
                  {thisMonth.map((m) => {
                    const past =
                      m.date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    return (
                      <ListItem
                        key={m.id}
                        label={
                          <Text type="body" weight="bold" color={past ? 'secondary' : 'primary'}>
                            {formatDay(m.date)}
                          </Text>
                        }
                        description={
                          <Text type="supporting" color="secondary">
                            {m.title} · {m.rule}
                          </Text>
                        }
                        endContent={
                          <HStack gap={2}>
                            {isToday(m.date, now) && <Badge variant="success" label="Today" />}
                            {past && <Badge variant="neutral" label="Held" />}
                            <Badge
                              variant={m.group === 'Knights' ? 'blue' : 'purple'}
                              label={m.group}
                            />
                          </HStack>
                        }
                      />
                    );
                  })}
                </List>
                <Text type="supporting" color="secondary">
                  {meetingsNote}{' '}
                  <Link href={`mailto:${council.email}`} type="supporting">
                    {council.email}
                  </Link>
                </Text>
              </VStack>

              {/* Pillars: a typographic list */}
              <VStack gap={4}>
                <Heading level={2} id={OUR_COUNCIL_ID}>
                  What our council does
                </Heading>
                <Grid columns={{ minWidth: 400 }} gap={8}>
                  {pillars.map((p, i) => (
                    <VStack key={p.title} gap={2}>
                      <Divider variant="strong" />
                      <HStack gap={3} vAlign="center">
                        <Text type="label" color="accent">
                          {String(i + 1).padStart(2, '0')}
                        </Text>
                        <Heading level={3}>{p.title}</Heading>
                      </HStack>
                      <Text type="body" color="secondary">
                        {p.body}
                      </Text>
                    </VStack>
                  ))}
                </Grid>
              </VStack>

              {/* Giving note */}
              <Card variant="muted" padding={isNarrow ? 6 : 8}>
                <HStack gap={6} vAlign="center">
                  {!isNarrow && (
                    <img src={assets.emblem} alt="" {...stylex.props(styles.emblemSmall)} />
                  )}
                  <StackItem size="fill">
                    <Blockquote cite={council.fullName}>
                      <Text type="large">{council.givingNote}</Text>
                    </Blockquote>
                  </StackItem>
                </HStack>
              </Card>

              {/* Founder */}
              <VStack gap={4}>
                <Heading level={2}>Our founder</Heading>
                <Stack direction={isNarrow ? 'vertical' : 'horizontal'} gap={8} vAlign="center">
                  <Card padding={2} elevation="low" width="100%" maxWidth={300}>
                    <AspectRatio ratio={4 / 5} fit="cover">
                      <img
                        src={assets.mcgivney}
                        alt={assets.mcgivneyAlt}
                        {...stylex.props(styles.portrait)}
                      />
                    </AspectRatio>
                  </Card>
                  <StackItem size="fill">
                    <VStack gap={4}>
                      <Text type="label" color="secondary">
                        Founder of the Knights of Columbus
                      </Text>
                      <Text as="h3" type="display-2">
                        {founder.name}
                      </Text>
                      <Text type="large" weight="normal" color="secondary">
                        {founder.blurb}
                      </Text>
                      <HStack>
                        <Button
                          label="Read about our founder"
                          variant="secondary"
                          href={founder.url}
                          target="_blank"
                        />
                      </HStack>
                    </VStack>
                  </StackItem>
                </Stack>
              </VStack>
            </VStack>
          </LayoutContent>
        }
      />
    </Shell>
  );
}
